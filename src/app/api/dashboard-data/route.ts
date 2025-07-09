
import { NextResponse, type NextRequest } from 'next/server';
import { getUserIdFromToken } from '@/lib/server-utils';
import { adminDb } from '@/lib/firebase-admin';

// The new analytics page will be at /analytics
// This file is now deprecated and can be removed.
// I am renaming this file to reflect that it is no longer the dashboard.
export async function GET(request: NextRequest) {
    const authToken = request.headers.get('Authorization');
    const userId = await getUserIdFromToken(authToken || '');

    if (!userId) {
        return NextResponse.json({ error: { message: 'User not authenticated.' } }, { status: 401 });
    }

    // Fetch real data from Firestore
    const offerSheetsRef = adminDb.collection('users').doc(userId).collection('offerSheets');
    const offerSheetsSnapshot = await offerSheetsRef.get();
    
    const totalOffersCreated = offerSheetsSnapshot.size;

    // Data structure for the dashboard, now with some real data
    const data = {
        kpi: {
            totalOffers: { value: totalOffersCreated.toString(), change: '' },
            conversions: { value: '+235', change: '+180.1%' }, // Mock data, to be implemented
            conversionRate: { value: '1.92%', change: '+0.5%' }, // Mock data
            avgOfferValue: { value: '€1,250', change: '+12%' }, // Mock data,
        },
        overviewChartData: [
            { name: 'Jan', created: 40, exported: 24 },
            { name: 'Feb', created: 30, exported: 13 },
            { name: 'Mar', created: 50, exported: 48 },
            { name: 'Apr', created: 27, exported: 39 },
            { name: 'May', created: 18, exported: 18 },
            { name: 'Jun', created: 23, exported: 38 },
        ],
        topProductsData: [
            { name: 'Premium Widget', value: 400, fill: 'hsl(var(--chart-1))' },
            { name: 'Standard Unit', value: 300, fill: 'hsl(var(--chart-2))' },
            { name: 'Basic Component', value: 300, fill: 'hsl(var(--chart-3))' },
            { name: 'Advanced Gizmo', value: 200, fill: 'hsl(var(--chart-4))' },
        ]
    };

    return NextResponse.json(data);
}
