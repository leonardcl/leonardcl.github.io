import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "highlight.js/styles/a11y-light.css";
import "katex/dist/katex.min.css";
import style from "./markdown_blogs/markdown-styles.module.css";
import Nav from "./v2/Nav";
import FooterV2 from "./v2/FooterV2";
import PageMeta from "./v2/PageMeta";
import NotFoundPage from "../NotFoundPage";
import { findPost } from "../data/posts";

/** One route serves every article — the post is looked up from its slug. */
export default function BlogPost() {
  const { slug } = useParams();
  const post = findPost(slug);
  const [markdown, setMarkdown] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!post) return;
    window.scrollTo({ top: 0 });
    setMarkdown("");
    setFailed(false);
    fetch(post.markdown)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then(setMarkdown)
      .catch(() => setFailed(true));
  }, [post]);

  if (!post) return <NotFoundPage />;

  return (
    <div className="min-h-screen min-h-dvh bg-bone text-ink font-sans">
      <PageMeta
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
      />
      <Nav />
      <main className="max-w-3xl mx-auto px-6 sm:px-10 pt-32 pb-24">
        <Link
          to="/blog"
          className="font-mono text-xs text-inkmuted hover:text-accent transition-colors"
        >
          ← all writing
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
            {post.topic}
          </span>
          <span className="font-mono text-[11px] text-inkmuted">
            {post.date} · {post.minutes} min read
          </span>
        </div>

        {failed ? (
          <p className="mt-10 text-inkmuted">
            This article couldn't be loaded.{" "}
            <Link to="/blog" className="u-link text-ink">
              Back to writing
            </Link>
            .
          </p>
        ) : (
          <article className={`mt-6 ${style.reactMarkDown}`}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeKatex]}
            >
              {markdown}
            </ReactMarkdown>
          </article>
        )}
      </main>
      <FooterV2 />
    </div>
  );
}
