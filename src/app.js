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
const CLIENTES_ROUTES = require('./routes/clientes')
const ACTIVIDADES_ROUTES = require('./routes/actividades')
const COMENTARIOS_ROUTES = require('./routes/comentarios')

//settings
const PORT = 3000
app.set('port', process.env.PORT || PORT)
app.use(cors())

//middlewares, test
app.use(morgan('dev'))
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
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
app.use('/clientes', CLIENTES_ROUTES)
app.use('/actividades', ACTIVIDADES_ROUTES)
app.use('/comentarios', COMENTARIOS_ROUTES)


app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`)
})