const config = async (plop) => {
  // await plop.load('./plop/pack.js', {}, { helpers: true, actionTypes: true })
  // await plop.load('./plop/helpers.js', {}, { helpers: true })
  // await plop.load('./plop/actions.js', {}, { actionTypes: true })
  await plop.load('./plop/helpers.js')
  await plop.load('./plop/actions.js')

  plop.setGenerator('post', {
    description: 'Generate file',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'What do you want to title this post?',
      },
      {
        type: 'input',
        name: 'description',
        message: 'What is this post about?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'content/blog/{{slugify title}}/index.md',
        templateFile: '.templates/post.hbs',
      },
      {
        type: 'copy',
        src: 'static/blank.txt',
        dest: 'content/blog/{{slugify title}}/blank.txt',
      },
    ],
  })

  plop.setGenerator('component', {
    description: 'Generate files',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component?',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'src/{{pascalCase name}}/',
        base: '.templates/component',
        templateFiles: ['.templates/component/*.hbs'],
      },
    ],
  })

  plop.setGenerator('update-modules', {
    description: 'Append text to files',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Name of the component',
      },
    ],
    actions: [
      {
        type: 'modify',
        path: 'src/components/index.js',
        transform: (fileData, data) => {
          const importTemplate = plop.renderString(data.template, data)
          const fileLinesArray = fileData.split(/\n/)
          const lastImportIdx = findLastIndex(includes('import'), fileLinesArray)

          let newProp
          if (lastImportIdx === -1) {
            newProp = insert(0, `${importTemplate}\n`, fileLinesArray)
          } else {
            newProp = insert(lastImportIdx + 1, importTemplate, fileLinesArray)
          }

          return newProp.join('\n')
        },
        data: {
          template: "import { {{camelCase name}} } from './{{camelCase name}}'",
        },
      },
      {
        type: 'modify',
        path: 'src/components/index.js',
        transform: (prop, data) => {
          const exportTemplate = plop.renderString(data.template, data)

          const existExportRegex = /export\s?{/g
          const existExport = existExportRegex.test(prop)

          if (!existExport) {
            return `${prop}\nexport { ${exportTemplate} }\n`
          }

          const exportRegex = /export\s?{([^}]*)(?:})/
          const exportContent = prop.match(exportRegex)

          let newExportsContent
          if (/\n/.test(exportContent)) {
            const indentationRegex = /( {1,}).+/
            const indentation = exportContent[1].match(indentationRegex)
            newExportsContent = `${exportContent[1].slice(0, -1)}\n${
              indentation[1]
            }${exportTemplate},\n`
          } else {
            newExportsContent = `${exportContent[1].slice(
              0,
              -1
            )}, ${exportTemplate} `
          }

          const newExports = exportContent[0].replace(
            exportContent[1],
            newExportsContent
          )
          const newFile = prop.replace(exportContent[0], newExports)

          return newFile
        },
        data: {
          template: '{{camelCase name}}',
        },
      },
    ],
  })
}

module.exports = config

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
