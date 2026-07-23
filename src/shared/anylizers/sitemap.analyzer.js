import axios from "axios";

export default async function analyzeSitemap(baseUrl) {

    const issues = [];
    const recommendations = [];

    let score = 100;

    const sitemapUrl =
        `${baseUrl}/sitemap.xml`;

    try {

        const response = await axios.get(sitemapUrl, {
            timeout: 10000,
            validateStatus: () => true
        });

        if (response.status !== 200) {

            score -= 40;

            issues.push("Sitemap not found.");

            recommendations.push(
                "Generate sitemap.xml."
            );

            return {

                category: "Sitemap",

                score,

                passed: false,

                data: {

                    exists: false

                },

                issues,

                recommendations

            };

        }

        const xml = response.data;

        const urlCount =
            (xml.match(/<url>/g) || []).length;

        return {

            category: "Sitemap",

            score,

            passed: true,

            data: {

                exists: true,

                url: sitemapUrl,

                totalUrls: urlCount

            },

            issues,

            recommendations

        };

    }
    catch {

        return {

            category: "Sitemap",

            score: 0,

            passed: false,

            data: {

                exists: false

            },

            issues: [
                "Unable to fetch sitemap."
            ],

            recommendations: [
                "Ensure sitemap.xml is accessible."
            ]

        };

    }

}