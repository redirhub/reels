/* Scenario data for "How to Change Your Domain Name Without Losing SEO" (YouTube W44). The story's names,
   addresses and copy live here, never in scenes. NAMES is the shop's identity, shared by every prop. */
export const NAMES = {
    oldName: 'Frosty Fusion',
    newName: 'Frosty Bites',
    /** Both unregistered on 2026-10-25 (open-questions D-1); mockups only. */
    old: 'getfrostyfusion.com',
    new: 'getfrostybites.com',
    path: '/flavors/strawberry',
    query: 'best strawberry ice cream',
} as const;

export type ChangeDomainProps = {
    /** The map: old path → new path. The strawberry page is the story's thread; a changed path gets CHANGED. */
    mapRows: readonly (readonly [string, string])[];
    /** The site as Google sees it (Pages, Flip): x, y, path, history badge, hero. */
    tree: readonly { x: number; y: number; path: string; badge: string; hero?: boolean }[];
    /** Changed pages pasted into the migration form; a row with no new URL is skipped. */
    paste: readonly (readonly [string, string | null])[];
    end: { lines: readonly [string, string]; sub: string; cta: string };
    /** The end card's QR: a working RedirHub link, its label exactly that URL without the scheme. */
    qr: { value: string; label: string };
};

export const changeDomainDefaults: ChangeDomainProps = {
    mapRows: [['/', '/'], ['/flavors', '/flavors'], ['/flavors/strawberry', '/flavors/strawberry'], ['/about', '/about'], ['/blog/strawberry-season', '/journal/strawberry-season']],
    tree: [
        { x: 120, y: 520, path: '/', badge: '5 yrs · 120 links' },
        { x: 620, y: 360, path: '/flavors', badge: '5 yrs · 30 links' },
        { x: 620, y: 700, path: '/blog', badge: '3 yrs · 14 links' },
        { x: 1180, y: 290, path: '/flavors/strawberry', badge: '#1 · 48 links · 5 yrs', hero: true },
        { x: 1180, y: 480, path: '/flavors/vanilla-bean', badge: '4 yrs · 12 links' },
        { x: 1180, y: 700, path: '/blog/strawberry-season', badge: '2 yrs · 9 links' },
    ],
    paste: [['/blog/strawberry-secret', '/journal/strawberry-secret'], ['/p/strawberry-shake', '/menu/strawberry-shake'], ['/specials/summer', null]],
    end: { lines: ['New name.', 'Same spot.'], sub: 'Links to everything are in the description.', cta: 'Stuck? Reach out. We’re happy to help.' },
    // As on W43: a working page beside "Stuck? Reach out." Swap for the video's branded link once Kris gives one.
    qr: { value: 'https://redirhub.com/support', label: 'redirhub.com/support' },
};
