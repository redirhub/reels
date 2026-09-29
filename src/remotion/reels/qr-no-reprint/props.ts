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
    /** URL encoded in the story QR codes (flyer, camera, dashboard). Must be a real, working URL. */
    qrValue: string;
    /** URL encoded in the end-card QR. Must be a RedirHub branded link: the link shown
        under the QR is this URL without the scheme, so it matches what a scan opens. */
    ctaQrValue: string;
};

export const qrNoReprintDefaults: QrNoReprintProps = {
    flyerCount: '10,000',
    domain: 'yourbrand.com',
    linkPath: 'spring',
    oldPath: 'spring-sale',
    newPath: 'sale',
    // redirhub.com/qr is RedirHub's own branded link → /dynamic-qr-codes.
    qrValue: 'https://redirhub.com/qr',
    ctaQrValue: 'https://redirhub.com/qr',
};

export function links(p: QrNoReprintProps) {
    return {
        shortLink: `go.${p.domain}/${p.linkPath}`,
        oldUrl: `https://${p.domain}/${p.oldPath}`,
        newUrl: `https://${p.domain}/${p.newPath}`,
        oldDisplay: `${p.domain}/${p.oldPath}`,
        newDisplay: `${p.domain}/${p.newPath}`,
        ctaQrLabel: p.ctaQrValue.replace(/^https?:\/\//, ''),
    };
}
