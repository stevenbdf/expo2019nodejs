const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const utils = require('../utils/utils')
const SECRET = utils.SECRET
const controller = {}

controller.unlockAllAdmins = (req, res) => {
    const { SECRET_PARAM } = req.params
    if (SECRET_PARAM === SECRET) {
        let unlockedEstado = JSON.stringify({ intentos: 0, estado: 1 })
        req.getConnection((err, conn) => {
            conn.query(`UPDATE admin SET autenticacion = ?`,
                [unlockedEstado], (err, rows) => {
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
                            data: {
                                message: 'Todos los administradores han sido desbloqueados'
                            }
                        })
                    }
                })
        })
    } else {
        res.json({
            status: 403,
            message: 'Forbidden',
            data: {
                message: 'Acción no autorizada'
            }
        })
    }
}

controller.login = (req, response) => {
    const { correo, clave } = req.body
    req.getConnection((req, conn) => {
        conn.query('SELECT idAdmin, correo, contrasena, autenticacion FROM admin WHERE correo = ?', [correo], (err, rows) => {
            if (err) {
                response.json({
                    status: 500,
                    message: 'Internal Server Error',
                    data: err
                })
            } else {
                if (rows.length > 0) {
                    // contraseña base
                    let hash = rows[0].contrasena
                    // contraseña para node
                    hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
                    // funcion para comprar contraseña
                    bcrypt.compare(clave, hash, (err, res) => {
                        // correcto
                        if (res) {
                            let estado = JSON.parse(rows[0].autenticacion)
                            if (estado.estado) {
                                estado.estado = 1
                                estado.intentos = 0
                                let newEstado = JSON.stringify(estado)
                                conn.query('UPDATE admin SET autenticacion = ? WHERE correo  = ?', [newEstado, rows[0].correo], err => {
                                    if (err) {
                                        response.json({
                                            status: 500,
                                            message: 'Internal Server Error',
                                            data: err
                                        })
                                    } else {
                                        let user = { idAdmin: rows[0].idAdmin, correo: rows[0].correo }
                                        jwt.sign({ user }, SECRET, (err, token) => {
                                            response.json({
                                                status: 200,
                                                message: 'OK',
                                                data: { idAdmin: rows[0].idAdmin, token }
                                            })
                                        })
                                    }
                                })
                            } else {
                                response.json({
                                    status: 403,
                                    message: 'Forbidden',
                                    data: {
                                        message: 'Tu usuario ha sido bloqueado, contactate con el administrador para poder habilitar tu cuenta de nuevo.'
                                    }
                                })
                            }
                        } else {
                            const MAX_INTENTOS = 3
                            let estado = JSON.parse(rows[0].autenticacion)
                            estado.intentos++
                            if (estado.intentos >= MAX_INTENTOS) {
                                let newEstado = JSON.stringify(estado)
                                conn.query('UPDATE admin SET autenticacion = ? WHERE correo  = ?', [newEstado, rows[0].correo], (err, rows) => {
                                    if (err) {
                                        response.json({
                                            status: 500,
                                            message: 'Internal Server Error',
                                            data: err
                                        })
                                    } else {
                                        response.json({
                                            status: 403,
                                            message: 'Forbidden',
                                            data: {
                                                message: 'Contraseña incorrecta. Tu usuario ha sido bloqueado, contactate con el administrador para poder habilitar tu cuenta de nuevo.'
                                            }
                                        })
                                    }
                                })
                            } else {
                                estado.estado = 1
                                let newEstado = JSON.stringify(estado)
                                conn.query('UPDATE admin SET autenticacion = ? WHERE correo  = ?', [newEstado, rows[0].correo], (err, rows) => {
                                    if (err) {
                                        response.json({
                                            status: 500,
                                            message: 'Internal Server Error',
                                            data: err
                                        })
                                    } else {

                                        response.json({
                                            status: 403,
                                            message: 'Forbidden',
                                            data: {
                                                message: 'Contraseña incorrecta tienes ' + (MAX_INTENTOS - estado.intentos) + ' intentos restantes. Antes de que se bloquee tu usuario'
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                } else {
                    response.json({
                        status: 404,
                        message: 'Not found',
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
                conn.query(`SELECT correo, docIdentificacionA, documentoA, nombresA, 
                            apellidosA, telefonoA
                            FROM admin WHERE idAdmin = ?`,
                    [authData.user.idAdmin], (err, rows) => {
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
                                        message: 'Administrador no encontrado'
                                    }
                                })
                            }
                        }
                    })
            })
        }
    })
}

controller.getDocumentos = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tipodocumento', (err, rows) => {
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
                conn.query(`UPDATE admin SET nombresA = ?, apellidosA = ?, telefonoA = ?,
                            docIdentificacionA = ?, documentoA = ?, correo = ? WHERE idAdmin = ?`,
                    [nombres, apellidos, telefono, idDoc, documento, correo, authData.user.idAdmin], (err, rows) => {
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
                                    message: 'Administrador modificado correctamente'
                                }
                            })
                        }
                    })
            })
        }
    })
}

module.exports = controller