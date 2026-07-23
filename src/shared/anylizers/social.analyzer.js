export default function analyzeSocial(context) {

    const { $ } = context;

    return {

        openGraph:

            $('meta[property^="og:"]').length,

        twitter:

            $('meta[name^="twitter:"]').length

    };

}