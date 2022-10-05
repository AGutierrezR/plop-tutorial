const slugify = require('slugify')

const config = (plop) => {
  plop.setHelper('currentDate', () => new Date().toISOString())
  plop.setHelper('slugify', (s) => slugify(s, { lower: true, remove: /[']/g }))

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
        path: 'content/blog/{{slugify title}}/input.md',
        templateFile: '.templates/post.hbs',
      },
    ],
  })
}

module.exports = config
