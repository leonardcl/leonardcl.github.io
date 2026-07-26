import ReactMarkdown from "react-markdown"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "highlight.js/styles/a11y-light.css";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import style from './markdown-styles.module.css';
import Nav from "../v2/Nav";
import FooterV2 from "../v2/FooterV2";

const RlFundamentalConcept1 = () => {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0 });
        fetch("/1-rl-fundamental/article_rl.md")
        .then((response) => response.text())
        .then((text) => setMarkdown(text));
    }, []);

    return (
        <div className="min-h-screen min-h-dvh bg-bone text-ink font-sans">
            <Nav />
            <main className="max-w-3xl mx-auto px-6 sm:px-10 pt-32 pb-24">
                <Link
                    to="/blog"
                    className="font-mono text-xs text-inkmuted hover:text-accent transition-colors"
                >
                    ← all writing
                </Link>
                <div className="mt-6 flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
                        reinforcement learning
                    </span>
                </div>

                <article className={`mt-6 ${style.reactMarkDown}`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeKatex]}
                    >
                        {markdown}
                    </ReactMarkdown>
                </article>
            </main>
            <FooterV2 />
        </div>
    )
  }

  export default RlFundamentalConcept1
