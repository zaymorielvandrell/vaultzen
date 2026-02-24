import * as cheerio from "cheerio";

const USER_AGENT = "Mozilla/5.0 (compatible; VaultZen/1.0; +https://vaultzen.dev)";
const FETCH_TIMEOUT = 10_000;
const FALLBACK_TITLES = [
  "Title? What Title? We Don't Do That Here.",
  "This Page Just Woke Up And Chose Violence.",
  "404 Title Not Found... but the vibes? Immaculate.",
  "We ran out of budget for titles, sorry not sorry."
] as const;
const FALLBACK_DESCRIPTIONS = [
  "The description was kidnapped by gremlins at 3:17 AM. Send help... or pizza.",
  "This page is 87% vibes, 12% chaos, and 1% actual content.",
  "Developer promised a description in 2019. Still waiting.",
  "You've reached the loading screen of life. Enjoy the existential void."
] as const;

export const extractMetadata = async (url: string) => {
  const parsedUrl = new URL(url);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Invalid URL protocol");
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
    throw new Error(`Request failed with status ${response.status}`);
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
