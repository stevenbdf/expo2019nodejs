const jwt = require('jsonwebtoken')
const utils = require('../utils/utils')
const SECRET = utils.SECRET
const controller = {}

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
                conn.query(`INSERT INTO comentarioscasos SET ? `,
                    [data], (err, rows) => {
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
                                    message: 'Comentario creado correctamente.'
                                }
                            })
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
            const { idAdmin, comentario, idComentario } = req.body
            req.getConnection((err, conn) => {
                conn.query(`UPDATE comentarioscasos SET idAdmin = ?, comentario = ?, fecha = (SELECT NOW())
                            WHERE idComentario = ?`,
                    [idAdmin, comentario, idComentario], (err, rows) => {
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
                                    message: 'Comentario modificado correctamente.'
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
            const { idComentario } = req.params
            req.getConnection((err, conn) => {
                conn.query(`DELETE FROM comentarioscasos WHERE idComentario = ? `,
                    [idComentario], (err, rows) => {
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
                                    message: 'Comentario eliminado correctamente.'
                                }
                            })
                        }
                    })
            })
        }
    })
}

module.exports = controller