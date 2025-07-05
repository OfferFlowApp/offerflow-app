
import { NextResponse, type NextRequest } from 'next/server';
import { checkPermission, getUserIdFromToken } from '@/lib/server-utils';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
    const authToken = request.headers.get('Authorization');

    const { allowed, message, status } = await checkPermission(
        authToken,
        (entitlements) => entitlements.canSaveCustomers
    );

    if (!allowed) {
        return NextResponse.json({ error: { message } }, { status });
    }

    try {
        const userId = await getUserIdFromToken(authToken!);
        if (!userId) {
             return NextResponse.json({ error: { message: 'User ID not found in token.' } }, { status: 401 });
        }
        
        const { customerInfo } = await request.json();

        if (!customerInfo || (!customerInfo.name && !customerInfo.company)) {
            return NextResponse.json({ error: { message: 'Invalid customer data provided. A name or company is required.' } }, { status: 400 });
        }

        const customerToSave = {
            ...customerInfo,
            savedAt: Timestamp.now(),
        };
        
        const docRef = await adminDb.collection('users').doc(userId).collection('customers').add(customerToSave);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Customer profile saved successfully!',
          customerId: docRef.id
        });

    } catch (error: any) {
        console.error('[API /save-customer] Error saving customer:', error);
        return NextResponse.json({ error: { message: 'Failed to save customer due to a server error.' } }, { status: 500 });
    }
}
