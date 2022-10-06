const fs = require('fs')
const path = require('path')
const slugify = require('slugify')

const config = (plop) => {
  plop.setHelper('currentDate', () => new Date().toISOString())
  plop.setHelper('slugify', (s) => slugify(s, { lower: true, remove: /[']/g }))

  // Custom Actions
  plop.setActionType('copy', (answer, config, plop) => {
    const src = plop.renderString(config.src, answer)
    const dest = plop.renderString(config.dest, answer)

    fs.copyFileSync(src, dest)
  })

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
}

module.exports = config
