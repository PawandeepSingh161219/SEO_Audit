export default function analyzeCrawlability(context) {

    // console.log("Context:", context);
    // console.log(`constext.$ is defined: ${typeof context.$}`);
    // console.log(`constext.$.$ is defined: ${typeof context.$.$}`);

// console.log("Type of $:", typeof context.$);
    const { $:page, headers, statusCode, url } = context;
     const $ = page.$;

    const issues = [];
    const recommendations = [];

    let score = 100;


    function normalizeUrl(input) {
        if (!input) return "";

        try {
            const parsed = new URL(input);

            parsed.hash = "";

            // Remove trailing slash except root
            if (
                parsed.pathname.length > 1 &&
                parsed.pathname.endsWith("/")
            ) {
                parsed.pathname = parsed.pathname.slice(0, -1);
            }

            return parsed.toString();
        } catch {
            return input.trim();
        }
    }

    function parseDirectives(value) {
        return (value || "")
            .toLowerCase()
            .split(",")
            .map(v => v.trim())
            .filter(Boolean);
    }

    // -------------------------
    // Read values
    // -------------------------

    const robotsTags = $('meta[name="robots"]');
    const robotsMeta = robotsTags.first().attr("content") || "";
 console.log(typeof $); // function
    const canonicalTags = $('link[rel="canonical"]');
    const canonical = canonicalTags.first().attr("href") || "";

    const xRobots = headers["x-robots-tag"] || "";

    const robots = parseDirectives(robotsMeta);
    const xRobotsDirectives = parseDirectives(xRobots);

    const hasNoindex =
        robots.includes("noindex") ||
        xRobotsDirectives.includes("noindex");

    const hasNofollow =
        robots.includes("nofollow") ||
        xRobotsDirectives.includes("nofollow");

    // Prevent double penalties
    let noindexPenaltyApplied = false;
    let nofollowPenaltyApplied = false;

    // -------------------------
    // HTTP Status
    // -------------------------

    if (statusCode >= 300 && statusCode < 400) {
        score -= 10;

        issues.push(`Page returns a redirect (${statusCode}).`);

        recommendations.push(
            "Analyze the destination URL instead of the redirect."
        );
    }
    else if (statusCode === 404) {
        score -= 30;

        issues.push("Page returns HTTP 404 (Not Found).");

        recommendations.push(
            "Return HTTP 200 if this page should be indexed."
        );
    }
    else if (statusCode === 410) {
        score -= 30;

        issues.push("Page returns HTTP 410 (Gone).");
    }
    else if (statusCode >= 500) {
        score -= 40;

        issues.push(`Server error (${statusCode}).`);

        recommendations.push(
            "Fix server errors before allowing indexing."
        );
    }
    else if (statusCode !== 200) {
        score -= 30;

        issues.push(`Unexpected HTTP status code: ${statusCode}.`);

        recommendations.push(
            "Return HTTP 200 for indexable pages."
        );
    }

    // -------------------------
    // Robots Meta
    // -------------------------

    if (robotsTags.length > 1) {
        score -= 10;

        issues.push("Multiple meta robots tags found.");

        recommendations.push(
            "Use only one robots meta tag."
        );
    }

    if (robots.includes("noindex")) {
        issues.push("Meta robots contains NOINDEX.");

        recommendations.push(
            "Remove NOINDEX if the page should appear in search."
        );

        if (!noindexPenaltyApplied) {
            score -= 40;
            noindexPenaltyApplied = true;
        }
    }

    if (robots.includes("nofollow")) {
        issues.push("Meta robots contains NOFOLLOW.");

        recommendations.push(
            "Remove NOFOLLOW if search engines should follow links."
        );

        if (!nofollowPenaltyApplied) {
            score -= 20;
            nofollowPenaltyApplied = true;
        }
    }

    // -------------------------
    // X-Robots-Tag
    // -------------------------

    if (xRobotsDirectives.includes("noindex")) {
        issues.push("X-Robots-Tag contains NOINDEX.");

        recommendations.push(
            "Remove the X-Robots-Tag NOINDEX directive if this page should be indexed."
        );

        if (!noindexPenaltyApplied) {
            score -= 40;
            noindexPenaltyApplied = true;
        }
    }

    if (xRobotsDirectives.includes("nofollow")) {
        issues.push("X-Robots-Tag contains NOFOLLOW.");

        recommendations.push(
            "Remove the X-Robots-Tag NOFOLLOW directive if links should be crawled."
        );

        if (!nofollowPenaltyApplied) {
            score -= 20;
            nofollowPenaltyApplied = true;
        }
    }

    // -------------------------
    // Conflicting directives
    // -------------------------

    if (
        robots.includes("index") &&
        xRobotsDirectives.includes("noindex")
    ) {
        issues.push(
            "Conflicting indexing directives detected (index vs noindex)."
        );

        recommendations.push(
            "Use consistent indexing directives."
        );
    }

    // -------------------------
    // Canonical
    // -------------------------

    if (canonicalTags.length > 1) {
        score -= 10;

        issues.push("Multiple canonical tags found.");

        recommendations.push(
            "Use only one canonical tag."
        );
    }

    if (!canonical) {
        score -= 10;

        issues.push("Canonical tag is missing.");

        recommendations.push(
            "Add a self-referencing canonical tag."
        );
    }
    else {
        let canonicalValid = true;

        try {
            new URL(canonical);
        } catch {
            canonicalValid = false;
        }

        if (!canonicalValid) {
            score -= 10;

            issues.push("Canonical URL is invalid.");

            recommendations.push(
                "Use a valid absolute canonical URL."
            );
        }
        else if (
            normalizeUrl(canonical) !== normalizeUrl(url)
        ) {
            issues.push(
                "Canonical points to a different URL."
            );

            recommendations.push(
                "Verify that the canonical URL is intentional."
            );
        }
    }

    // -------------------------
    // Final score
    // -------------------------

    score = Math.max(0, Math.min(100, score));

    return {
        category: "Indexing & Crawlability",

        score,

        passed: issues.length === 0,

        data: {
            statusCode,

            robotsMeta: robotsMeta || "Default (index,follow)",

            xRobots,

            canonical,

            hasCanonical: !!canonical,

            hasNoindex,

            hasNofollow,

            canonicalMatches:
                canonical
                    ? normalizeUrl(canonical) === normalizeUrl(url)
                    : false
        },

        issues,

        recommendations
    };
}