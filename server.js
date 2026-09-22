const http = require('http')
const handleRoutes = require('./src/core/router');

const server = http.createServer((req, res) => {
    
    handleRoutes(req, res);

    console.log(req.url)
})
server.listen(3000);