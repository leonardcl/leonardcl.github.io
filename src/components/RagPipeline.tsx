import { useEffect, useMemo, useRef, useState } from "react";
import Nav from "./v2/Nav";
import FooterV2 from "./v2/FooterV2";
import { publications } from "../data/publications";
import { projects } from "../data/projects";
import { career, education } from "../data/experience";
import PageMeta from "./v2/PageMeta";

/**
 * A retrieval pipeline you can watch run, step by step — and the corpus is
 * my own work, so it doubles as a way to search this site.
 *
 * Deliberately honest about what it is: TF-IDF over a small local corpus,
 * cosine-ranked, with an extractive answer. No embeddings, no model, no
 * network call. The point is the *shape* of RAG — where retrieval sits
 * relative to generation, and why grounding in retrieved passages is what
 * stops a system inventing things.
 */

type Doc = {
  id: string;
  kind: "publication" | "project" | "role";
  title: string;
  body: string;
  meta: string;
  link?: string;
};

const STOP = new Set(
  ("a an the and or but of in on at to for with from by as is are was were be been " +
    "this that these those it its into over under about via using used use we i my " +
    "our their his her they them he she you your what how why when where which who " +
    "can could would should will do does did done than then so such also more most " +
    "other others some any all no not only just very much many few own same s t")
    .split(" ")
);

/** Light stemming — enough to bind "learning"/"learned"/"learns". */
function stem(w: string) {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map(stem);
}

function buildCorpus(): Doc[] {
  const docs: Doc[] = [];
  publications.forEach((p, i) =>
    docs.push({
      id: `pub-${i}`,
      kind: "publication",
      title: p.title,
      body: `${p.title} ${p.venue} ${p.authors}`,
      meta: `${p.venue} · ${p.year}`,
      link: p.link,
    })
  );
  projects.forEach((p, i) =>
    docs.push({
      id: `prj-${i}`,
      kind: "project",
      title: p.title,
      body: `${p.title} ${p.description} ${p.tags.join(" ")}`,
      meta: `${p.tags.join(" · ")} · ${p.year}`,
      link: p.link,
    })
  );
  [...career, ...education].forEach((r, i) =>
    docs.push({
      id: `role-${i}`,
      kind: "role",
      title: `${r.title} · ${r.org}`,
      body: `${r.title} ${r.org} ${r.points.join(" ")}`,
      meta: r.dates,
    })
  );
  return docs;
}

type Indexed = {
  docs: Doc[];
  vectors: Map<string, number>[];
  idf: Map<string, number>;
};

function buildIndex(docs: Doc[]): Indexed {
  const tokenised = docs.map((d) => tokenize(d.body));
  const df = new Map<string, number>();
  tokenised.forEach((toks) => {
    new Set(toks).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1));
  });
  const idf = new Map<string, number>();
  df.forEach((n, t) => idf.set(t, Math.log(docs.length / (1 + n)) + 1));

  const vectors = tokenised.map((toks) => {
    const tf = new Map<string, number>();
    toks.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
    const vec = new Map<string, number>();
    let norm = 0;
    tf.forEach((n, t) => {
      const v = (1 + Math.log(n)) * (idf.get(t) ?? 1);
      vec.set(t, v);
      norm += v * v;
    });
    norm = Math.sqrt(norm) || 1;
    vec.forEach((v, t) => vec.set(t, v / norm));
    return vec;
  });

  return { docs, vectors, idf };
}

function scoreQuery(index: Indexed, tokens: string[]) {
  const tf = new Map<string, number>();
  tokens.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
  const q = new Map<string, number>();
  let norm = 0;
  tf.forEach((n, t) => {
    const v = (1 + Math.log(n)) * (index.idf.get(t) ?? 1);
    q.set(t, v);
    norm += v * v;
  });
  norm = Math.sqrt(norm) || 1;

  return index.vectors.map((vec) => {
    let dot = 0;
    q.forEach((qv, t) => {
      const dv = vec.get(t);
      if (dv) dot += (qv / norm) * dv;
    });
    return dot;
  });
}

const EXAMPLES = [
  "reinforcement learning with partial observability",
  "how do you detect ingredients from a photo",
  "what robotics work have you done",
  "retrieval augmented generation for education",
];

