
module.exports = {
    apps : [{
        name   : "TODO",
        script : "dist/index.js",
        _development: {
            NODE_ENV: "development"
        },
        exec_mode: 'cluster',
        ref: 'main',
        repo: 'https://github.com/donteghen/todo-api.git',
        watch: true
    }]
  }
  