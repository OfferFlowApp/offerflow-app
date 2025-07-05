
import { NextResponse, type NextRequest } from 'next/server';
import { checkPermission, getUserIdFromToken } from '@/lib/server-utils';
import { adminDb } from '@/lib/firebase-admin';
import type { OfferSheetData } from '@/lib/types';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
    const authToken = request.headers.get('Authorization');

    const { allowed, message, status } = await checkPermission(
        authToken,
        (entitlements) => entitlements.canSaveTemplates
    );

    if (!allowed) {
        return NextResponse.json({ error: { message } }, { status });
    }

    try {
        const userId = await getUserIdFromToken(authToken!);
        if (!userId) {
             return NextResponse.json({ error: { message: 'User ID not found in token.' } }, { status: 401 });
        }
        
        const body = await request.json();
        const offerData: OfferSheetData = body.offerData;

        if (!offerData || !offerData.customerInfo || !offerData.products) {
            return NextResponse.json({ error: { message: 'Invalid template data provided.' } }, { status: 400 });
        }

        // Convert date strings from JSON back to Firestore Timestamps
        const templateToSave = {
            ...offerData,
            validityStartDate: offerData.validityStartDate ? Timestamp.fromDate(new Date(offerData.validityStartDate)) : null,
            validityEndDate: offerData.validityEndDate ? Timestamp.fromDate(new Date(offerData.validityEndDate)) : null,
            createdAt: Timestamp.now(),
            templateName: offerData.customerInfo.company || offerData.customerInfo.name || `Template ${new Date().toLocaleDateString()}`
        };
        
        const docRef = await adminDb.collection('users').doc(userId).collection('templates').add(templateToSave);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Template saved successfully!',
          templateId: docRef.id
        });

    } catch (error: any) {
        console.error('[API /save-template] Error saving template:', error);
        return NextResponse.json({ error: { message: 'Failed to save template due to a server error.' } }, { status: 500 });
    }
}