const STAGES = ["tokenize", "embed & score", "retrieve top-k", "ground the answer"];

export default function RagPipeline() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const index = useMemo(() => buildIndex(buildCorpus()), []);
  const [query, setQuery] = useState("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [scores, setScores] = useState<number[] | null>(null);
  const [stage, setStage] = useState(-1);
  const [topK, setTopK] = useState(3);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    []
  );

  const run = (q: string) => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    const toks = tokenize(q);
    setQuery(q);
    setTokens(toks);
    setScores(null);
    setStage(0);
    if (!toks.length) return;

    // Walk the stages so the pipeline is legible rather than instant.
    timers.current.push(
      window.setTimeout(() => {
        setScores(scoreQuery(index, toks));
        setStage(1);
      }, 420)
    );
    timers.current.push(window.setTimeout(() => setStage(2), 900));
    timers.current.push(window.setTimeout(() => setStage(3), 1400));
  };

  const ranked = scores
    ? index.docs
        .map((d, i) => ({ doc: d, score: scores[i] }))
        .sort((a, b) => b.score - a.score)
    : [];
  const retrieved = ranked.filter((r) => r.score > 0).slice(0, topK);
  const maxScore = ranked.length ? Math.max(...ranked.map((r) => r.score), 0.0001) : 1;

  const btn =
    "font-mono text-xs px-3 py-2 border border-line text-ink hover:border-accent hover:text-accent transition-colors bg-bone";

  return (
    <div className="min-h-screen min-h-dvh bg-bone text-ink font-sans">
      <PageMeta title={"RAG Pipeline Visualizer"} description={"Watch a retrieval-augmented generation pipeline run stage by stage: tokenize, score, retrieve, ground the answer."} path={"/rag-pipeline"} />
      <Nav />
      <main className="max-w-site mx-auto px-6 sm:px-10 pt-32 pb-24">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
              playground · retrieval before generation
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl text-ink font-medium leading-tight rise-blur">
            Watch a <em className="font-light text-blush">RAG</em> pipeline think
          </h1>
          <p className="mt-4 max-w-2xl text-inkmuted leading-relaxed">
            Ask something and follow each stage: the query is tokenized, scored
            against a corpus, the closest passages are retrieved, and only then is
            an answer composed — grounded in what came back. The corpus here is my
            own papers, projects, and roles, so it also works as a search over
            this site.
          </p>
        </div>

        {/* Query */}
        <div className="border border-line bg-bone p-5 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(query);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ask about my work…"
              className="flex-1 bg-transparent border-b border-line focus:border-accent outline-none py-2 font-sans text-lg text-ink placeholder:text-inkmuted/60 transition-colors"
            />
            <button
              type="submit"
              className="font-mono text-xs px-5 py-2.5 border border-ink bg-ink text-bone hover:bg-accent hover:border-accent transition-colors shrink-0"
            >
              retrieve ▸
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex} className={btn} onClick={() => run(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline */}
        <div className="mt-6 grid sm:grid-cols-4 gap-3">
          {STAGES.map((label, i) => (
            <div
              key={label}
              className={`border p-3 transition-colors duration-500 ${
                stage >= i ? "border-accent/50 bg-accent/[0.04]" : "border-line"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rotate-45 transition-colors duration-500 ${
                    stage >= i ? "bg-blush" : "bg-line"
                  }`}
                />
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${
                    stage >= i ? "text-accent" : "text-inkmuted"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {stage >= 0 && (
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {/* Retrieval */}
            <div className="md:col-span-2 space-y-6">
              {/* Tokens */}
              <div className="border border-line bg-bone p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inkmuted mb-3">
                  query tokens
                </p>
                {tokens.length ? (
                  <div className="flex flex-wrap gap-2">
                    {tokens.map((t, i) => (
                      <span
                        key={`${t}-${i}`}
                        className="font-mono text-xs border border-accent/40 text-accent px-2.5 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-inkmuted">
                    Nothing to search — try one of the examples above.
                  </p>
                )}
              </div>

              {/* Scored corpus */}
              {scores && (
                <div className="border border-line bg-bone p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inkmuted mb-4">
                    corpus · {index.docs.length} documents scored
                  </p>
                  <div className="space-y-2.5">
                    {ranked.map(({ doc, score }, i) => {
                      const hit = stage >= 2 && i < topK && score > 0;
                      return (
                        <div
                          key={doc.id}
                          className={`transition-opacity duration-500 ${
                            stage >= 2 && !hit ? "opacity-35" : "opacity-100"
                          }`}
                        >
                          <div className="flex items-baseline gap-3">
                            <span
                              className={`font-mono text-[10px] shrink-0 ${
                                hit ? "text-blush" : "text-inkmuted"
                              }`}
                            >
                              {score.toFixed(3)}
                            </span>
                            <span
                              className={`text-sm leading-snug ${
                                hit ? "text-ink font-medium" : "text-inkmuted"
                              }`}
                            >
                              {doc.title}
                            </span>
                            <span className="ml-auto font-mono text-[10px] text-inkmuted shrink-0 hidden sm:inline">
                              {doc.kind}
                            </span>
                          </div>
                          <div className="mt-1 h-[3px] bg-line/70">
                            <div
                              className="h-full transition-all duration-700 ease-out"
                              style={{
                                width: `${Math.max(1, (score / maxScore) * 100)}%`,
                                backgroundColor: hit ? "#D6336C" : "#3538CD",
                                opacity: hit ? 1 : 0.35,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Grounded answer */}
              {stage >= 3 && (
                <div className="border border-accent/40 bg-accent/[0.03] p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-3">
                    grounded answer
                  </p>
                  {retrieved.length ? (
                    <>
                      <p className="text-ink leading-relaxed">
                        {retrieved.length === 1
                          ? "One source in the corpus matches: "
                          : `${retrieved.length} sources match. The closest is `}
                        <span className="font-medium">{retrieved[0].doc.title}</span>
                        {" — "}
                        <span className="text-inkmuted">{retrieved[0].doc.meta}</span>.
                      </p>
                      <ul className="mt-4 space-y-2">
                        {retrieved.map(({ doc, score }) => (
                          <li key={doc.id} className="text-sm">
                            <span className="font-mono text-[10px] text-blush mr-2">
                              {score.toFixed(3)}
                            </span>
                            {doc.link ? (
                              <a
                                href={doc.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="u-link text-ink"
                              >
                                {doc.title} ↗
                              </a>
                            ) : (
                              <span className="text-ink">{doc.title}</span>
                            )}
                            <span className="block font-mono text-[10px] text-inkmuted mt-0.5">
                              {doc.meta}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-xs text-inkmuted leading-relaxed">
                        A real RAG system would hand exactly these passages to an
                        LLM as context. The retrieval step is what keeps the answer
                        tethered to something that actually exists.
                      </p>
                    </>
                  ) : (
                    <p className="text-inkmuted">
                      Nothing in the corpus scored above zero — no shared terms.
                      This is the honest failure mode: retrieval returns empty, and
                      a grounded system should say so rather than invent an answer.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="border border-line p-5 bg-bone h-fit">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inkmuted mb-4">
                retrieval settings
              </p>
              <div>
                <div className="font-mono text-xs text-inkmuted mb-1.5">{`top-k = ${topK}`}</div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-[#3538CD]"
                  style={{
                    background: `linear-gradient(to right, #3538CD 0%, #3538CD ${
                      ((topK - 1) / 5) * 100
                    }%, #E6E4DC ${((topK - 1) / 5) * 100}%, #E6E4DC 100%)`,
                  }}
                />
              </div>

              <div className="mt-5 pt-4 border-t border-line text-xs text-inkmuted space-y-1.5 leading-relaxed">
                <p>
                  <b className="text-ink">What this actually is:</b> TF-IDF term
                  weighting with cosine similarity, over {index.docs.length}{" "}
                  documents built from this site's own data. Everything runs
                  locally.
                </p>
                <p>
                  <b className="text-ink">What it isn't:</b> a neural embedding
                  model or an LLM. Real systems swap the scoring step for dense
                  vectors and the final step for generation — the structure stays
                  exactly the same.
                </p>
                <p className="text-blush/80">悟 · 修 · 成</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <FooterV2 />
    </div>
  );
}
