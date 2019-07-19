const jwt = require('jsonwebtoken')
const utils = require('../utils/utils')
const SECRET = utils.SECRET
const controller = {}

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
                conn.query(`SELECT idCaso, nombre, DATE_FORMAT(fechaFinalizacion, "%Y-%m-%d %H:%i:%S") as fechaFinalizacion,
                            DATE_FORMAT(fechaInicio, "%Y-%m-%d %H:%i:%S") as fechaInicio, idCliente, descripcion
                            FROM casos WHERE idCaso = ?
                            `, [req.params.idCaso], (err, rows) => {
                        if (err) {
                            res.json({
                                status: 500,
                                message: 'Internal Server Error',
                                data: err
                            })
                        } else {
                            //Carga comentarios y actividades del caso
                            conn.query(`SELECT idActividad, nombreActividad, estado, correo, DATE_FORMAT(fecha, "%Y-%m-%d %H:%i:%S") as fecha
                                        FROM actividades act INNER JOIN admin a
                                        ON act.idAdmin = a.idAdmin
                                        WHERE idCaso = ? ORDER BY idActividad DESC`, [req.params.idCaso], (err, rowsActividades) => {
                                    if (err) {
                                        res.json({
                                            status: 500,
                                            message: 'Internal Server Error',
                                            data: err
                                        })
                                    } else {
                                        conn.query(`SELECT idComentario, act.idAdmin, correo, comentario, DATE_FORMAT(fecha, "%Y-%m-%d %H:%i:%S") as fecha
                                                    FROM comentarioscasos act INNER JOIN admin a
                                                    ON act.idAdmin = a.idAdmin
                                                    WHERE idCaso = ? ORDER BY idComentario DESC`, [req.params.idCaso], (err, rowsComentarios) => {
                                                if (err) {
                                                    res.json({
                                                        status: 500,
                                                        message: 'Internal Server Error',
                                                        data: err
                                                    })
                                                } else {
                                                    const data = {
                                                        caso: rows[0],
                                                        actividades: rowsActividades,
                                                        comentarios: rowsComentarios
                                                    }
                                                    res.json({
                                                        status: 200,
                                                        message: 'OK',
                                                        data
                                                    })
                                                }
                                            })
                                    }
                                })
                        }
                    })
            })
        }
    })
}

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
                conn.query(`SELECT idCaso, nombre, DATE_FORMAT(fechaFinalizacion, "%Y-%m-%d") as fechaFinalizacion,
                            DATE_FORMAT(fechaInicio, "%Y-%m-%d") as fechaInicio, c.nombres, c.apellidos
                            FROM casos INNER JOIN clientes c ON casos.idCliente = c.idCLiente`, (err, rows) => {
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

controller.add = (req, res) => {
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
            const data = req.body
            req.getConnection((err, conn) => {
                conn.query(`INSERT INTO casos SET ? `, [data], (err, rows) => {
                    if (err) {
                        res.json({
                            status: 500,
                            message: 'Internal Server Error',
                            data: err
                        })
                    } else {
                        res.json({
                            status: 201,
                            message: 'Created',
                            data: {
                                message: 'Caso agregado correctamente'
                            }
                        })
                        console.log(rows)
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
            const {
                idCliente,
                nombre,
                descripcion,
                idCaso
            } = req.body
            req.getConnection((err, conn) => {
                conn.query(`UPDATE casos SET idCliente = ?, nombre = ?, descripcion = ? WHERE idCaso = ? `,
                    [idCliente, nombre, descripcion, idCaso], (err, rows) => {
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
                                    message: 'Caso modificado correctamente.'
                                }
                            })
                        }
                    })
            })
        }
    })
}

controller.delete = (req, res) => {
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
            const { idCaso } = req.body
            req.getConnection((err, conn) => {
                conn.query(`DELETE FROM casos WHERE idCaso = ?`, [idCaso], (err, rows) => {
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
                                message: 'Caso eliminado correctamente'
                            }
                        })
                    }
                })
            })
        }
    })
}

controller.finishCase = (req, res) => {
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
            const { idCaso } = req.body
            req.getConnection((err, conn) => {
                conn.query(`UPDATE casos SET fechaFinalizacion = (SELECT NOW()) WHERE idCaso = ?`, [idCaso], (err, rows) => {
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
                                message: 'Caso finalizado correctamente'
                            }
                        })
                    }
                })
            })
        }
    })
}

module.exports = controller