export default function analyzeLinks(context) {

    const { $, url } = context;

    const issues = [];
    const recommendations = [];

    let score = 100;

    const currentHost = new URL(url).hostname;

    const internalLinks = [];
    const externalLinks = [];

    let nofollowLinks = 0;
    let dofollowLinks = 0;
    let emptyLinks = 0;
    let javascriptLinks = 0;
    let mailtoLinks = 0;
    let telLinks = 0;
    let brokenHrefLinks = 0;

    $("a").each((index, element) => {

        const href = ($(element).attr("href") || "").trim();
        const anchorText = $(element).text().trim();
        const rel = ($(element).attr("rel") || "").toLowerCase();

        if (!href) {

            emptyLinks++;

            return;

        }

        if (href.startsWith("javascript:")) {

            javascriptLinks++;

            return;

        }

        if (href.startsWith("mailto:")) {

            mailtoLinks++;

            return;

        }

        if (href.startsWith("tel:")) {

            telLinks++;

            return;

        }

        if (href === "#" || href === "/#") {

            brokenHrefLinks++;

            return;

        }

        let absoluteUrl = href;

        try {

            absoluteUrl = new URL(href, url).href;

            const host = new URL(absoluteUrl).hostname;

            const link = {

                url: absoluteUrl,

                anchorText,

                rel

            };

            if (host === currentHost) {

                internalLinks.push(link);

            }
            else {

                externalLinks.push(link);

            }

            if (rel.includes("nofollow")) {

                nofollowLinks++;

            }
            else {

                dofollowLinks++;

            }

        }
        catch {

            brokenHrefLinks++;

        }

    });

    // -----------------------
    // SEO Checks
    // -----------------------

    if (internalLinks.length === 0) {

        score -= 20;

        issues.push("No internal links found.");

        recommendations.push(
            "Add internal links to improve crawlability."
        );

    }

    if (externalLinks.length === 0) {

        score -= 5;

        issues.push("No external links found.");

    }

    if (emptyLinks > 0) {

        score -= 10;

        issues.push(`${emptyLinks} empty link(s) found.`);

    }

    if (javascriptLinks > 0) {

        score -= 5;

        issues.push(
            `${javascriptLinks} JavaScript link(s) detected.`
        );

    }

    if (brokenHrefLinks > 0) {

        score -= 10;

        issues.push(
            `${brokenHrefLinks} invalid or placeholder link(s).`
        );

    }

    score = Math.max(0, Math.min(score, 100));

    return {

        category: "Internal & External Links",

        score,

        passed: issues.length === 0,

        data: {

            totalLinks:
                internalLinks.length +
                externalLinks.length,

            internalLinks:

                internalLinks.length,

            externalLinks:

                externalLinks.length,

            dofollowLinks,

            nofollowLinks,

            emptyLinks,

            javascriptLinks,

            mailtoLinks,

            telLinks,

            brokenHrefLinks,

            sampleInternalLinks:
                internalLinks.slice(0, 10),

            sampleExternalLinks:
                externalLinks.slice(0, 10)

        },

        issues,

        recommendations

    };

}

































// export default function analyzeLinks(context) {

//     const { $, url } = context;

//     const hostname =
//         new URL(url).hostname;

//     let internal = 0;
//     let external = 0;
//     let nofollow = 0;

//     $("a[href]").each((i, element) => {

//         const href =
//             $(element).attr("href");

//         if (!href) return;

//         if (
//             href.startsWith("/") ||
//             href.includes(hostname)
//         ) {

//             internal++;

//         }
//         else if (
//             href.startsWith("http")
//         ) {

//             external++;

//         }

//         const rel =
//             $(element).attr("rel") || "";

//         if (
//             rel.includes("nofollow")
//         ) {

//             nofollow++;

//         }

//     });

//     return {

//         internal,

//         external,

//         nofollow

//     };

// }