/* Scenario data for "How to redirect a domain to another domain". Everything a variant would
   change (domains, record values, tips, end card) lives here, never in scenes. */
export type RedirectDomainProps = {
    /** The domain being moved away from. */
    oldDomain: string;
    /** Where the site lives now. */
    newDomain: string;
    /** A deep link used for the "right room, not the front door" examples. */
    deepPath: string;
    /** DNS records the Connect DNS window shows for the old (root) domain. Illustrative values in
        the real format (A → edge IP, TXT → reh-verify=<edge>, CNAME www → <edge>); the VO says
        "copy yours, not mine". */
    records: readonly { type: 'A' | 'TXT' | 'CNAME'; name: string; value: string }[];
    tips: { screenshot: string; privateWindow: string; padlock: string; expiry: string };
    endLines: readonly [string, string];
    endSub: string;
    /** End-card QR: a RedirHub branded link; label is exactly the URL without the scheme. */
    qr: { value: string; label: string };
};

export const redirectDomainDefaults: RedirectDomainProps = {
    oldDomain: 'mydomain.com',
    newDomain: 'mybrand.com',
    deepPath: '/menu',
    records: [
        { type: 'A', name: '@', value: '3.33.236.10' },
        { type: 'TXT', name: '@', value: 'reh-verify=k7m2qx.rediredge.com' },
        { type: 'CNAME', name: 'www', value: 'k7m2qx.rediredge.com' },
    ],
    tips: {
        screenshot: 'Screenshot your DNS first.',
        privateWindow: 'Test in a private window.',
        padlock: 'Private ≠ honest.',
        expiry: 'Keep renewing the old domain.',
    },
    endLines: ['Old domain.', 'Fixed.'],
    endSub: 'Every old link lands. With HTTPS.',
    qr: { value: 'https://redirhub.com/qr', label: 'redirhub.com/qr' },
};
