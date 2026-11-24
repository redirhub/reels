import { useTime, prog, easeOut } from '../../lib/anim';
import { at, headline, ink, mint, mono, orange, paper, Path, Plot, reveal, Server, Stage, Tag } from './Visuals';

export function Hook() {
    const t = useTime();
    const spread = easeOut(prog(t, 0.6, 2));
    return (
        <Stage name="Certificate renewal">
            <div style={{ ...at(88, 240), fontSize: 139, lineHeight: 1.01, letterSpacing: -9, fontWeight: 750 }}>
                One shop.
                <br />
                <span style={{ color: mint }}>Three servers.</span>
            </div>
            <div style={{ ...at(98, 728), fontSize: 45, lineHeight: 1.25, ...reveal(t, 1.8) }}>
                When the certificate renews,
                <br />
                who gets the new copy?
            </div>
            {[2, 1, 0].map((i) => (
                <Server
                    key={i}
                    x={978 + i * 33}
                    y={130 + i * (45 + 87 * spread) + Math.sin(t * 0.75 + i) * 6}
                    w={805}
                />
            ))}
            <div style={{ ...at(1545, 850), ...mono, color: mint, ...reveal(t, 1.4) }}>03 / 03 ONLINE</div>
        </Stage>
    );
}
export function Certbot() {
    const t = useTime();
    return (
        <Stage light name="Certbot on an origin">
            <div style={{ ...at(90, 180), ...headline }}>Renew on one host.</div>
            <div style={{ ...at(96, 330), fontSize: 43, color: '#455452' }}>
                Certbot can automate renewal locally.
            </div>
            <Plot>
                <Path
                    d="M 545 700 C 655 700 680 620 795 620 L 1200 620"
                    t={t}
                    delay={1.9}
                    accent="#56756f"
                    dashed
                />
                <Path
                    d="M 795 620 L 873 620 Q 925 620 950 680 L 1000 752 L 1460 752"
                    t={t}
                    delay={2.1}
                    accent="#56756f"
                    dashed
                />
            </Plot>
            <Server x={91} y={460} w={595} />
            <Server x={1065} y={418} w={420} />
            <Server x={1415} y={557} w={410} />
            <Tag x={195} y={842} bright>
                ✓ Renewed locally
            </Tag>
            <div
                style={{
                    ...at(674, 785),
                    width: 525,
                    ...reveal(t, 2.1),
                    fontSize: 40,
                    fontWeight: 650,
                    lineHeight: 1.2,
                }}
            >
                Your team handles
                <br />
                the fleet rollout.
            </div>
        </Stage>
    );
}
export function Proxy() {
    const t = useTime();
    return (
        <Stage name="Cloudflare · proxied DNS">
            <div style={{ ...at(90, 200), ...headline }}>Where does the visit go?</div>
            <Plot>
                <Path d="M 397 637 H 657 Q 697 637 725 604 L 814 502 Q 836 477 900 477" t={t} accent={orange} />
                <Path
                    d="M 1020 477 Q 1087 477 1120 515 L 1202 613 Q 1221 637 1262 637 H 1440"
                    t={t}
                    delay={0.55}
                    accent={orange}
                />
                <g transform="translate(843,366)" fill="#633d27" stroke={orange} strokeWidth="5">
                    <path d="M59 150 C4 150 -8 78 46 63 C57 3 133 -6 161 47 C213 36 241 89 210 124 Q194 150 168 150 Z" />
                </g>
                <g transform="translate(143,540)" stroke={paper} fill="#172b2c" strokeWidth="5">
                    <rect width="255" height="179" rx="16" />
                    <path d="M0 39 H255" />
                    <circle cx="22" cy="20" r="3" />
                    <circle cx="38" cy="20" r="3" />
                    <path d="M97 82 l51 31 -22 5 -10 24 z" fill={mint} stroke="none" />
                </g>
            </Plot>
            <Server x={1370} y={459} w={437} />
            <div style={{ ...at(151, 788), fontSize: 41 }}>Browser</div>
            <div style={{ ...at(808, 610), fontSize: 42, color: orange }}>Cloudflare proxy</div>
            <div style={{ ...at(1455, 788), fontSize: 41 }}>Your origin</div>
            <div style={{ ...at(90, 937), ...mono, color: '#bccfcd' }}>
                With proxying enabled, Cloudflare receives the request first.
            </div>
        </Stage>
    );
}
export function Sync({ host }: { host: string }) {
    const t = useTime();
    return (
        <Stage name="RedirHub Edge · certificate sync">
            <div style={{ ...at(90, 161), ...headline, fontSize: 97 }}>Renew once. Sync to each server.</div>
            <Plot>
                {[420, 604, 787].map((y, i) => (
                    <Path
                        key={y}
                        d={'M 601 620 H 810 C 966 620 999 ' + y + ' 1150 ' + y + ' H 1380'}
                        t={t}
                        delay={0.45 + i * 0.28}
                    />
                ))}
            </Plot>
            <div
                style={{
                    ...at(108, 416),
                    height: 375,
                    width: 489,
                    borderRadius: 24,
                    padding: '38px 40px',
                    boxSizing: 'border-box',
                    background: 'linear-gradient(135deg,#f1fff4,#c8e9d7)',
                    color: ink,
                    boxShadow: '0 22px 80px #0005',
                    transform: 'rotate(-3deg)',
                }}
            >
                <div style={mono}>TLS CERTIFICATE</div>
                <div style={{ fontSize: 61, letterSpacing: -3, fontWeight: 740, marginTop: 47 }}>Renewed</div>
                <div style={{ ...mono, marginTop: 20 }}>{host}</div>
                <div
                    style={{
                        ...mono,
                        marginTop: 36,
                        borderTop: '1px solid #9bbeb4',
                        paddingTop: 19,
                        fontSize: 18,
                    }}
                >
                    RedirHub certificate management
                </div>
            </div>
            {[0, 1, 2].map((i) => (
                <div key={i}>
                    <Server x={1280} y={295 + i * 183} w={344} />
                    <div
                        style={{ ...at(1630, 390 + i * 183), ...mono, color: mint, ...reveal(t, 1.4 + i * 0.35) }}
                    >
                        ✓ SYNCED
                    </div>
                </div>
            ))}
            <div style={{ ...at(99, 940), fontSize: 35, color: paper }}>
                Each server running Edge receives the renewed certificate.
            </div>
        </Stage>
    );
}
