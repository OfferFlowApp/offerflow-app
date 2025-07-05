
import { NextResponse, type NextRequest } from 'next/server';
import { getUserIdFromToken } from '@/lib/server-utils';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { OfferSheetData } from '@/lib/types';

// Get a list of recent offer sheets for the user OR a single offer sheet by ID
export async function GET(request: NextRequest) {
    const authToken = request.headers.get('Authorization');
    const userId = await getUserIdFromToken(authToken || '');

    if (!userId) {
        return NextResponse.json({ error: { message: 'User not authenticated.' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const offerId = searchParams.get('id');

    try {
        if (offerId) {
            // Fetch a single offer sheet
            const offerRef = adminDb.collection('users').doc(userId).collection('offerSheets').doc(offerId);
            const offerSnap = await offerRef.get();

            if (!offerSnap.exists) {
                return NextResponse.json({ error: { message: 'Offer sheet not found.' } }, { status: 404 });
            }

            const offerData = offerSnap.data() as OfferSheetData;
            
            // Convert Timestamps to ISO strings for JSON serialization
            const serializableData = {
                ...offerData,
                id: offerSnap.id,
                validityStartDate: offerData.validityStartDate ? (offerData.validityStartDate as unknown as Timestamp).toDate().toISOString() : null,
                validityEndDate: offerData.validityEndDate ? (offerData.validityEndDate as unknown as Timestamp).toDate().toISOString() : null,
                lastSaved: (offerData.lastSaved as unknown as Timestamp)?.toDate().toISOString(),
            };

            return NextResponse.json(serializableData);

        } else {
            // Fetch the list of recent offer sheets for the homepage
            const offersQuery = adminDb.collection('users').doc(userId).collection('offerSheets')
                .orderBy('lastSaved', 'desc')
                .limit(10);
            
            const querySnapshot = await offersQuery.get();
            const offers = querySnapshot.docs.map(doc => {
                const data = doc.data() as OfferSheetData;
                return {
                    id: doc.id,
                    customerInfo: data.customerInfo,
                    lastSaved: (data.lastSaved as unknown as Timestamp)?.toDate().toISOString(),
                };
            });
            return NextResponse.json(offers);
        }
    } catch (error: any) {
        console.error('[API /offer-sheets GET] Error:', error);
        return NextResponse.json({ error: { message: 'Failed to fetch offer sheets.' } }, { status: 500 });
    }
}


// Create or Update an offer sheet
export async function POST(request: NextRequest) {
    const authToken = request.headers.get('Authorization');
    const userId = await getUserIdFromToken(authToken || '');

    if (!userId) {
        return NextResponse.json({ error: { message: 'User not authenticated.' } }, { status: 401 });
    }

    try {
        const { offerData } = await request.json();
        
        if (!offerData || !offerData.customerInfo || !offerData.products) {
            return NextResponse.json({ error: { message: 'Invalid offer sheet data provided.' } }, { status: 400 });
        }

        const offerId = offerData.id;
        const collectionRef = adminDb.collection('users').doc(userId).collection('offerSheets');
        
        const dataToSave: Partial<OfferSheetData> & { lastSaved: Timestamp } = {
            ...offerData,
            validityStartDate: offerData.validityStartDate ? Timestamp.fromDate(new Date(offerData.validityStartDate)) : null,
            validityEndDate: offerData.validityEndDate ? Timestamp.fromDate(new Date(offerData.validityEndDate)) : null,
            lastSaved: Timestamp.now(),
        };
        delete dataToSave.id; // Don't store the ID in the document body

        let savedOfferId: string;

        if (offerId) {
            // Update existing document
            const docRef = collectionRef.doc(offerId);
            // Verify ownership before updating
            const docSnap = await docRef.get();
            if(!docSnap.exists) {
                 return NextResponse.json({ error: { message: 'Document not found.' } }, { status: 404 });
            }
            await docRef.set(dataToSave, { merge: true });
            savedOfferId = offerId;
        } else {
            // Create new document
            const newDocRef = await collectionRef.add(dataToSave);
            savedOfferId = newDocRef.id;
        }
        
        return NextResponse.json({ 
          success: true, 
          message: 'Offer sheet saved successfully!',
          offerId: savedOfferId
        });

    } catch (error: any) {
        console.error('[API /offer-sheets POST] Error:', error);
        return NextResponse.json({ error: { message: 'Failed to save offer sheet due to a server error.' } }, { status: 500 });
    }
}
