export default function analyzeMetaTitle(context) {
    const title = context.$("title").first().text().trim();

    const issues = [];
    const recommendations = [];
    let score = 100;

    if (!title) {
        score = 0;

        issues.push("Missing title tag.");

        recommendations.push("Add a unique title tag.");
    } else {
        if (title.length < 30) {
            score -= 20;

            issues.push("Title is too short.");

            recommendations.push("Keep title between 30 and 60 characters.");
        }

        if (title.length > 60) {
            score -= 20;

            issues.push("Title is too long.");

            recommendations.push("Keep title under 60 characters.");
        }
    }

    return {
        category: "Meta Title",

        score: Math.max(score, 0),

        passed: issues.length === 0,

        data: {
            title,
            length: title.length
        },

        issues,

        recommendations
    };
}