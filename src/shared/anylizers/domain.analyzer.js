import dns from "dns/promises";

export default async function analyzeDomain(context) {

    const { url } = context;

    const issues = [];
    const recommendations = [];

    let score = 100;

    const parsed = new URL(url);

    const hostname = parsed.hostname;

    const domain = hostname.replace(/^www\./, "");

    let dnsRecords = {
        A: [],
        AAAA: [],
        MX: [],
        NS: [],
        TXT: []
    };

    try {

        dnsRecords.A = await dns.resolve4(domain);

    } catch {

        score -= 20;

        issues.push("A record not found.");

    }

    try {

        dnsRecords.AAAA = await dns.resolve6(domain);

    } catch {}

    try {

        dnsRecords.MX = await dns.resolveMx(domain);

    } catch {

        score -= 10;

        issues.push("MX records not found.");

    }

    try {

        dnsRecords.NS = await dns.resolveNs(domain);

    } catch {

        score -= 10;

        issues.push("Nameservers not found.");

    }

    try {

        dnsRecords.TXT = await dns.resolveTxt(domain);

    } catch {}

    // --------------------------------

    // www Check

    // --------------------------------

    const usesWWW =
        hostname.startsWith("www.");

    // --------------------------------

    // IP Version

    // --------------------------------

    const supportsIPv6 =
        dnsRecords.AAAA.length > 0;

    if (!supportsIPv6) {

        score -= 5;

        issues.push("IPv6 is not configured.");

    }

    // --------------------------------

    // SPF

    // --------------------------------

    const hasSPF =
        dnsRecords.TXT
            .flat()
            .some(record =>
                record.startsWith("v=spf1")
            );

    if (!hasSPF) {

        score -= 5;

        issues.push("SPF record not found.");

    }

    // --------------------------------

    // DMARC

    // --------------------------------

    let hasDMARC = false;

    try {

        const dmarc =
            await dns.resolveTxt(
                `_dmarc.${domain}`
            );

        hasDMARC =
            dmarc.length > 0;

    } catch {}

    if (!hasDMARC) {

        score -= 5;

        issues.push("DMARC record missing.");

    }

    // --------------------------------

    // DKIM

    // --------------------------------

    // Generic detection is not reliable.
    // Requires selector names.

    score = Math.max(0, Math.min(100, score));

    if (issues.length) {

        recommendations.push(
            "Review DNS configuration and email authentication records."
        );

    }

    return {

        category: "Domain Level Checks",

        score,

        passed: issues.length === 0,

        data: {

            domain,

            hostname,

            usesWWW,

            supportsIPv6,

            dns: dnsRecords,

            hasSPF,

            hasDMARC

        },

        issues,

        recommendations

    };

}