const Session = require('../models/session')
const { tokenExtractor } = require('../util/middleware')

const router = require('express').Router()

router.delete('/', tokenExtractor, async (req, res) => {
  const userId = req.decodedToken.id
  const session = await Session.findOne({ where: { userId } })
  await session.destroy()
  res.send({ status: 'logged out' })
})

module.exports = router
