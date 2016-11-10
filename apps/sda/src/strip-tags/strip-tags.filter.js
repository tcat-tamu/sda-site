module.exports = function factory() {
  return stripTags;
}

/**
 * Removes all tags from the given html string
 * @param {string} html
 * @return {string}
 */
function stripTags(html) {
  return html ? String(html).replace(/<[^>]+>/gm, '') : '';
}
