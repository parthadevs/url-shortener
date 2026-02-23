// Basic URL validation utility for the frontend

// 1. Prohibited Hostnames (e.g., recursive loops or internal network)
const BLACKLISTED_HOSTS = [
    'localhost', '127.0.0.1', '0.0.0.0', '::1',
    'metadata.google.internal', // Prevents SSRF on cloud providers
    '169.254.169.254',           // AWS/Azure metadata
];

// 2. Prohibited extensions (e.g., direct downloads that could be malware)
const DANGEROUS_EXTENSIONS = ['.exe', '.dmg', '.sh', '.bat', '.msi'];

export async function validateLongUrl(url: string): Promise<{ isValid: boolean; error?: string }> {
    try {
        const trimmedUrl = url.trim();

        // --- Layer 1: Structural Validation ---
        const parsed = new URL(trimmedUrl);

        // Only allow web protocols (No javascript:, file:, etc.)
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed.' };
        }

        // --- Layer 2: Blacklist & Security Checks ---
        const hostname = parsed.hostname.toLowerCase();

        if (BLACKLISTED_HOSTS.includes(hostname) || hostname.endsWith('.local')) {
            return { isValid: false, error: 'Invalid or restricted destination.' };
        }

        if (DANGEROUS_EXTENSIONS.some(ext => parsed.pathname.toLowerCase().endsWith(ext))) {
            return { isValid: false, error: 'Direct links to executable files are not allowed.' };
        }

        // --- Layer 3: Anti-Recursion ---
        // Prevent users from shortening your own short links (shortcash.example.com/abc)
        if (hostname === 'shortcash.example.com') {
            return { isValid: false, error: 'Cannot shorten a URL from this service.' };
        }

        // --- Layer 4: Real-world Reachability (Optional but Recommended) ---
        // Note: In a real app, use a library like 'axios' or 'node-fetch' with a timeout
        // const isReachable = await checkLinkStatus(trimmedUrl);

        return { isValid: true };

    } catch (e) {
        return { isValid: false, error: 'The provided string is not a valid absolute URL.' };
    }
}

export function getDefaultRedirectUrl(): string {
    return '/';
}