/*
 * posthtml.config.js copyright (c) 2022 oddhorse all rights reserved uwu
 */

module.exports = {
  plugins: {
    "posthtml-shorten": {
      shortener: {
        process: function (url) {
          return new Promise((resolve, reject) => {
            resolve(url.replace(".html", ""))
          })
        },
      },
      tag: ["a"], // Allowed tags for URL shortening
      attribute: ["href"], // Attributes to replace on the elements
    },
  },
}
