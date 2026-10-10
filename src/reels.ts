/* Registry of every reel. Remotion Studio, the renderer (scripts/render.mjs)
   and the gallery app all read this list, so adding a reel here publishes it
   everywhere. */
import type { ComponentType } from 'react';
import { LANDSCAPE, VERTICAL } from './remotion/brand/tokens';
import { HomepageExplainer } from './remotion/reels/homepage-explainer/HomepageExplainer';
import { homepageExplainerDefaults } from './remotion/reels/homepage-explainer/props';
import { FreeCoffee } from './remotion/reels/free-coffee/FreeCoffee';
import { freeCoffeeDefaults } from './remotion/reels/free-coffee/props';
import { QrNoReprint } from './remotion/reels/qr-no-reprint/QrNoReprint';
import { qrNoReprintDefaults } from './remotion/reels/qr-no-reprint/props';
import { RedirectDomain, REDIRECT_DOMAIN_SECONDS } from './remotion/reels/redirect-domain/RedirectDomain';
import { redirectDomainDefaults } from './remotion/reels/redirect-domain/props';

export type Reel = {
    /** Composition id and output filename (`out/<id>.mp4`). Letters, numbers, dashes. */
    id: string;
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: ComponentType<any>;
    defaultProps: Record<string, unknown>;
    durationInSeconds: number;
    width: number;
    height: number;
    fps: number;
};

export const reels: Reel[] = [
    {
        id: 'qr-no-reprint',
        title: '10,000 flyers printed. Then the site changed.',
        description: 'A printed QR campaign hits a 404 after a site change; RedirHub flags it and the destination is fixed in one field. No reprint.',
        component: QrNoReprint,
        defaultProps: qrNoReprintDefaults,
        durationInSeconds: 30,
        ...VERTICAL,
    },
    {
        id: 'homepage-explainer',
        title: 'What is RedirHub? (homepage explainer)',
        description: '60s landscape explainer for first-time visitors: keep the link, change the destination. Domain redirects, migrations, branded links & QR, monitoring.',
        component: HomepageExplainer,
        defaultProps: homepageExplainerDefaults,
        durationInSeconds: 60,
        ...LANDSCAPE,
    },
    {
        id: 'free-coffee',
        title: 'Free coffee? (broken link, fixed)',
        description: 'Sound-designed short, no voiceover: a bait link 404s, the fix happens in RedirHub in the next tab (Edit link → new destination → Save changes), and the same click now lands on the joke.',
        component: FreeCoffee,
        defaultProps: freeCoffeeDefaults,
        durationInSeconds: 16,
        ...VERTICAL,
    },
    {
        id: 'redirect-domain',
        title: 'How to redirect a domain to another domain (YouTube, W41)',
        description: 'RedirHub\'s first YouTube video: a 16:9 motion-graphics tutorial. The note on the door (301), the address book (DNS), the ID card (HTTPS), then the walkthrough in RedirHub, the private-window twist and three checks. Timeline estimated from the script until the voiceover exists (Phase 3).',
        component: RedirectDomain,
        defaultProps: redirectDomainDefaults,
        durationInSeconds: REDIRECT_DOMAIN_SECONDS,
        ...LANDSCAPE,
    },
];
