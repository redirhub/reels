/* Everything scenario-specific lives here, so variants (another brand, language
   or campaign) are new props rather than copied scenes. */
export type QrNoReprintProps = {
    /** Printed quantity, as displayed. */
    flyerCount: string;
    /** The customer's own domain. */
    domain: string;
    /** Path of the RedirHub-managed QR link on go.{domain}. */
    linkPath: string;
    /** Page the link pointed to before the site changed (now 404). */
    oldPath: string;
    /** Page it should point to now. */
    newPath: string;
    /** Value actually encoded in every QR code shown. Must be a real, working URL. */
    qrValue: string;
};

export const qrNoReprintDefaults: QrNoReprintProps = {
    flyerCount: '10,000',
    domain: 'yourbrand.com',
    linkPath: 'spring',
    oldPath: 'spring-sale',
    newPath: 'sale',
    qrValue: 'https://www.redirhub.com/dynamic-qr-codes',
};

export function links(p: QrNoReprintProps) {
    return {
        shortLink: `go.${p.domain}/${p.linkPath}`,
        oldUrl: `https://${p.domain}/${p.oldPath}`,
        newUrl: `https://${p.domain}/${p.newPath}`,
        oldDisplay: `${p.domain}/${p.oldPath}`,
        newDisplay: `${p.domain}/${p.newPath}`,
    };
}
