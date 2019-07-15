const express = require('express')
var cors = require('cors')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const myConnection = require('express-myconnection')
const bodyParser = require('body-parser')

//importing routes
const CASOS_ROUTES = require('./routes/casos')
const ADMIN_ROUTES = require('./routes/admin')

//settings
const PORT = 8080
app.set('port', process.env.PORT || PORT)
app.use(cors())

//middlewares
app.use(morgan('dev'))
app.use(myConnection(mysql, {
    host: '35.236.101.114',
    user: 'root',
    password: 'qwerty123',
    port: '3306',
    database: 'mongehenriquez'
}, 'single'))
app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}))

//routes
app.use('/casos', CASOS_ROUTES)
app.use('/admin', ADMIN_ROUTES)

//static files


app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`)
})