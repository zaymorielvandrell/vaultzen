import * as cheerio from "cheerio";

const USER_AGENT = "Mozilla/5.0 (compatible; VaultZen/1.0; +https://vaultzen.dev)";
const FETCH_TIMEOUT = 10_000;

const createFallbackMetadata = (parsedUrl: URL) => {
  const host = parsedUrl.hostname;

  return {
    title: host || "Saved page",
    description: `Saved from ${host || parsedUrl.origin}.`,
    favicon: new URL("/favicon.ico", parsedUrl.origin).href,
    usedFallback: true
  };
};

export const extractMetadata = async (url: string) => {
  const parsedUrl = new URL(url);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Invalid URL protocol.");
  }

  const fallbackMetadata = createFallbackMetadata(parsedUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      return fallbackMetadata;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content")?.trim() ||
      $("title").text().trim() ||
      fallbackMetadata.title;

    const description =
      $('meta[property="og:description"]').attr("content")?.trim() ||
      $('meta[name="description"]').attr("content")?.trim() ||
      fallbackMetadata.description;

    const faviconHref =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    return {
      title,
      description,
      favicon: new URL(faviconHref, url).href,
      usedFallback: false
    };
  } catch {
    return fallbackMetadata;
  } finally {
    clearTimeout(timeoutId);
  }
};
