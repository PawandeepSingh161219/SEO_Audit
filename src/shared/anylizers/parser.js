import * as cheerio from "cheerio";

export default function parseHTML(page) {

    const $ = cheerio.load(page.html);

    return {
        ...page,
        $
    };
}  
