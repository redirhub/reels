/* Scenario data for "How to Redirect Hundreds of Domains at Once (One Spreadsheet)" (YouTube W46). The approved
   frames (frames.gen.tsx) carry the layouts; the names and copy a scene adds or animates live here. */
export const NAMES = {
    team: 'Glomvo',
    /** The thread. NXDOMAIN, but registered (open-questions.md D-1); Leo kept it (2026-11-10). */
    kip: 'kipzoo.com',
    next: 'rimboa.com',
} as const;

export type BulkRedirectsProps = {
    /** Visits on kipzoo.com in Act F (an Example number, labelled on screen). */
    visits: number;
};
export const bulkRedirectsDefaults: BulkRedirectsProps = { visits: 63 };
