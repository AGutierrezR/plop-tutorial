const fs = require('fs')

const actions = (plop) => {
  plop.setDefaultInclude({ actionTypes: true })

  plop.setActionType('copy', (answer, config, plop) => {
    const src = plop.renderString(config.src, answer)
    const dest = plop.renderString(config.dest, answer)

    fs.copyFileSync(src, dest)
  })

  plop.setActionType('update-imports', (data, config, plop) => {
    const template = plop.renderString(config.template, data)
    const fileData = fs.readFileSync(config.path, 'utf8')

    const fileLineArray = fileData.split(/\n/)
    const lastImportIdx = findLastIndex(includes('import'), fileLineArray)

    let newProp
    if (lastImportIdx === -1) {
      newProp = insert(0, `${template}\n`, fileLineArray)
    } else {
      newProp = insert(lastImportIdx + 1, template, fileLineArray)
    }

    const newFile = newProp.join('\n')

    fs.writeFileSync(`${config.path}`, newFile)
  })

  plop.setActionType('update-exports', (data, config, plop) => {
    const template = plop.renderString(config.template, data)
    const fileData = fs.readFileSync(config.path, 'utf8')

    const existExportRegex = /export\s?{/g
    const existExport = existExportRegex.test(fileData)

    if (!existExport) {
      return fs.writeFileSync(
        `${config.path}`,
        `${fileData}export { ${template} }\n`
      )
    }

    const exportRegex = /export\s?{([^}]*)(?:})/
    const exportContent = fileData.match(exportRegex)

    let newExportsContent
    if (/\n/.test(exportContent)) {
      const indentationRegex = /( {1,}).+/
      const indentation = exportContent[1].match(indentationRegex)
      newExportsContent = `${exportContent[1].slice(0, -1)}\n${
        indentation[1]
      }${template},\n`
    } else {
      newExportsContent = `${exportContent[1].slice(0, -1)}, ${template} `
    }

    const newExports = exportContent[0].replace(
      exportContent[1],
      newExportsContent
    )
    const newFile = fileData.replace(exportContent[0], newExports)

    fs.writeFileSync(`${config.path}`, newFile)
  })
}

module.exports = actions

function findLastIndex(fn, list) {
  let idx = list.length - 1
  while (idx >= 0) {
    if (fn(list[idx])) {
      return idx
    }

    idx -= 1
  }
  return -1
}

const insert = (idx, element, list) => {
  idx = idx < list.length && idx >= 0 ? idx : list.length
  var result = Array.prototype.slice.call(list, 0)
  result.splice(idx, 0, element)
  return result
}

const includes = (pattern) => (arr) => arr.includes(pattern)
