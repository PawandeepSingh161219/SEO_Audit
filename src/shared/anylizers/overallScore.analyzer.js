export default function calculateOverallSEOScore(reports) {

    const categories = [];

    let totalScore = 0;

    let totalWeight = 0;

    // -----------------------------
    // Category Weights
    // -----------------------------

    const weights = {

        meta: 10,

        headings: 8,

        images: 8,

        url: 7,

        crawlability: 12,

        technical: 12,

        performance: 12,

        https: 8,

        sitemap: 5,

        onPage: 10,

        authority: 3,

        domain: 3,

        social: 2

    };

    Object.entries(weights).forEach(([key, weight]) => {

        const report = reports[key];

        if (!report) {

            return;

        }

        categories.push({

            category: report.category,

            score: report.score,

            weight

        });

        totalScore += report.score * weight;

        totalWeight += weight;

    });

    const overallScore =
        totalWeight === 0
            ? 0
            : Math.round(totalScore / totalWeight);

    // -----------------------------

    // Grade

    // -----------------------------

    let grade = "F";

    if (overallScore >= 90)
        grade = "A";

    else if (overallScore >= 80)
        grade = "B";

    else if (overallScore >= 70)
        grade = "C";

    else if (overallScore >= 60)
        grade = "D";

    // -----------------------------

    // Summary

    // -----------------------------

    const passed =
        categories.filter(
            c => c.score >= 80
        ).length;

    const failed =
        categories.length - passed;

    return {

        category: "Overall SEO Score",

        score: overallScore,

        grade,

        passed,

        failed,

        totalChecks:

            categories.length,

        categories

    };

}