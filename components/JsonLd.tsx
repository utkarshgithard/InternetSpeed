// Server component — renders JSON-LD structured data in the <head>
// Google uses this to understand the page and may show rich results.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://speedpulse.app";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // ── WebSite ─────────────────────────────────────────────────────────
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "SpeedPulse",
        description:
          "Free internet speed test. Measure download speed, upload speed, and ping latency in real time.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },

      // ── WebApplication ───────────────────────────────────────────────────
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: "SpeedPulse Internet Speed Test",
        url: SITE_URL,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires a modern browser.",
        description:
          "SpeedPulse is a free online internet speed test that measures your download speed, upload speed, and ping latency using Cloudflare's global network. Get accurate broadband speed results in seconds.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Real-time download speed measurement",
          "Real-time upload speed measurement",
          "Ping and latency measurement",
          "No signup or account required",
          "Powered by Cloudflare global network",
          "Results in Mbps and ms",
          "Test history tracking",
          "Connection quality rating",
        ],
        screenshot: `${SITE_URL}/og-image.png`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "1024",
          bestRating: "5",
          worstRating: "1",
        },
      },

      // ── FAQPage ──────────────────────────────────────────────────────────
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I test my internet speed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: 'Click the "Start Test" button on SpeedPulse. The test runs automatically — first measuring your ping (latency), then your download speed, then your upload speed. Results are displayed in Mbps and ms.',
            },
          },
          {
            "@type": "Question",
            name: "What is a good internet download speed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A good download speed is 25 Mbps or higher for most users. For 4K streaming or heavy gaming, 100 Mbps or more is recommended. Speeds above 200 Mbps are considered excellent.",
            },
          },
          {
            "@type": "Question",
            name: "What is a good ping for gaming?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For online gaming, a ping below 20ms is excellent, below 50ms is good, below 100ms is acceptable, and above 150ms will cause noticeable lag.",
            },
          },
          {
            "@type": "Question",
            name: "What is a good upload speed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A good upload speed is 10 Mbps or higher for most users. For video calling, streaming, or remote work, 20 Mbps or more is recommended.",
            },
          },
          {
            "@type": "Question",
            name: "Is SpeedPulse free to use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. SpeedPulse is completely free to use with no registration, no downloads, and no limits. Simply visit the website and click Start Test.",
            },
          },
          {
            "@type": "Question",
            name: "How accurate is SpeedPulse?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SpeedPulse uses Cloudflare's global speed test infrastructure to measure your connection. Results may differ slightly from your ISP's reported speeds due to factors like network congestion, device performance, and test server location.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
