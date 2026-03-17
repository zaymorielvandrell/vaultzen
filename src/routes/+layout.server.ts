import { defineBaseMetaTags } from "svelte-meta-tags";
import { env } from "$env/dynamic/private";
import type { LayoutServerLoad } from "./$types";

if (!env.ORIGIN) throw new Error("ORIGIN is not set");

const openGraphImageUrl = new URL("/opengraph-image.png", env.ORIGIN).href;

export const load: LayoutServerLoad = async (event) => {
  const canonicalUrl = new URL(event.url.pathname, env.ORIGIN).href;

  const baseTags = defineBaseMetaTags({
    title: "Your bookmarks, perfectly organized.",
    titleTemplate: "%s • VaultZen",
    description:
      "VaultZen is a minimal bookmark manager to save links and organize bookmarks into simple collections. Try it for free.",
    canonical: canonicalUrl,
    twitter: {
      cardType: "summary_large_image",
      title: "Your bookmarks, perfectly organized.",
      description:
        "VaultZen is a minimal bookmark manager to save links and organize bookmarks into simple collections. Try it for free.",
      creator: "@zaymoriel",
      image: openGraphImageUrl,
      imageAlt: "VaultZen"
    },
    openGraph: {
      url: canonicalUrl,
      type: "website",
      title: "Your bookmarks, perfectly organized.",
      description:
        "VaultZen is a minimal bookmark manager to save links and organize bookmarks into simple collections. Try it for free.",
      images: [{ url: openGraphImageUrl, alt: "VaultZen" }]
    },
    additionalMetaTags: [
      { httpEquiv: "content-type", content: "text/html;charset=UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" }
    ],
    additionalLinkTags: [
      { rel: "icon", href: "/favicon-16x16.png" },
      { rel: "icon", href: "/favicon-32x32.png" },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
      }
    ]
  });

  return { ...baseTags };
};
