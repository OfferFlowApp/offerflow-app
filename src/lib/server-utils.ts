import { adminAuth, adminDb } from './firebase-admin';
import { getEntitlements } from '@/config/plans';
import type { PlanEntitlements, UserSubscription } from './types';

/**
 * Verifies a Firebase ID token and returns the user's UID.
 * @param {string} authToken - The 'Bearer <token>' string from the Authorization header.
 * @returns {Promise<string | null>} The UID of the user or null if verification fails.
 */
export async function getUserIdFromToken(authToken: string): Promise<string | null> {
    if (!authToken || !authToken.startsWith('Bearer ')) {
        return null;
    }
    const token = authToken.substring(7);
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        console.error("Error verifying auth token:", error);
        return null;
    }
}

/**
 * Fetches a user's subscription from Firestore and returns their entitlements.
 * @param {string} userId - The UID of the user.
 * @returns {Promise<PlanEntitlements>} The user's entitlements based on their plan.
 */
export async function getUserEntitlements(userId: string): Promise<PlanEntitlements> {
    try {
        const subRef = adminDb.collection('users').doc(userId).collection('subscription').doc('current');
        const subSnap = await subRef.get();

        if (!subSnap.exists) {
            return getEntitlements('none'); // Default entitlements for a user with no subscription doc
        }
        
        const subData = subSnap.data() as UserSubscription;
        return getEntitlements(subData.planId);
    } catch (error) {
        console.error(`Failed to get entitlements for user ${userId}:`, error);
        // Fallback to most restrictive entitlements on error
        return getEntitlements('none');
    }
}

/**
 * A generic, reusable server-side permission checker.
 * @param authToken The 'Bearer <token>' string from the Authorization header.
 * @param permissionChecker A function that takes a user's entitlements and returns true if they have permission.
 * @returns An object indicating if the action is allowed, with a message and HTTP status code.
 */
export async function checkPermission(
    authToken: string | null | undefined, 
    permissionChecker: (entitlements: PlanEntitlements) => boolean
): Promise<{allowed: boolean; message: string; status: number}> {
    if (!authToken) {
        return { allowed: false, message: 'Authorization header missing.', status: 401 };
    }
    const userId = await getUserIdFromToken(authToken);
    if (!userId) {
        return { allowed: false, message: 'Invalid or expired token.', status: 401 };
    }
    const entitlements = await getUserEntitlements(userId);
    if (permissionChecker(entitlements)) {
        return { allowed: true, message: 'Allowed', status: 200 };
    } else {
        return { allowed: false, message: 'Your current plan does not permit this action.', status: 403 };
    }
}
