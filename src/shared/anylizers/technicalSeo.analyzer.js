export default function analyzeTechnicalSEO(context) {

    const { $, headers = {}, statusCode = 0 } = context;

    const issues = [];
    const recommendations = [];

    let score = 100;

    // -------------------------
    // Charset
    // -------------------------

    const charset =
        $('meta[charset]').attr('charset') ||
        $('meta[http-equiv="Content-Type"]')
            .attr("content") || "";

    if (!charset) {

        score -= 10;

        issues.push("Charset declaration is missing.");

        recommendations.push(
            "Add <meta charset=\"UTF-8\">."
        );

    }

    // -------------------------
    // Viewport
    // -------------------------

    const viewport =
        $('meta[name="viewport"]').attr("content") || "";

    if (!viewport) {

        score -= 15;

        issues.push("Viewport meta tag is missing.");

        recommendations.push(
            "Add a responsive viewport meta tag."
        );

    }

    // -------------------------
    // Canonical
    // -------------------------

    const canonical =
        $('link[rel="canonical"]').attr("href") || "";

    if (!canonical) {

        score -= 10;

        issues.push("Canonical tag missing.");

        recommendations.push(
            "Add a canonical URL."
        );

    }

    // -------------------------
    // Favicon
    // -------------------------

    const favicon =
        $('link[rel="icon"]').length ||
        $('link[rel="shortcut icon"]').length;

    if (!favicon) {

        score -= 3;

        issues.push("Favicon not detected.");

    }

    // -------------------------
    // Language
    // -------------------------

    const language =
        $("html").attr("lang");

    if (!language) {

        score -= 5;

        issues.push("HTML lang attribute missing.");

        recommendations.push(
            "Specify the document language."
        );

    }

    // -------------------------
    // Doctype
    // -------------------------

    const hasDoctype =
        /<!doctype html>/i.test(context.html);

    if (!hasDoctype) {

        score -= 5;

        issues.push("HTML5 doctype missing.");

    }

    // -------------------------
    // Compression
    // -------------------------

    const encoding =
        headers["content-encoding"] || "";

    if (!encoding) {

        score -= 10;

        issues.push(
            "Response compression not detected."
        );

        recommendations.push(
            "Enable Gzip or Brotli compression."
        );

    }

    // -------------------------
    // Cache Headers
    // -------------------------

    if (!headers["cache-control"]) {

        score -= 5;

        issues.push(
            "Cache-Control header missing."
        );

    }

    // -------------------------
    // HTTP Status
    // -------------------------

    if (statusCode !== 200) {

        score -= 15;

        issues.push(
            `Unexpected HTTP status ${statusCode}.`
        );

    }

    // -------------------------
    // Inline CSS
    // -------------------------

    const inlineStyles =
        $("style").length;

    if (inlineStyles > 5) {

        score -= 3;

        issues.push(
            "Large number of inline style blocks."
        );

    }

    // -------------------------
    // Inline JS
    // -------------------------

    const inlineScripts =
        $("script:not([src])").length;

    if (inlineScripts > 10) {

        score -= 5;

        issues.push(
            "Large number of inline scripts."
        );

    }

    score = Math.max(0, Math.min(score, 100));

    return {

        category: "Technical SEO",

        score,

        passed: issues.length === 0,

        data: {

            charset,

            viewport,

            canonical,

            language,

            hasDoctype,

            compression: encoding || "Not detected",

            cacheControl:
                headers["cache-control"] || null,

            faviconDetected: !!favicon,

            inlineStyles,

            inlineScripts

        },

        issues,

        recommendations

    };

}