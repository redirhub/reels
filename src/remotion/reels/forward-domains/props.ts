/* Scenario data for "How to forward multiple domains to one website (with HTTPS)". Everything a
   variant would change (domains, records, tips, end card) lives here, never in scenes. */
export type ForwardDomainsProps = {
    /** The main address, exactly as people should see it. */
    main: string;
    /** The four extra domains, in the order the film introduces them. The typo is third. */
    extras: readonly [string, string, string, string];
    /** Letters of the typo that are swapped (start, end) in extras[2]. */
    typoSpan: readonly [number, number];
    /** Documentation IP used for "where the site lives" (RFC 5737). */
    hostIp: string;
    /** The deep path the "keep the path" beat names (VO: "mybrand.net/pricing"). */
    deepPath: string;
    /** DNS records the Connect DNS dialog shows for mybrand.net (the real format; the VO says copy yours). */
    records: readonly { change: 'Replace' | 'Add'; type: 'A' | 'TXT' | 'CNAME'; name: string; from?: string; value: string }[];
    tips: { main: string; csv: string; csvPath: string; mx: string; mxSub: string };
    end: { lines: readonly [string, string]; sub: string; cta: string };
    /** The end card's QR: a working RedirHub link, its label exactly that URL without the scheme. */
    qr: { value: string; label: string };
};

export const forwardDomainsDefaults: ForwardDomainsProps = {
    main: 'mybrand.com',
    extras: ['mybrand.net', 'mybrand.co', 'mybrnad.com', 'getmybrand.com'],
    typoSpan: [3, 6],
    hostIp: '203.0.113.10',
    deepPath: '/pricing',
    records: [
        { change: 'Replace', type: 'A', name: '@', from: '203.0.113.7', value: '3.33.236.10' },
        { change: 'Add', type: 'TXT', name: '@', value: 'rehd-verify=k7x2pq.rediredge.com' },
        { change: 'Add', type: 'CNAME', name: 'www', value: 'k7x2pq.rediredge.com' },
    ],
    tips: {
        main: 'Keep the one that already ranks, or has links.',
        csv: 'Import them all from one CSV.',
        csvPath: 'Create → Import CSV',
        mx: 'Leave MX records alone.',
        mxSub: 'They’re your email.',
    },
    end: { lines: ['Five domains.', 'One website.'], sub: 'Links to everything are in the description.', cta: 'Stuck? Reach out. We’re happy to help.' },
    // Sits beside "Stuck? Reach out." (200 on 2026-10-14; short enough for a readable label). Swap for the video's branded link once it exists.
    qr: { value: 'https://redirhub.com/support', label: 'redirhub.com/support' },
};
