/* Registry of every reel. Remotion Studio, the renderer (scripts/render.mjs)
   and the gallery app all read this list, so adding a reel here publishes it
   everywhere. */
import type { ComponentType } from 'react';
import { VERTICAL } from './remotion/brand/tokens';
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
];
