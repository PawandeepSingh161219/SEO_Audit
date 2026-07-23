import analyzeRobotsTxt from "./robotsTxt.analyzer.js";
import analyzeSitemap from "./sitemap.analyzer.js";

export default async function analyzeSitemapDetection(context) {

    const parsed = new URL(context.url);

    const baseUrl =
        `${parsed.protocol}//${parsed.host}`;

    const robots =
        await analyzeRobotsTxt(baseUrl);

    const sitemap =
        await analyzeSitemap(baseUrl);

    return {

        robots,

        sitemap

    };

}