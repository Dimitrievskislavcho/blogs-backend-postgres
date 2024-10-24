const { Op, fn, Sequelize, col } = require('sequelize')
const { Blog, User } = require('../models')
const { findBlog, tokenExtractor } = require('../util/middleware')
const ReadingList = require('../models/readingList')

const blogsRouter = require('express').Router()

blogsRouter.get('/', async (req, res) => {
  const where = {}
  if (req.query.search) {
    where[Op.or] = [
      Sequelize.where(fn('LOWER', col('title')), {
        [Op.substring]: req.query.search.toLowerCase(),
      }),
      Sequelize.where(fn('LOWER', col('author')), {
        [Op.substring]: req.query.search.toLowerCase(),
      }),
    ]
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  })
  blogs.forEach(({ author, title, likes }) =>
    console.log(`${author}: '${title}', ${likes} likes`)
  )
  res.send(blogs)
})

blogsRouter.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const newBlog = await Blog.create({
    ...req.body,
    userId: user.id,
  })
  res.status(201).send(newBlog)
})

blogsRouter.put('/:id', findBlog, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.send(req.blog)
  } else {
    req.status(204)
  }
})

blogsRouter.delete(`/:id`, tokenExtractor, findBlog, async (req, res) => {
  if (req.blog && req.blog.userId === req.decodedToken.id) {
    await req.blog.destroy()
    res.send()
  } else {
    res.status(404)
  }
})

module.exports = blogsRouter
