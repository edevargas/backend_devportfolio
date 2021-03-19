const http = require('http')
const { projects } = require('./data')
const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json'})
    response.end(JSON.stringify(projects))
})

const PORT = 3001
app.listen(PORT)
console.log('Server running on port ${PORT}')