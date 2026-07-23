export default function analyzeMetaDescription(context ) {

    const description =
        context.$('meta[name="description"]').attr("content")?.trim() || "";

    const issues = [];

    const recommendations = [];

    let score = 100;

    if (!description) {

        score = 0;

        issues.push("Missing meta description.");

        recommendations.push("Add a meta description.");
    }
    else {

        if (description.length < 120) {

            score -= 20;

            issues.push("Description is too short.");

            recommendations.push(
                "Keep description between 120 and 160 characters."
            );
        }

        if (description.length > 160) {

            score -= 20;

            issues.push("Description is too long.");

            recommendations.push(
                "Keep description below 160 characters."
            );
        }

    }

    return {

        category: "Meta Description",

        score: Math.max(score, 0),

        passed: issues.length === 0,

        data: {

            description,

            length: description.length

        },

        issues,

        recommendations

    };

}