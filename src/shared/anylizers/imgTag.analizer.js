export default function analyzeImageAlt(context) {

    const images = context.$("img");

    const issues = [];
    const recommendations = [];

    const imageDetails = [];

    let missingAlt = 0;
    let emptyAlt = 0;
    let duplicateAlt = 0;
    let longAlt = 0;

    const altMap = new Map();

    images.each((index, element) => {

        const src = context.$(element).attr("src") || "";
        const alt = (context.$(element).attr("alt") || "").trim();

        if (!alt) {

            if (context.$(element).attr("alt") === undefined) {
                missingAlt++;
            } else {
                emptyAlt++;
            }

        } else {

            if (alt.length > 125) {
                longAlt++;
            }

            altMap.set(alt, (altMap.get(alt) || 0) + 1);
        }

        imageDetails.push({
            src,
            alt
        });

    });

    for (const [alt, count] of altMap.entries()) {

        if (count > 1) {
            duplicateAlt++;
        }

    }

    if (missingAlt > 0) {
        issues.push(`${missingAlt} image(s) are missing alt attributes.`);
        recommendations.push("Add descriptive alt attributes to all images.");
    }

    if (emptyAlt > 0) {
        issues.push(`${emptyAlt} image(s) have empty alt attributes.`);
        recommendations.push("Provide meaningful alternative text.");
    }

    if (duplicateAlt > 0) {
        issues.push(`${duplicateAlt} duplicate alt text found.`);
        recommendations.push("Use unique alt text for different images.");
    }

    if (longAlt > 0) {
        issues.push(`${longAlt} alt text(s) exceed 125 characters.`);
        recommendations.push("Keep alt text concise.");
    }

    let score = 100;

    score -= missingAlt * 5;
    score -= emptyAlt * 3;
    score -= duplicateAlt * 2;
    score -= longAlt;

    if (score < 0)
        score = 0;

    return {

        category: "Image Alt Tags",

        score,

        passed: issues.length === 0,

        data: {

            totalImages: images.length,

            missingAlt,

            emptyAlt,

            duplicateAlt,

            longAlt,

            images: imageDetails

        },

        issues,

        recommendations

    };

}