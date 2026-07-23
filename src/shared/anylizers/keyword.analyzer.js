export default function analyzeKeyword(context, keyword = "") {

    const { $ } = context;

    if (!keyword) {

        return {
            score: null,
            message: "Keyword not provided."
        };

    }

    const title =
        $("title").text().toLowerCase();

    const description =
        $('meta[name="description"]')
            .attr("content")
            ?.toLowerCase() || "";

    const h1 =
        $("h1")
            .first()
            .text()
            .toLowerCase();

    const body =
        $("body")
            .text()
            .toLowerCase();

    const occurrences =
        body.match(
            new RegExp(keyword.toLowerCase(), "g")
        ) || [];

    const words =
        body.split(/\s+/).length;

    const density =
        ((occurrences.length / words) * 100)
            .toFixed(2);

    return {

        keyword,

        inTitle:
            title.includes(keyword),

        inDescription:
            description.includes(keyword),

        inH1:
            h1.includes(keyword),

        occurrences:
            occurrences.length,

        density:
            `${density}%`

    };

}