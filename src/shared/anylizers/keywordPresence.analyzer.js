export default function analyzeKeywordPresence(context, keyword) {

    const { $, url } = context;

    const issues = [];
    const recommendations = [];

    let score = 100;

    if (!keyword || keyword.trim() === "") {

        return {

            category: "Keyword Presence",

            score: null,

            passed: false,

            data: null,

            issues: [
                "No keyword was provided for analysis."
            ],

            recommendations: [
                "Provide a target keyword."
            ]

        };

    }

    keyword = keyword.trim().toLowerCase();

    const title =
        $("title").text().trim().toLowerCase();

    const description =
        $('meta[name="description"]')
            .attr("content")
            ?.trim()
            .toLowerCase() || "";

    const h1 =
        $("h1")
            .first()
            .text()
            .trim()
            .toLowerCase();

    const body =
        $("body")
            .text()
            .replace(/\s+/g, " ")
            .toLowerCase();

    const pageUrl =
        url.toLowerCase();

    const occurrences =
        body.match(
            new RegExp(
                keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "gi"
            )
        ) || [];

    const words =
        body.split(/\s+/).filter(Boolean);

    const density =
        words.length === 0
            ? 0
            : Number(
                  (
                      (occurrences.length /
                          words.length) *
                      100
                  ).toFixed(2)
              );

    const inTitle =
        title.includes(keyword);

    const inDescription =
        description.includes(keyword);

    const inH1 =
        h1.includes(keyword);

    const inURL =
        pageUrl.includes(keyword);

    if (!inTitle) {

        score -= 20;

        issues.push(
            "Keyword is missing from the title."
        );

        recommendations.push(
            "Include the primary keyword in the page title."
        );

    }

    if (!inDescription) {

        score -= 15;

        issues.push(
            "Keyword is missing from the meta description."
        );

        recommendations.push(
            "Include the primary keyword in the meta description."
        );

    }

    if (!inH1) {

        score -= 20;

        issues.push(
            "Keyword is missing from the H1 heading."
        );

        recommendations.push(
            "Include the primary keyword in the H1."
        );

    }

    if (!inURL) {

        score -= 10;

        issues.push(
            "Keyword is missing from the URL."
        );

        recommendations.push(
            "Use an SEO-friendly URL containing the keyword."
        );

    }

    if (occurrences.length === 0) {

        score -= 25;

        issues.push(
            "Keyword does not appear in the page content."
        );

        recommendations.push(
            "Use the keyword naturally within the content."
        );

    }

    score = Math.max(0, score);

    return {

        category: "Keyword Presence",

        score,

        passed: issues.length === 0,

        data: {

            keyword,

            foundInTitle: inTitle,

            foundInDescription: inDescription,

            foundInH1: inH1,

            foundInURL: inURL,

            occurrences: occurrences.length,

            keywordDensity: `${density}%`

        },

        issues,

        recommendations

    };

}