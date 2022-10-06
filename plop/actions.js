const fs = require('fs')

const actions = plop => {
  plop.setDefaultInclude({ actionTypes: true })

  plop.setActionType('copy', (answer, config, plop) => {
    const src = plop.renderString(config.src, answer)
    const dest = plop.renderString(config.dest, answer)

    fs.copyFileSync(src, dest)
  })
}

module.exports = actions