const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  })

  const passwordCorrect = body.password === 'secret'

  if (!user) {
    return response.status(401).json({
      error: 'invalid username',
    })
  }

  const session = await Session.findOne({ where: { userId: user.id } })

  if (user.disabled) {
    return response.status(401).json({
      error: 'user cannot perform login',
    })
  }

  if (!passwordCorrect) {
    session && (await session.destroy())
    return response.status(401).json({
      error: 'invalid password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  if (session) {
    session.token = token
    await session.save()
  } else {
    await Session.create({ userId: user.id, token })
  }

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
