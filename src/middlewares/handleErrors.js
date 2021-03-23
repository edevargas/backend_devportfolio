module.exports = (error, request, response, next) => {
  console.error(error)
  switch (error.name) {
    case 'CastError':
      response.status(400).send({ error: 'Id malformed' })
      break

    default:
      response.status(500).json({ error: error })
      break
  }
}
