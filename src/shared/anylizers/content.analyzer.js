export default function analyzeContent(context) {

    const { $ } = context;

    const text =
        $("body").text().trim();

    const words =
        text.split(/\s+/).filter(Boolean);

    const paragraphs =
        $("p").length;

    return {

        wordCount:
            words.length,

        paragraphCount:
            paragraphs,

        thinContent:
            words.length < 300

    };

}