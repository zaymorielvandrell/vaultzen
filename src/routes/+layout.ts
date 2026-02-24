import { defineBaseMetaTags } from "svelte-meta-tags";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async (event) => {
  const baseTags = defineBaseMetaTags({
    title: "Your bookmarks, perfectly organized.",
    titleTemplate: "%s • VaultZen",
    description:
      "VaultZen is a minimal bookmark manager to save links and organize bookmarks into simple collections. Try it for free.",
    canonical: new URL(event.url.pathname, event.url.origin).href,
    twitter: {
      cardType: "summary_large_image",
      title: "Your bookmarks, perfectly organized.",
      description:
        "VaultZen is a minimal bookmark manager to save links and organize bookmarks into simple collections. Try it for free.",
      creator: "@zaymoriel",
      image: `${new URL(event.url.pathname, event.url.origin).href}opengraph-image.png`,
      imageAlt: "VaultZen"
    },
    openGraph: {
      url: new URL(event.url.pathname, event.url.origin).href,
      type: "website",
      title: "Your bookmarks, perfectly organized.",
      description:
        "VaultZen is a minimal bookmark manager to save links and organize bookmarks into simple collections. Try it for free.",
      images: [
        {
          url: `${new URL(event.url.pathname, event.url.origin).href}opengraph-image.png`,
          alt: "VaultZen"
        }
      ]
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
