import axios from "axios";
export default async function crawlWebsite(url) {
    const start = Date.now();
    const response = await axios.get(url, {
        timeout: 15000,
        maxRedirects: 5,
        headers: {
            "User-Agent": "SEOAuditBot/1.0"
        }
    });

    return {
        url,
        html: response.data,
        headers: response.headers,
        status: response.status,
        responseTime: Date.now() - start
    };
}