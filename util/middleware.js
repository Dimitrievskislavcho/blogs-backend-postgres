const { Blog, User } = require('../models')
const Session = require('../models/session')
const { SECRET } = require('./config')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

const findBlog = async (req, res, next) => {
  console.log({ Blog })
  const blog = await Blog.findByPk(req.params.id)
  req.blog = blog
  next()
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const session = await Session.findOne({
        where: { userId: decodedToken.id },
        include: {
          model: User,
          attributes: ['disabled'],
        },
      })

      if (!session || session.token !== token) {
        throw new Error('token missing or invalid')
      }

      if (session.user.disabled) {
        throw new Error('user disabled')
      }

      req.decodedToken = decodedToken
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { errorHandler, findBlog, tokenExtractor }
