const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const utils = require('../utils/utils')
const SECRET = utils.SECRET
const controller = {}

controller.read = (req, res) => {
    jwt.verify(req.token, SECRET, (err, authData) => {
        if (err) {
            res.json({
                status: 403,
                message: 'Forbidden',
                data: {
                    message: 'Usuario no identificado'
                }
            })
        } else {
            req.getConnection((err, conn) => {
                conn.query('SELECT idCliente, nombres, apellidos FROM clientes', (err, rows) => {
                    if (err) {
                        res.json({
                            status: 500,
                            message: 'Internal Server Error',
                            data: err
                        })
                    } else {
                        res.json({
                            status: 200,
                            message: 'OK',
                            data: rows
                        })
                    }
                })
            })
        }
    })
}

controller.login = (req, response) => {
    const { correo, clave } = req.body
    req.getConnection((req, conn) => {
        conn.query('SELECT idCliente, correo, contrasena FROM clientes WHERE correo = ?', [correo], (err, rows) => {
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
                            let user = { idCliente: rows[0].idCliente, correo: rows[0].correo }
                            jwt.sign({ user }, SECRET, (err, token) => {
                                response.json({
                                    status: 200,
                                    message: 'OK',
                                    data: { idCliente: rows[0].idCliente, token }
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
    jwt.verify(req.token, SECRET, (err, authData) => {
        if (err) {
            res.json({
                status: 403,
                message: 'Forbidden',
                data: {
                    message: 'Usuario no identificado'
                }
            })
        } else {
            req.getConnection((err, conn) => {
                conn.query(`SELECT correo, docIdentificacion, nombreDocumento, nombres, 
                            apellidos, telefono, fechaNacimiento
                            FROM clientes WHERE idCliente = ?`,
                    [authData.user.idCliente], (err, rows) => {
                        if (err) {
                            res.json({
                                status: 500,
                                message: 'Internal Server Error',
                                data: err
                            })
                        } else {
                            if (rows.length > 0) {
                                res.json({
                                    status: 200,
                                    message: 'OK',
                                    data: rows[0]
                                })
                            } else {
                                res.json({
                                    status: 404,
                                    message: 'Not Found',
                                    data: {
                                        message: 'Cliente no encontrado'
                                    }
                                })
                            }
                        }
                    })
            })
        }
    })
}

controller.update = (req, res) => {
    jwt.verify(req.token, SECRET, (err, authData) => {
        if (err) {
            res.json({
                status: 403,
                message: 'Forbidden',
                data: {
                    message: 'Usuario no identificado'
                }
            })
        } else {
            const { nombres, apellidos, telefono, idDoc, documento, correo } = req.body
            req.getConnection((err, conn) => {
                conn.query(`UPDATE clientes SET nombres = ?, apellidos = ?, telefono = ?,
                            docIdentificacion = ?, nombreDocumento = ?, correo = ? WHERE idCliente = ?`,
                    [nombres, apellidos, telefono, idDoc, documento, correo, authData.user.idCliente], (err, rows) => {
                        if (err) {
                            res.json({
                                status: 500,
                                message: 'Internal Server Error',
                                data: err
                            })
                        } else {
                            res.json({
                                status: 205,
                                message: 'Reset Content',
                                data: {
                                    message: 'Cliente modificado correctamente'
                                }
                            })
                        }
                    })
            })
        }
    })
}


module.exports = controller