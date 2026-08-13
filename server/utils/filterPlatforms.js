//this is server/utils/filterPlatforms.js

module.exports = function filterRow(row, platforms) {
  if (!platforms || platforms.length === 0) return true
  return platforms.includes(row.platform)
}

