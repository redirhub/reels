import { Gallery } from './components/Gallery';

export default function Home() {
    return (
        <main className="wrap">
            <div className="head">
                <img src="/brand/redirhub-icon.svg" alt="" />
                <h1>RedirHub Reels</h1>
            </div>
            <p className="lede">
                Preview every reel in the browser. GitHub Actions renders the MP4s on every push to{' '}
                <code>main</code> and publishes them to the CDN. Pull-request renders stay private as workflow artifacts.
            </p>
            <Gallery />
        </main>
    );
}
