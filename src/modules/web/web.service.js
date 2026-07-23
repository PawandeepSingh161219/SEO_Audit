import crawlWebsite from "../../shared/anylizers/crawler.js";
import parseHTML from "../../shared/anylizers/parser.js";
import {AppError} from "../../shared/utils/error.js";
import analyzeMetaTitle from "../../shared/anylizers/metatitile.js";
import analyzeMetaDescription from "../../shared/anylizers/metadesc.js";
import analyzeHeading from "../../shared/anylizers/headinganylizer.js";
import analyzePageSpeed from "../../shared/anylizers/speedanalizer.js";
import analyzeImageAlt from "../../shared/anylizers/imgTag.analizer.js";
import analyzeUrlStructure from "../../shared/anylizers/urlStructure.analyzer.js";
import analyzeCrawlability from "../../shared/anylizers/crawlability.analyzer.js";
import analyzeTechnicalSEO from "../../shared/anylizers/technicalSeo.analyzer.js";
import analyzeHttpsSSL from "../../shared/anylizers/httpsSsl.analyzer.js";
import analyzeRobotsTxt from "../../shared/anylizers/robotsTxt.analyzer.js";
import analyzeSitemap from "../../shared/anylizers/sitemap.analyzer.js";
import analyzeSitemapDetection from "../../shared/anylizers/sitemapDetection.analyzer.js";
import analyzeKeyword from "../../shared/anylizers/keyword.analyzer.js";
import analyzeContent from "../../shared/anylizers/content.analyzer.js";
import analyzeLinks from "../../shared/anylizers/links.analyzer.js";
import analyzeSchema from "../../shared/anylizers/schema.analyzer.js";
import analyzeSocial from "../../shared/anylizers/social.analyzer.js";
import analyzeKeywordPresence from "../../shared/anylizers/keywordPresence.analyzer.js";
import analyzeContentReadability from "../../shared/anylizers/contentReadability.analyzer.js";
import analyzeDomain from "../../shared/anylizers/domain.analyzer.js";
import analyzeSocialMetadata from "../../shared/anylizers/socialMetadata.analyzer.js";
import calculateOverallSEOScore from "../../shared/anylizers/overallScore.analyzer.js";


export const seoAudit = async (url) => {
  try {
    // Simulate an asynchronous operation (e.g., fetching data from an API)

    const page = await crawlWebsite(url);
    const parsedPage = parseHTML(page);

   
     return {
            metaTitle: analyzeMetaTitle(parsedPage),
            metaDescription: analyzeMetaDescription(parsedPage),
            headings: analyzeHeading(parsedPage),
            pageSpeed: await analyzePageSpeed(parsedPage),
            images: analyzeImageAlt(parsedPage),
            imageURL: analyzeUrlStructure(url, parsedPage),
            crawlability: analyzeCrawlability({ $: parsedPage, headers: page.headers, statusCode: page.statusCode, url }),
            technicalSEO: analyzeTechnicalSEO(parsedPage),
            httpsSSL: await analyzeHttpsSSL(parsedPage),
            robotsTxt: await analyzeRobotsTxt(url),
            sitemap: await analyzeSitemap(url),
            sitemapDetection: await analyzeSitemapDetection({ url, $: parsedPage }),
            keywordAnalysis: analyzeKeyword(parsedPage),
            contentAnalysis: analyzeContent(parsedPage),
            linkAnalysis: analyzeLinks( parsedPage ),
            schemaAnalysis: analyzeSchema(parsedPage),
            socialAnalysis: analyzeSocial(parsedPage),
            keywordPresence: analyzeKeywordPresence(parsedPage, url),
            contentReadability: analyzeContentReadability(parsedPage),
            domainAnalysis: await analyzeDomain({ url }),
            socialMetadata: analyzeSocialMetadata(parsedPage),
            overallScore: calculateOverallSEOScore({
                meta: analyzeMetaTitle(parsedPage),
                headings: analyzeHeading(parsedPage),
                images: analyzeImageAlt(parsedPage),
                url: analyzeUrlStructure(url, parsedPage),
                crawlability: analyzeCrawlability({ $: parsedPage, headers: page.headers, statusCode: page.statusCode, url }),
                technical: analyzeTechnicalSEO(parsedPage),
                performance: await analyzePageSpeed(parsedPage),
                https: await analyzeHttpsSSL(parsedPage),
                sitemap: await analyzeSitemap(url),
                onPage: analyzeContent(parsedPage),
                authority: await analyzeDomain({ url }),
                domain: await analyzeDomain({ url }),
                social: analyzeSocial(parsedPage)
            })


        };
  } catch (error) {
    console.error("Error during SEO audit:", error);
    throw new AppError("An error occurred during the SEO audit", 500);
  }
}
