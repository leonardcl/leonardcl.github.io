import { Link } from 'react-router-dom';
import Nav from './components/v2/Nav';
import FooterV2 from './components/v2/FooterV2';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen min-h-dvh bg-bone text-ink font-sans flex flex-col">
            <Nav />
            <main className="relative flex-1 flex items-center justify-center overflow-hidden">
                <div className="blob w-[420px] h-[420px] -top-24 -right-28 bg-blush/10" />
                <div className="blob w-[360px] h-[360px] bottom-0 -left-32 bg-accent/10" style={{ animationDelay: "-8s" }} />

                <div className="relative text-center px-6 pt-24 pb-24">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
                        lost in the system
                    </p>
                    <h1 className="mt-4 font-display text-8xl sm:text-9xl text-ink font-medium">
                        4<em className="text-blush font-light">0</em>4
                    </h1>
                    <p className="mt-6 text-inkmuted">
                        This page doesn't exist — or wandered off somewhere.
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.2em] px-6 py-3 border border-ink bg-ink text-bone hover:bg-accent hover:border-accent transition-colors"
                    >
                        back to home
                    </Link>
                </div>
            </main>
            <FooterV2 />
        </div>
    )
}
