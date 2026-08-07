import { useEffect } from "react";

/**
 * Per-route title, description and canonical URL.
 *
 * This is a client-rendered SPA, so crawlers only see these once JavaScript
 * has run — Google does execute it, but it means each route needs to declare
 * its own metadata rather than inheriting the one set in index.html.
 */

const SITE = "https://leonardcl.com";
const NAME = "Leonard Christopher Limanjaya";

const setMeta = (selector: string, attr: string, value: string) => {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

type Props = {
  title: string;
  description: string;
  path: string;
};

export default function PageMeta({ title, description, path }: Props) {
  useEffect(() => {
    const full = `${title} — ${NAME}`;
    const url = `${SITE}${path}`;

    document.title = full;
    setMeta('meta[name="description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:title"]', "content", full);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", full);
    setMeta('meta[name="twitter:description"]', "content", description);
  }, [title, description, path]);

  return null;
}
