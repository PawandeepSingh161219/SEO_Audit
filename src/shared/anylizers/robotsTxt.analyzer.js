import axios from "axios";

export default async function analyzeRobotsTxt(baseUrl) {

    const issues = [];
    const recommendations = [];

    let score = 100;

    const robotsUrl = `${baseUrl}/robots.txt`;

    try {

        const response = await axios.get(robotsUrl, {
            timeout: 10000,
            validateStatus: () => true
        });

        if (response.status !== 200) {

            score -= 40;

            issues.push("robots.txt not found.");

            recommendations.push(
                "Create a robots.txt file."
            );

            return {
                category: "Robots.txt",
                score,
                passed: false,
                data: {
                    exists: false
                },
                issues,
                recommendations
            };

        }

        const content = response.data;

        const hasUserAgent =
            /User-agent:/i.test(content);

        const hasSitemap =
            /Sitemap:/i.test(content);

        const disallowRules =
            (content.match(/Disallow:/gi) || []).length;

        if (!hasUserAgent) {

            score -= 20;

            issues.push("User-agent directive missing.");

        }

        if (!hasSitemap) {

            score -= 10;

            issues.push("Sitemap directive missing.");

            recommendations.push(
                "Reference your sitemap in robots.txt."
            );

        }

        return {

            category: "Robots.txt",

            score,

            passed: issues.length === 0,

            data: {

                exists: true,

                url: robotsUrl,

                hasUserAgent,

                hasSitemap,

                disallowRules

            },

            issues,

            recommendations

        };

    }
    catch {

        return {

            category: "Robots.txt",

            score: 0,

            passed: false,

            data: {

                exists: false

            },

            issues: [
                "Unable to fetch robots.txt."
            ],

            recommendations: [
                "Ensure robots.txt is publicly accessible."
            ]

        };

    }

}