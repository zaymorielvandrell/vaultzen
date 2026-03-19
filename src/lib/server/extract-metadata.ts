import * as cheerio from "cheerio";

const USER_AGENT = "Mozilla/5.0 (compatible; VaultZen/1.0; +https://vaultzen.dev)";
const FETCH_TIMEOUT = 10_000;
const FALLBACK_TITLES = [
  "Untitled page",
  "Page title unavailable",
  "Saved page",
  "Web page"
] as const;
const FALLBACK_DESCRIPTIONS = [
  "No description is available for this page.",
  "This page does not provide a description.",
  "Description unavailable.",
  "Saved without a page description."
] as const;

export const extractMetadata = async (url: string) => {
  const parsedUrl = new URL(url);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Invalid URL protocol.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html"
    },
    signal: controller.signal
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  const html = await response.text();

  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content")?.trim() ||
    $("title").text().trim() ||
    FALLBACK_TITLES[Math.floor(Math.random() * FALLBACK_TITLES.length)];

  const description =
    $('meta[property="og:description"]').attr("content")?.trim() ||
    $('meta[name="description"]').attr("content")?.trim() ||
    FALLBACK_DESCRIPTIONS[Math.floor(Math.random() * FALLBACK_DESCRIPTIONS.length)];

  const faviconHref =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    "/favicon.ico";

  const favicon = new URL(faviconHref, url).href;

  return { title, description, favicon };
};
