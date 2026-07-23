export default function analyzeHeading(context) {

    return {

        h1: context.$("h1").length,

        h2: context.$("h2").length,

        h3: context.$("h3").length,

        h4: context.$("h4").length,

        h5: context.$("h5").length,

        h6: context.$("h6").length

    };

}