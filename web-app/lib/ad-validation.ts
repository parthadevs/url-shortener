const ALLOWED_AD_NETWORKS = [
    'syndicated.snapchat.com',
    'ads.google.com',
    'advertising.com',
    'doubleclick.net',
    'googleadservices.com',
    'adnxs.com',
    'adsrvr.org',
    'adform.net',
    'rubiconproject.com',
    'pubmatic.com',
    'openx.net',
    'criteo.com',
    'taboola.com',
    'outbrain.com',
    'mgid.com',
    'adsterra.com',
    'popads.net',
    'popcash.net',
    'hilltopads.com',
    'propellerads.com',
    'adclicks.io',
    'trafficjunky.com',
    'exoclick.com',
];

interface ValidationResult {
    isValid: boolean;
    reason?: string;
}

export function validateAdUrl(url: string | null | undefined): ValidationResult {
    if (!url || typeof url !== 'string') {
        return { isValid: false, reason: 'No URL provided' };
    }

    const trimmedUrl = url.trim();
    
    if (trimmedUrl === '') {
        return { isValid: false, reason: 'Empty URL' };
    }

    try {
        const parsed = new URL(trimmedUrl);
        
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return { isValid: false, reason: 'Invalid protocol' };
        }

        const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();
        
        const isAllowed = ALLOWED_AD_NETWORKS.some(network => 
            hostname === network || hostname.endsWith(`.${network}`)
        );
        
        if (!isAllowed) {
            return { isValid: false, reason: 'Ad network not in whitelist' };
        }
        
        return { isValid: true };
    } catch {
        return { isValid: false, reason: 'Invalid URL format' };
    }
}

export function getAdNetworkFromUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        return parsed.hostname.replace(/^www\./, '');
    } catch {
        return null;
    }
}
