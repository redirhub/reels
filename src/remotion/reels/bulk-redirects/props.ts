/* Scenario data for "How to Redirect Hundreds of Domains at Once (One Spreadsheet)" (YouTube W46, v6). The frames
   (frames.gen.tsx, from style-canvas/w46_props.py) carry the layouts and Northway's domains; what a scene animates
   lives here. */
export type BulkRedirectsProps = {
    /** Visits on the misspelling nortwaysoft.com in Act F (an Example number, labelled on screen). */
    visits: number;
};
export const bulkRedirectsDefaults: BulkRedirectsProps = { visits: 63 };
