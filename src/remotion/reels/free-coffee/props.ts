/* Everything scenario-specific lives here, so variants (another URL, another joke,
   another language) are new props rather than copied scenes. */
export type FreeCoffeeProps = {
    /** Illustrative domain shown in the browser. */
    domain: string;
    /** The broken link's path: the bait. */
    path: string;
    /** Where the fixed link lands. Only revealed in the payoff. */
    destPath: string;
    /** The payoff page. */
    payoff: string;
    payoffEmoji: string;
    /** End card, two lines; the second is the accent. */
    endLines: readonly [string, string];
};

export const freeCoffeeDefaults: FreeCoffeeProps = {
    domain: 'brand.com',
    path: 'free-coffee',
    destPath: 'nice-try',
    payoff: 'Nice try.',
    payoffEmoji: '☕',
    endLines: ['Broken link.', 'Fixed.'],
};

export const link = (p: FreeCoffeeProps) => `${p.domain}/${p.path}`;
export const dest = (p: FreeCoffeeProps) => `${p.domain}/${p.destPath}`;
