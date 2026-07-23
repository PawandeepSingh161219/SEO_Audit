export default function analyzeContentReadability(context) {

    const { $ } = context;

    const issues = [];
    const recommendations = [];

    let score = 100;

    // ------------------------------------
    // Extract visible content
    // ------------------------------------

    $("script").remove();
    $("style").remove();
    $("noscript").remove();

    const text = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();

    const words = text.length
        ? text.split(" ").filter(Boolean)
        : [];

    const wordCount = words.length;

    const paragraphs = $("p").length;

    const headings =
        $("h1,h2,h3,h4,h5,h6").length;

    const sentences =
        text.match(/[.!?]+/g)?.length || 1;

    const averageWordsPerSentence =
        Number((wordCount / sentences).toFixed(2));

    // ------------------------------------
    // Content Length
    // ------------------------------------

    if (wordCount < 300) {

        score -= 35;

        issues.push("Thin content detected.");

        recommendations.push(
            "Increase the content to at least 300 words."
        );

    }
    else if (wordCount < 600) {

        score -= 15;

        issues.push(
            "Content could be more comprehensive."
        );

        recommendations.push(
            "Expand the page with useful information."
        );

    }

    // ------------------------------------
    // Paragraph Structure
    // ------------------------------------

    if (paragraphs === 0) {

        score -= 20;

        issues.push("No paragraph tags found.");

        recommendations.push(
            "Structure content using paragraph elements."
        );

    }

    // ------------------------------------
    // Heading Structure
    // ------------------------------------

    if (headings === 0) {

        score -= 15;

        issues.push("No headings detected.");

        recommendations.push(
            "Use headings to organize content."
        );

    }

    // ------------------------------------
    // Sentence Length
    // ------------------------------------

    if (averageWordsPerSentence > 25) {

        score -= 10;

        issues.push(
            "Sentences are too long."
        );

        recommendations.push(
            "Break long sentences into shorter ones."
        );

    }

    // ------------------------------------
    // Reading Time
    // ------------------------------------

    const readingTime =
        Math.max(
            1,
            Math.ceil(wordCount / 200)
        );

    score = Math.max(0, Math.min(score, 100));

    return {

        category: "Content Length & Readability",

        score,

        passed: issues.length === 0,

        data: {

            wordCount,

            paragraphCount: paragraphs,

            headingCount: headings,

            sentenceCount: sentences,

            averageWordsPerSentence,

            estimatedReadingTime:
                `${readingTime} min`

        },

        issues,

        recommendations

    };

}