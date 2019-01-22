const express = require('express');
const helmet = require('helmet')
const knex = require('knex')
const bcrypt = require('bcryptjs')

const knexConfig = require('./knexfile')
const port = 5000;
const server = express();
const db = knex(knexConfig.development);

server.use(helmet())
server.use(express.json())


server.post('/api/register', (req, res) => {
    const userInfo = req.body;
    const hash = bcrypt.hashSync(userInfo.password, 12);
    userInfo.password = hash
    db(`users`).insert(userInfo)
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => res.status(500).json({ errorMessage: "error creating user" }))
})

server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users').where({username: creds.username}).first()
    .then(user =>{
        if(user && bcrypt.compareSync(creds.password, user.password)){
            res.status(200).json({message: 'welcome'});
        } else{
            res.status(401).json({message: 'You shall not pass'})
        }

    })
    .catch(err =>{
        res.status(500).json(err)
    })
})

server.get('/api/users', (req,res)=>{
    db('users')
    .select('id','username')
    .then(users =>{
        res.status(200).json(users)
    })
    .catch(err => res.status(500).json(err))
})

server.listen(port, () => console.log (`server running on port ${port}`));
