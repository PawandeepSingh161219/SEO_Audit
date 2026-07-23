export default function analyzeSchema(context) {

    const { $ } = context;

    return {

        jsonLD:
            $('script[type="application/ld+json"]').length,

        microdata:
            $("[itemscope]").length,

        rdfa:
            $("[typeof]").length

    };

}