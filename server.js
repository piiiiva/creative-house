const express = require('express')
const nunjucks = require('nunjucks')

const server = express()

server.use(express.static('public'))
server.set("view engine", "njk")

nunjucks.configure('views', {
    express: server,
    noCache: true,
    autoescape: false,
})

const ideas = require('./dataIdeas')

server.get('/', function(req, res){

    const reversedIdeas = [...ideas].reverse() // [...ideas] é uma cópia da const ideas
    let lastIdeas = []
    for (let idea of reversedIdeas) {
        if (lastIdeas.length < 2) {
            lastIdeas.push(idea)
        }
    }

    return res.render("index.njk", { ideas: lastIdeas })
})

server.get('/ideas', function(req, res){
    const reversedIdeas = [...ideas].reverse()

    return res.render("ideas.njk", { ideas: reversedIdeas })
})

server.listen(5000, () => {
    console.log("=== Server Creative House is running ===")
})