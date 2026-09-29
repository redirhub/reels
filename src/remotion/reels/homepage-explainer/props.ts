/* Everything scenario-specific lives here, so variants (another brand, language
   or campaign) are new props rather than copied scenes. */
export type HomepageExplainerProps = {
    /** The customer's own (demo) domain. */
    domain: string;
    /** An extra domain the customer owns that should forward to `domain`. */
    extraDomain: string;
    /** Path of the branded short link / QR on go.{domain}. */
    linkPath: string;
    /** Page the short link pointed to before, and the page it points to now. */
    oldPath: string;
    newPath: string;
    /** Migration mapping shown in the CSV import (old path → new path). */
    migration: readonly (readonly [string, string])[];
    /** Redirects in the imported CSV, as displayed. */
    migrationCount: string;
    /** URL encoded in the on-screen story QRs. Must be a real, working URL. */
    qrValue: string;
    /** Stat tiles. Each value must be an Approved external claim in Notion's
        Approved Claims & Message Library, worded exactly as its caveat requires. */
    stats: readonly { value: string; label: string }[];
};

export const homepageExplainerDefaults: HomepageExplainerProps = {
    domain: 'yourbrand.com',
    extraDomain: 'yourbrand.net',
    linkPath: 'spring',
    oldPath: 'spring-sale',
    newPath: 'sale',
    migration: [
        ['/blog/2019/launch', '/news/launch'],
        ['/products/widget-pro', '/shop/widget-pro'],
        ['/about-us.html', '/company'],
        ['/support/faq', '/help'],
        ['/pricing.php', '/pricing'],
    ],
    migrationCount: '248',
    // redirhub.com/qr is RedirHub's own branded link → /dynamic-qr-codes. The demo
    // domain isn't ours, so story QRs never encode it.
    qrValue: 'https://redirhub.com/qr',
    stats: [
        { value: '99.99%', label: 'platform uptime' },
        { value: '130', label: 'Global PoPs' },
        { value: '~90ms', label: 'global average response time' },
        { value: '1M+', label: 'domains redirected daily' },
    ],
};

export function links(p: HomepageExplainerProps) {
    return {
        shortLink: `go.${p.domain}/${p.linkPath}`,
        oldUrl: `https://${p.domain}/${p.oldPath}`,
        newUrl: `https://${p.domain}/${p.newPath}`,
        oldDisplay: `${p.domain}/${p.oldPath}`,
        newDisplay: `${p.domain}/${p.newPath}`,
    };
}
