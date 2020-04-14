const express = require('express')
const nunjucks = require('nunjucks')

const server = express()

const db =require('./db')

server.use(express.static('public'))
server.set("view engine", "njk")

// Habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))

nunjucks.configure('views', {
    express: server,
    noCache: true,
    autoescape: false,
})

// const ideas = require('./dataIdeas')

server.get('/', function(req, res){

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) {
            console.log(err)
            return res.send('Erro no banco de dados!')
        }

        const reversedIdeas = [...rows].reverse() // [...ideas] é uma cópia da const ideas
        
        let lastIdeas = []
        for (let idea of reversedIdeas) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }

        return res.render("index.njk", { ideas: lastIdeas })
        
    })   
})

server.get('/ideas', function(req, res){
    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) {
            console.log(err)
            return res.send('Erro no banco de dados!')
        }

        const reversedIdeas = [...rows].reverse()
    
        return res.render("ideas.njk", { ideas: reversedIdeas })
    })
})

server.post('/', function(req, res){
    const query = `INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
        ) VALUES (?, ?, ?, ?, ?);`
    
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]
            
    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return res.send('Erro no banco de dados!')
        }

        return res.redirect('/ideas')
    })
})

server.listen(5000, () => {
    console.log("=== Server Creative House is running ===")
})