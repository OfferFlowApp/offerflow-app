
import { NextResponse, type NextRequest } from 'next/server';
import { getUserIdFromToken } from '@/lib/server-utils';

export async function GET(request: NextRequest) {
    const authToken = request.headers.get('Authorization');
    const userId = await getUserIdFromToken(authToken || '');

    if (!userId) {
        return NextResponse.json({ error: { message: 'User not authenticated.' } }, { status: 401 });
    }

    // Placeholder data - in a real implementation, this would query Firestore.
    // For now, it returns the same mock data structure the dashboard expects.
    const mockData = {
        kpi: {
            totalViews: { value: '12,345', change: '+20.1%' },
            conversions: { value: '+235', change: '+180.1%' },
            conversionRate: { value: '1.92%', change: '+0.5%' },
            activeOffers: { value: '57', change: '+2' },
        },
        overviewChartData: [
            { name: 'Jan', views: 400, conversions: 24 },
            { name: 'Feb', views: 300, conversions: 13 },
            { name: 'Mar', views: 500, conversions: 48 },
            { name: 'Apr', views: 278, conversions: 39 },
            { name: 'May', views: 189, conversions: 18 },
            { name: 'Jun', views: 239, conversions: 38 },
        ],
        topProductsData: [
            { name: 'Premium Widget', value: 400, fill: 'hsl(var(--chart-1))' },
            { name: 'Standard Unit', value: 300, fill: 'hsl(var(--chart-2))' },
            { name: 'Basic Component', value: 300, fill: 'hsl(var(--chart-3))' },
            { name: 'Advanced Gizmo', value: 200, fill: 'hsl(var(--chart-4))' },
        ]
    };

    return NextResponse.json(mockData);
}
