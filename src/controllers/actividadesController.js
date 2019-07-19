const bcrypt = require('bcrypt')
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
                conn.query(`INSERT INTO actividades SET ? `,
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
                                    message: 'Actividad creada correctamente.'
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
            const { idAdmin, nombreActividad, idActividad} = req.body
            req.getConnection((err, conn) => {
                conn.query(`UPDATE actividades SET idAdmin = ?, nombreActividad = ?, fecha = (SELECT NOW())
                            WHERE idActividad = ?`,
                    [idAdmin, nombreActividad, idActividad], (err, rows) => {
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
                                    message: 'Actividad modificada correctamente.'
                                }
                            })
                        }
                    })
            })
        }
    })
}

controller.updateEstado = (req, res) => {
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
            const { idActividad, estado } = req.body
            req.getConnection((err, conn) => {
                conn.query(`UPDATE actividades SET estado = ? WHERE idActividad = ?`,
                    [estado, idActividad], (err, rows) => {
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
                                    message: 'Actividad modificada correctamente.   '
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
            const { idActividad } = req.params
            req.getConnection((err, conn) => {
                conn.query(`DELETE FROM actividades WHERE idActividad = ? `,
                    [idActividad], (err, rows) => {
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
                                    message: 'Actividad eliminada correctamente.'
                                }
                            })
                        }
                    })
            })
        }
    })
}

module.exports = controller