import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Write a real HTML file for every route.
 *
 * The 404.html fallback keeps shared links working, but GitHub Pages serves
 * it with an actual 404 status — so crawlers refuse to index those pages no
 * matter what the JavaScript does afterwards. Emitting dist/<route>/index.html
 * means Pages returns 200, and the correct title and description are in the
 * markup before a single line of JS runs.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://leonardcl.com";
const NAME = "Leonard Christopher Limanjaya";

// Blog routes come straight from the same list the app uses, so publishing
// a post never means remembering to update this file too.
const posts = JSON.parse(readFileSync(join(root, "src/data/posts.json"), "utf8"));

const ROUTES = [
  ["blog", "Writing",
   "Notes and essays on reinforcement learning, robotics, and building AI systems, by Leonard Christopher Limanjaya."],
  ...posts.map((p) => [`blog/${p.slug}`, p.title, p.excerpt]),
  ["play-the-air", "Play the Air — Hand-Gesture Instrument",
   "An instrument played with hand gestures through your webcam. Hand tracking drives a Web Audio synth: height is pitch locked to a scale, sideways opens the filter, pinch controls expression."],
  ["fog-of-war", "Breaking the Fog — POMDP Simulator",
   "An interactive POMDP: a memoryless agent races a belief-state agent through the same fogged maze. Built around my ACM TIST research on partial observability."],
  ["tictactoe-rl", "Teach It to Play — Q-Learning",
   "Tabular Q-learning trained by self-play in your browser. Beat it untrained, then train it and try again."],
  ["rag-pipeline", "RAG Pipeline Visualizer",
   "Watch a retrieval-augmented generation pipeline run stage by stage: tokenize, score, retrieve, ground the answer."],
  ["gradient-descent", "Gradient Descent Visualizer",
   "Interactive gradient descent: learning rate, momentum, Nesterov and noise on quadratic, saddle and Rosenbrock surfaces."],
  ["boids", "Boids Swarm Simulation",
   "Flocking emerges from three local rules — cohesion, alignment, separation. Adjust them and watch the swarm change."],
  ["pixel-cam", "Pixel Camera",
   "Your webcam redrawn as pixels and binary digits, entirely in the browser. Nothing is recorded or sent anywhere."],
  ["blessed", "Blessed", "A random Bible verse to bless your day."],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

const shell = readFileSync(join(dist, "index.html"), "utf8");

for (const [route, title, description] of ROUTES) {
  const full = `${title} — ${NAME}`;
  const url = `${SITE}/${route}`;

  const html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(full)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(full)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(full)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`);

  const dir = join(dist, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

console.log(`prerendered ${ROUTES.length} routes`);
