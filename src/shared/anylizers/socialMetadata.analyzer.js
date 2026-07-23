export default function analyzeSocialMetadata(context) {

    const { $ } = context;

    const issues = [];
    const recommendations = [];

    let score = 100;

    // ---------------------------
    // Open Graph
    // ---------------------------

    const openGraph = {

        title:
            $('meta[property="og:title"]').attr("content") || "",

        description:
            $('meta[property="og:description"]').attr("content") || "",

        image:
            $('meta[property="og:image"]').attr("content") || "",

        url:
            $('meta[property="og:url"]').attr("content") || "",

        type:
            $('meta[property="og:type"]').attr("content") || "",

        siteName:
            $('meta[property="og:site_name"]').attr("content") || "",

        locale:
            $('meta[property="og:locale"]').attr("content") || ""

    };

    // ---------------------------
    // Twitter Card
    // ---------------------------

    const twitter = {

        card:
            $('meta[name="twitter:card"]').attr("content") || "",

        title:
            $('meta[name="twitter:title"]').attr("content") || "",

        description:
            $('meta[name="twitter:description"]').attr("content") || "",

        image:
            $('meta[name="twitter:image"]').attr("content") || "",

        site:
            $('meta[name="twitter:site"]').attr("content") || "",

        creator:
            $('meta[name="twitter:creator"]').attr("content") || ""

    };

    // ---------------------------
    // Open Graph Validation
    // ---------------------------

    Object.entries(openGraph).forEach(([key, value]) => {

        if (!value) {

            score -= 5;

            issues.push(`Missing Open Graph ${key}.`);

        }

    });

    // ---------------------------
    // Twitter Validation
    // ---------------------------

    Object.entries(twitter).forEach(([key, value]) => {

        if (!value) {

            score -= 3;

            issues.push(`Missing Twitter ${key}.`);

        }

    });

    // ---------------------------
    // Image Validation
    // ---------------------------

    if (!openGraph.image) {

        recommendations.push(
            "Add og:image for rich social previews."
        );

    }

    if (!twitter.image) {

        recommendations.push(
            "Add twitter:image."
        );

    }

    // ---------------------------

    score = Math.max(0, Math.min(score, 100));

    return {

        category: "Social Metadata",

        score,

        passed: issues.length === 0,

        data: {

            openGraph,

            twitter

        },

        issues,

        recommendations

    };

}