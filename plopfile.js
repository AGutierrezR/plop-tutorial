const config = (plop) => {
  plop.setGenerator('post', {
    description: 'Generate file',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'What do you want to title this post?'
      },
      {
        type: 'input',
        name: 'description',
        message: 'What is this post about?'
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'content/blog/{{dashCase title}}/input.md',
        templateFile: '.templates/post.hbs',
        data: {
          date: new Date().toISOString()
        }
      }
    ]
  })
}

module.exports = config