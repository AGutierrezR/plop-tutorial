const slugify = require('slugify')

const helpers = plop => {
  plop.setDefaultInclude({ helpers: true })

  plop.setHelper('currentDate', () => new Date().toISOString())
  plop.setHelper('slugify', (s) => slugify(s, { lower: true, remove: /[']/g }))
}

module.exports = helpers