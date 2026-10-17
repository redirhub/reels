/* All scenario data for the EZMarketing customer story. The script and the on-screen text are
   final (approved): change them only with the owner. Demo domains only: the client's real names and
   domains are never shown (customer approval). */
export type EzMarketingProps = {
    /** The eleven narrator lines, in order. In the text-only cut each one is the caption of its beat. */
    script: readonly string[];
    agency: { name: string; sub: string };
    /** Demo domains: the acquired company's old site and the new owner's site. */
    oldDomain: string;
    newDomain: string;
    paths: { careers: string; jobs: string; contact: string };
    visits: number;
    /** End card: first line white, second teal, then a small line. */
    endLines: readonly [string, string];
    endSub: string;
    /** Covers and thumbnails: render a frame without the burned-in caption. */
    hideCaptions?: boolean;
};

export const ezMarketingDefaults: EzMarketingProps = {
    script: [
        'A company gets sold. Its old links keep getting clicked.',
        'Like this Careers link. It was landing on a homepage.',
        'EZMarketing, an agency in Lancaster, Pennsylvania, ran that company’s website.',
        'After the sale, they forwarded the domain and shut the hosting down.',
        'Then the client asked: can the old Careers page still work?',
        'Here’s the catch. Their forwarding sent every old link to one page.',
        'So they pointed the domain at RedirHub and set up three redirects.',
        'Ten minutes from sign-up to live. HTTPS included. No server.',
        'In twenty days, that old Careers link got 201 visits.',
        'Every one landed on the new Jobs page.',
        'The client moved on. The old links still work.',
    ],
    agency: { name: 'EZMarketing', sub: 'Agency · Lancaster, PA' },
    oldDomain: 'mydomain.com',
    newDomain: 'yourcompany.com',
    paths: { careers: '/careers', jobs: '/jobs', contact: '/contact' },
    visits: 201,
    endLines: ['Old links.', 'Fixed.'],
    endSub: 'Full story ↓',
};

/** The on-screen text column (one idea per screen, ≤ 6 words). It carries the story muted. */
export const CARDS = {
    clicked: 'Still getting clicked.',
    jobs: 'Where are the jobs?',
    handover: 'Handover: done.',
    ask: 'Can Careers still work?',
    fan: 'Every link → one page.',
    redirects: '3 redirects.',
    chips: ['10 minutes', 'HTTPS ✓', 'No server'],
    visits: '201 visits',
    visitsSub: 'Old Careers link · 20 days',
    right: 'Right page.',
    still: 'The old links still work.',
} as const;
