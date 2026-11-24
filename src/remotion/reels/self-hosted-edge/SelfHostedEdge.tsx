import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { RedirHubLogo } from '../../brand/Logo';
import { color, font } from '../../brand/tokens';
import { Beat } from '../../components/Beat';
import { Sfx } from '../../components/Sfx';
import { edgeDefaults } from './props';

const chapters = [
    { start: 0, title: 'Who handles HTTPS?', text: 'Follow a request from the browser to a shop running on your own server.' },
    { start: 5, title: 'Two familiar setups.', text: 'A proxy changes the traffic path. With a standalone ACME client, your team owns certificate deployment.' },
    { start: 12, title: 'Separate certificates from traffic.', text: 'RedirHub issues and renews the certificate. Each connected server syncs a copy and handles HTTPS locally.' },
    { start: 20, title: 'Run Edge on your server.', text: 'Copy the Docker command from your domain setup. Run it on each server, then point the domain’s A or AAAA records to those servers.' },
    { start: 29, title: 'Open the shop over HTTPS.', text: 'The browser connects directly to your server. Edge handles TLS and forwards the request to your existing app.' },
];
const mono = { fontFamily: font.mono, fontSize: 26 };
const cell = { padding: '25px 29px', borderRadius: 18, background: 'white', color: color.dark };
function Lane({ name, nodes, t, accent = color.teal }: { name: string; nodes: string[]; t: number; accent?: string }) {
    return <div style={{ marginBottom: 34 }}><div style={{ ...mono, color: color.blueLight, marginBottom: 17 }}>{name}</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>{nodes.map((n, i) => <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div style={{ position: 'relative', width: 65, height: 3, background: color.g500 }}>
                <div style={{ position: 'absolute', top: -5, left: ((t * .64 + i / 4) % 1) * 53, width: 13, height: 13, borderRadius: 12, background: accent }} />
            </div>}
            <div style={{...cell, fontSize: 30, fontWeight: 650}}>{n}</div>
        </div>)}</div></div>;
}
function Chapter({ index, hostname, address }: { index: number } & typeof edgeDefaults) {
    const t = useCurrentFrame() / useVideoConfig().fps;
    const chapter = chapters[index];
    const command = ['docker run -d --network host', '  --restart unless-stopped', '  -v redirhub-edge:/data', '  -e REDIRHUB_TOKEN', '  redirhub/edge'];
    return <AbsoluteFill style={{ background: color.g50, color: color.dark, padding: '76px 94px', fontFamily: font.display }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}><RedirHubLogo style={{width:240}}/><span style={{...mono,color:color.g600}}>Self-Hosted Edge  /  SSL demo</span></div>
        <div style={{display:'grid',gridTemplateColumns:'650px 1fr',gap:72, marginTop:145,alignItems:'center'}}>
            <div><div style={{width:88,height:9,background:color.teal,marginBottom:38}}/>
                <div style={{fontSize:82,fontWeight:800,letterSpacing:-4,lineHeight:1.07}}>{chapter.title}</div>
                <div style={{fontSize:36,lineHeight:1.45,marginTop:35,color:color.g600}}>{chapter.text}</div></div>
            <div style={{background:color.dark,color:'white',borderRadius:32,padding:'52px 48px',minHeight:450,display:'flex',flexDirection:'column',justifyContent:'center',transform:'translateY('+Math.max(0,1-t*3)*14+'px)'}}>
                {index===0 && <><div style={{...mono,color:color.blueLight}}>LOCAL APPLICATION</div><div style={{fontSize:68,fontWeight:730,margin:'40px 0 12px'}}>Northline Shop</div><div style={{...mono,fontSize:35,color:color.g300}}>http://127.0.0.1:80</div><div style={{...mono,borderTop:'1px solid '+color.g600,paddingTop:30,marginTop:50}}>Public domain · {hostname}</div></>}
                {index===1 && <><Lane name="Cloudflare · proxied DNS record" nodes={['Browser','Cloudflare','Origin']} t={t}/><Lane name="Certbot on the origin · direct DNS" nodes={['Browser','Origin server']} t={t}/><div style={{fontSize:28,color:color.g300}}>Certbot can automate renewal on the host.</div></>}
                {index===2 && <><Lane name="Certificate delivery" nodes={['RedirHub','Edge on each server']} t={t} accent={color.amber}/><Lane name="Visitor traffic" nodes={['Browser','Your server']} t={t}/><div style={{fontSize:28,color:color.g300}}>TLS terminates on your infrastructure.</div></>}
                {index===3 && <><div style={{...mono,color:color.blueLight}}>SHELL  /  workspace token exported</div><pre style={{...mono,fontSize:30,lineHeight:1.48,margin:'25px 0',minHeight:228}}>{command.slice(0,Math.min(5,1+Math.floor(t*2.5))).join(' '+String.fromCharCode(92,10))}</pre><div style={{...mono,paddingTop:26,borderTop:'1px solid '+color.g600,color:color.blueLight}}>DNS  ·  {hostname}  A  {address}</div></>}
                {index===4 && <><div style={{...mono,background:color.blueBg,color:color.dark,padding:'20px 24px',borderRadius:15}}>https://{hostname}</div><div style={{fontSize:62,fontWeight:750,margin:'32px 0 42px'}}>Northline Shop</div><Lane name="On your server" nodes={['Edge  :443','App  :80']} t={t}/></>}
            </div>
        </div>
        <div style={{position:'absolute',bottom:75,left:94,right:94,display:'flex',gap:12}}>{chapters.map((c,i)=><div key={c.start} style={{height:6,flex:1,background:i<=index?color.teal:color.g200}}/>)}</div>
    </AbsoluteFill>;
}
export function SelfHostedEdge(props: typeof edgeDefaults) {
    const { fps } = useVideoConfig();
    return <AbsoluteFill>{chapters.map((c,i)=><Sequence key={c.start} from={c.start*fps} durationInFrames={((chapters[i+1]?.start ?? 36)-c.start)*fps}><Chapter index={i} {...props}/></Sequence>)}<Beat/><Sfx cues={[[12,'whoosh',.32],[29,'success',.36]]}/></AbsoluteFill>;
}
