export default function analyzePageSpeed(context) {

    const {
        $,
        html,
        responseTime = 0,
        headers = {}
    } = context;

    const issues = [];
    const recommendations = [];

    let score = 100;

    // ----------------------------------
    // HTML Size
    // ----------------------------------

    const htmlSize = Buffer.byteLength(html, "utf8");

    const htmlSizeKB = Number((htmlSize / 1024).toFixed(2));

    if (htmlSizeKB > 500) {

        score -= 15;

        issues.push("HTML document is very large.");

        recommendations.push(
            "Reduce HTML size by removing unnecessary markup."
        );

    }

    // ----------------------------------
    // Response Time
    // ----------------------------------

    if (responseTime > 3000) {

        score -= 30;

        issues.push("Very slow server response.");

        recommendations.push(
            "Reduce server response time."
        );

    }
    else if (responseTime > 1500) {

        score -= 15;

        issues.push("Slow server response.");

        recommendations.push(
            "Optimize backend performance."
        );

    }

    // ----------------------------------
    // Resources
    // ----------------------------------

    const cssFiles =
        $('link[rel="stylesheet"]').length;

    const jsFiles =
        $('script[src]').length;

    const images =
        $('img').length;

    const inlineScripts =
        $('script:not([src])').length;

    const inlineStyles =
        $('style').length;

    if (cssFiles > 10) {

        score -= 5;

        issues.push("Too many CSS files.");

        recommendations.push(
            "Combine or minimize CSS files."
        );

    }

    if (jsFiles > 15) {

        score -= 8;

        issues.push("Too many JavaScript files.");

        recommendations.push(
            "Reduce JavaScript requests."
        );

    }

    if (images > 100) {

        score -= 10;

        issues.push("Large number of images.");

        recommendations.push(
            "Lazy-load and compress images."
        );

    }

    if (inlineScripts > 10) {

        score -= 3;

        issues.push("Too many inline scripts.");

    }

    if (inlineStyles > 5) {

        score -= 2;

        issues.push("Too many inline style blocks.");

    }

    // ----------------------------------
    // Compression
    // ----------------------------------

    const encoding =
        headers["content-encoding"] || "";

    const compressionEnabled =
        ["gzip", "br", "deflate"].includes(
            encoding.toLowerCase()
        );

    if (!compressionEnabled) {

        score -= 10;

        issues.push("Compression is not enabled.");

        recommendations.push(
            "Enable Brotli or Gzip compression."
        );

    }

    // ----------------------------------
    // Cache
    // ----------------------------------

    if (!headers["cache-control"]) {

        score -= 5;

        issues.push("Cache-Control header missing.");

        recommendations.push(
            "Configure browser caching."
        );

    }

    score = Math.max(0, Math.min(100, score));

    return {

        category: "Page Speed",

        score,

        passed: issues.length === 0,

        data: {

            responseTime,

            htmlSizeKB,

            cssFiles,

            jsFiles,

            images,

            inlineScripts,

            inlineStyles,

            compression: compressionEnabled,

            compressionType: encoding || null,

            cacheControl:
                headers["cache-control"] || null

        },

        issues,

        recommendations

    };

}









































// export default function analyzePageSpeed(context) {
//     const htmlSize = Buffer.byteLength(context.html, "utf8");

//     const cssFiles = context.$('link[rel="stylesheet"]').length;
//     const jsFiles = context.$("script[src]").length;
//     const images = context.$("img").length;

//     return {
//         responseTime: `${context.responseTime} ms`,
//         htmlSize: `${(htmlSize / 1024).toFixed(2)} KB`,
//         cssFiles,
//         jsFiles,
//         images
//     };
// }


// import puppeteer from "puppeteer";

// export default async function analyzePageSpeed(url) {
//     const browser = await puppeteer.launch({
//         headless: true
//     });

//     const page = await browser.newPage();

//     const start = Date.now();

//     await page.goto(url, {
//         waitUntil: "networkidle2"
//     });

//     const loadTime = Date.now() - start;

//     const metrics = await page.metrics();

//     await browser.close();

//     return {
//         loadTime,
//         metrics
//     };
// }