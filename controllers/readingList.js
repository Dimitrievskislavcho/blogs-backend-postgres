const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const ReadingList = require('../models/readingList')

router.post('/', async (req, res) => {
  const reading = await ReadingList.create({ ...req.body })
  res.json(reading)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const userId = req.decodedToken.id
  const reading = await ReadingList.findByPk(req.params.id)

  if (reading && reading.userId === userId) {
    reading.read = req.body.read
    await reading.save()
    res.json(reading)
  } else {
    throw Error(
      'Unexisting reading item or user is not the owner of the reading!'
    )
  }
})

module.exports = router
