const { fn, col } = require('sequelize')
const { Blog } = require('../models')

const authorsRouter = require('express').Router()

authorsRouter.get('/', async (req, res) => {
  const bloggsByAuthor = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('id')), 'articles'],
      [fn('SUM', col('likes')), 'likes'],
    ],
    group: ['author'],
    order: [['likes', 'DESC']],
  })
  res.json(bloggsByAuthor)
})

module.exports = authorsRouter
