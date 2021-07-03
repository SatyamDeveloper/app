require('dotenv').config()
require('./db/conn')

const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const user = require('./routes/user')
const admin = require('./routes/admin')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set('view engine', 'ejs')

app.use(express.static(require('path').join(__dirname, '../public')))

app.get('/sitemap',(req,res)=>{
 res.set('Content-Type', 'application/rss+xml');
res.send('sitemap.xml');
})
app.use(user)
app.use('/admin', admin)

app.listen(port, console.log(`http://localhost:${port}`))

