/* Everything scenario-specific lives here, so variants (another link, another joke,
   another language) are new props rather than copied scenes. */
export type FreeCoffeeProps = {
    /** The company's site (where the link is posted, and where pages live). */
    site: string;
    /** The branded-link subdomain pointed at RedirHub (RedirHub recommends link.yourbrand.com). */
    linkHost: string;
    /** The branded link's path: the bait. */
    path: string;
    /** Where the link pointed before: a campaign page that was taken down (404). */
    oldPath: string;
    /** Where it points after the fix. */
    newPath: string;
    /** The page the fixed link lands on. */
    payoff: string;
    payoffEmoji: string;
    /** Clicks shown on the fixed row (everyone who tried the broken link). */
    clicks: string;
    /** End card: two lines (the second is the accent), then a smaller line. */
    endLines: readonly [string, string];
    endSub: string;
};

export const freeCoffeeDefaults: FreeCoffeeProps = {
    site: 'brand.com',
    linkHost: 'link.brand.com',
    path: 'free-coffee',
    oldPath: 'promo/free-coffee',
    newPath: 'really-free-coffee',
    payoff: 'Nice try.',
    payoffEmoji: '☕',
    clicks: '2.1K',
    endLines: ['Broken link.', 'Fixed.'],
    endSub: 'Same link. New destination.',
};

export function urls(p: FreeCoffeeProps) {
    return {
        link: `${p.linkHost}/${p.path}`,
        oldDest: `${p.site}/${p.oldPath}`,
        newDest: `${p.site}/${p.newPath}`,
        oldUrl: `https://${p.site}/${p.oldPath}`,
        newUrl: `https://${p.site}/${p.newPath}`,
    };
}
