import { body } from "express-validator";

export const validateUrl = [
  body("url")
    .notEmpty()
    .withMessage("URL is required")
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      require_host: true,
      require_tld: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false,
      allow_fragments: true,
      allow_query_components: true,
    })
    .withMessage("Please enter a valid HTTP/HTTPS URL"),
];