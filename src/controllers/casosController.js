const controller = {}

controller.read = (req, res) => {
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

controller.add = (req, res) => {
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
                    data: rows
                })
            }
        })
    })
}

controller.update = (req, res) => {
    const { idCliente, nombre, descripcion, idCaso } = req.body
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
                        data: rows
                    })
                }
            })
    })
}

controller.delete = (req, res) => {
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
                    data: rows
                })
            }
        })
    })
}

module.exports = controller