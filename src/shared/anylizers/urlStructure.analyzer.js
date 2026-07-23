export default function analyzeUrlStructure(pageUrl, context) {

    const url = new URL(pageUrl);

    const issues = [];
    const recommendations = [];

    let score = 100;

    const pathname = url.pathname;

    const segments = pathname
        .split("/")
        .filter(segment => segment.length > 0);

    const canonical =
        context.$('link[rel="canonical"]').attr("href") || "";

    const data = {

        protocol: url.protocol,

        hostname: url.hostname,

        pathname,

        queryString: url.search,

        hash: url.hash,

        length: pageUrl.length,

        segments,

        canonical

    };

    // HTTPS

    if (url.protocol !== "https:") {

        score -= 15;

        issues.push("Website is not using HTTPS.");

        recommendations.push("Redirect all HTTP traffic to HTTPS.");

    }

    // URL Length

    if (pageUrl.length > 75) {

        score -= 10;

        issues.push("URL is too long.");

        recommendations.push("Keep URLs below 75 characters.");

    }

    // Query Parameters

    if (url.search.length > 0) {

        score -= 5;

        issues.push("URL contains query parameters.");

        recommendations.push("Use clean URLs whenever possible.");

    }

    // Uppercase Letters

    if (/[A-Z]/.test(pathname)) {

        score -= 5;

        issues.push("URL contains uppercase letters.");

        recommendations.push("Use lowercase URLs.");

    }

    // Underscores

    if (pathname.includes("_")) {

        score -= 5;

        issues.push("URL contains underscores.");

        recommendations.push("Use hyphens instead of underscores.");

    }

    // Multiple Consecutive Hyphens

    if (/--/.test(pathname)) {

        score -= 3;

        issues.push("URL contains multiple consecutive hyphens.");

    }

    // Spaces

    if (pathname.includes("%20")) {

        score -= 5;

        issues.push("URL contains encoded spaces.");

    }

    // Canonical

    if (!canonical) {

        score -= 10;

        issues.push("Canonical URL is missing.");

        recommendations.push("Add a canonical link tag.");

    }

    // Deep URL

    if (segments.length > 5) {

        score -= 5;

        issues.push("URL depth is high.");

        recommendations.push("Reduce folder nesting.");

    }

    // File Extension

    if (/\.(php|asp|aspx|jsp)$/i.test(pathname)) {

        score -= 3;

        issues.push("Dynamic file extension detected.");

    }

    if (score < 0)
        score = 0;

    return {

        category: "URL Structure",

        score,

        passed: issues.length === 0,

        data,

        issues,

        recommendations

    };

}