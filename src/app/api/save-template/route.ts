
import { NextResponse, type NextRequest } from 'next/server';
import { checkPermission } from '@/lib/server-utils';

export async function POST(request: NextRequest) {
    const authToken = request.headers.get('Authorization');

    // Use the permission checker to see if the user has the `canSaveTemplates` entitlement.
    const { allowed, message, status } = await checkPermission(
        authToken,
        (entitlements) => entitlements.canSaveTemplates
    );

    // If not allowed, return a forbidden error.
    if (!allowed) {
        return NextResponse.json({ error: { message } }, { status });
    }

    // --- Placeholder for actual template saving logic ---
    // In a real implementation, you would:
    // 1. Get the user's ID from the verified token.
    // 2. Get the template data from the request body.
    //    const { offerData } = await request.json();
    // 3. Save the template data to a 'templates' collection in Firestore under the user's ID.
    //    await adminDb.collection('users').doc(userId).collection('templates').add(offerData);
    
    console.log('[API /save-template] User has permission. (Placeholder logic executed)');

    return NextResponse.json({ 
      success: true, 
      message: 'Server confirmed you have access! Template saving feature coming soon.' 
    });
}
