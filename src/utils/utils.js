const utils = {}

utils.SECRET = '6jgMZ!EYhbsn!t3'

utils.verifyToken = (req, res, next) => {
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
        res.json({
            status: 403,
            message: 'Forbidden',
            data: {
                message: 'Acceso denegado, usuario no autorizado'
            }
        })
    }
}

module.exports = utils