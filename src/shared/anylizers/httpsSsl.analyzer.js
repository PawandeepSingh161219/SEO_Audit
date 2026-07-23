import tls from "tls";

export default async function analyzeHttpsSSL(context) {

    const { url, headers = {} } = context;

    const issues = [];
    const recommendations = [];

    let score = 100;

    const parsedUrl = new URL(url);

    const isHttps = parsedUrl.protocol === "https:";

    let certificate = null;

    if (!isHttps) {

        score -= 50;

        issues.push("Website is not using HTTPS.");

        recommendations.push(
            "Redirect all HTTP traffic to HTTPS."
        );

    }

    if (isHttps) {

        try {

            certificate = await getCertificate(parsedUrl.hostname);

        }
        catch {

            score -= 30;

            issues.push("Unable to retrieve SSL certificate.");

        }

    }

    // --------------------------
    // Security Headers
    // --------------------------

    const hsts =
        headers["strict-transport-security"];

    const csp =
        headers["content-security-policy"];

    const xFrame =
        headers["x-frame-options"];

    const xContentType =
        headers["x-content-type-options"];

    if (!hsts) {

        score -= 5;

        issues.push("Strict-Transport-Security header missing.");

    }

    if (!csp) {

        score -= 5;

        issues.push("Content-Security-Policy header missing.");

    }

    if (!xFrame) {

        score -= 3;

        issues.push("X-Frame-Options header missing.");

    }

    if (!xContentType) {

        score -= 3;

        issues.push("X-Content-Type-Options header missing.");

    }

    score = Math.max(0, score);

    return {

        category: "HTTPS / SSL",

        score,

        passed: issues.length === 0,

        data: {

            protocol: parsedUrl.protocol,

            httpsEnabled: isHttps,

            certificate,

            securityHeaders: {

                hsts: !!hsts,

                csp: !!csp,

                xFrameOptions: !!xFrame,

                xContentTypeOptions: !!xContentType

            }

        },

        issues,

        recommendations

    };

}

function getCertificate(hostname) {

    return new Promise((resolve, reject) => {

        const socket = tls.connect(
            443,
            hostname,
            {
                servername: hostname,
                rejectUnauthorized: false
            },
            () => {

                const cert = socket.getPeerCertificate();

                socket.end();

                resolve({

                    subject: cert.subject,

                    issuer: cert.issuer,

                    validFrom: cert.valid_from,

                    validTo: cert.valid_to

                });

            }
        );

        socket.on("error", reject);

    });

}