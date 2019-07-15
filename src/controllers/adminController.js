var bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = '6jgMZ!EYhbsn!t3'
const controller = {}

controller.login = (req, response) => {
    const { correo, clave } = req.body
    req.getConnection((req, conn) => {
        conn.query('SELECT idAdmin, correo, contrasena FROM admin WHERE correo = ?', [correo], (err, rows) => {
            if (err) {
                response.json({
                    status: 500,
                    message: 'Internal Server Error',
                    data: err
                })
            } else {
                if (rows.length > 0) {
                    let hash = rows[0].contrasena
                    hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
                    bcrypt.compare(clave, hash, (err, res) => {
                        if (res) {
                            jwt.sign({ user: rows }, SECRET, (err, token) => {
                                response.json({
                                    status: 200,
                                    message: 'OK',
                                    data: { token }
                                })
                            })
                        } else {
                            response.json({
                                status: 403,
                                message: 'Forbidden',
                                data: {
                                    message: 'Contraseña incorrecta'
                                }
                            })
                        }
                    })
                } else {
                    response.json({
                        status: 403,
                        message: 'Forbidden',
                        data: {
                            message: 'Correo inexistente'
                        }
                    })
                }
            }
        })
    })
}

controller.get = (req, res) => {
    
}

function verifyToken(req, res, next) {
    //Get header value
    const bearerHeader = req.headers['authorization']
    //Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //Split at the space Bearer <access_token> that space
        const bearer = bearerHeader.split(' ')
        //Get token from array
        const bearerToken = bearer[1]
        req.token = bearerToken
        //Next middleware or function
        next()
    } else {
        //Forbidden or Prohibit
        res.sendStatus(403)
    }
}

module.exports = controller