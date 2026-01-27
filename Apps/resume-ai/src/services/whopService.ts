
// @ts-ignore
const WHOP_API_KEY = import.meta.env.VITE_WHOP_API_KEY;
const API_BASE = 'https://api.whop.com/v2';

export interface WhopMember {
    id: string;
    access_level: 'no_access' | 'admin' | 'customer';
    status: string;
    user: {
        email: string;
    };
}
const getCompanyId = async (): Promise<string | null> => {
    try {
        const response = await fetch(`${API_BASE}/companies`, {
            headers: { 'Authorization': `Bearer ${WHOP_API_KEY}` }
        });
        if (!response.ok) return null;
        const result = await response.json();
        return result.data?.[0]?.id || null;
    } catch (e) {
        return null;
    }
};

export const verifySubscription = async (email: string): Promise<boolean> => {
    if (!WHOP_API_KEY) {
        console.error("Whop API Key is missing. Access denied.");
        return false;
    }

    try {
        const companyId = await getCompanyId();
        if (!companyId) {
            console.error("Could not find a company associated with this Whop API key.");
            return false;
        }

        const response = await fetch(`${API_BASE}/members?email=${encodeURIComponent(email)}&company_id=${companyId}`, {
            headers: {
                'Authorization': `Bearer ${WHOP_API_KEY}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Whop API error: ${response.statusText}`);
        }

        const result = await response.json();
        const members = result.data as WhopMember[];

        if (!members || members.length === 0) {
            return false;
        }

        return members.some(member => member.access_level === 'customer' || member.access_level === 'admin');
    } catch (error) {
        console.error("Error verifying Whop subscription:", error);
        throw error;
    }
};

export const verifyMembershipId = async (membershipId: string): Promise<boolean> => {
    if (!WHOP_API_KEY) return false;

    try {
        const response = await fetch(`${API_BASE}/memberships/${membershipId}`, {
            headers: {
                'Authorization': `Bearer ${WHOP_API_KEY}`,
            }
        });

        if (!response.ok) return false;

        const membership = await response.json();
        // Valid statuses: active, trialing, completed (one-time purchase)
        const validStatuses = ['active', 'trialing', 'completed'];
        return validStatuses.includes(membership.status);
    } catch (error) {
        console.error("Error verifying membership ID:", error);
        return false;
    }
};
