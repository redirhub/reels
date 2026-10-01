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
];
