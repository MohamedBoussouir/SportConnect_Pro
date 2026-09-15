const { log } = require('console')
const http = require('http')
const fs = require('fs')
const ejs = require('ejs');
const findMyWay = require('find-my-way');
const server = http.createServer((req, res) => {
    findMyWay.get('/', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>مرحباً بك في SportConnect Pro</h1><p>جرب الدخول على: <a href="/activities/1">/activities/1</a></p>');
    })
    if (req.method == "POST") {
        let body = ""
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(body);
        })
    }


    ejs.renderFile('./src/views/home.ejs', (error, data) => {
        res.end(data)
    })
    console.log(req.url);

})

server.listen(3000);
