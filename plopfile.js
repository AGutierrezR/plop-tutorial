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
}

module.exports = config
