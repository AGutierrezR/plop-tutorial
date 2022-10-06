const fs = require('fs')
const slugify = require('slugify')

const pack = plop => {
  plop.setHelper('currentDate', () => new Date().toISOString())
  plop.setHelper('slugify', (s) => slugify(s, { lower: true, remove: /[']/g }))

  // Custom Actions
  plop.setActionType('copy', (answer, config, plop) => {
    const src = plop.renderString(config.src, answer)
    const dest = plop.renderString(config.dest, answer)

    fs.copyFileSync(src, dest)
  })
}

module.exports = pack