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
        type: 'append',
        path: 'src/components/index.js',
        pattern: /(\/\/ add import)/g,
        template: "import {{camelCase name}} from './{{camelCase name}}'",
      },
      {
        type: 'append',
        path: 'src/components/index.js',
        pattern: /(\/\/ add export)/g,
        template: '  {{camelCase name}},',
      },
    ],
  })
}

module.exports = config
