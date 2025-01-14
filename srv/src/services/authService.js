

const jwt = require ('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const accessToken = token || req.cookies.accessToken;

    // Se non c'è un token, ritorna errore 401
    if (!accessToken) {
        return res.status(401).send("Permission denied");
    }

    // Verifica il token con JWT
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);  // Se il token non è valido, ritorna errore 403
        }

        req.user = user;  // Se il token è valido, memorizza l'utente nella richiesta
        next();  // Passa al prossimo middleware
    });
}


function generateAccessToken(jwtUser) {
    try{
        return jwt.sign(jwtUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    } catch (e) {
        console.log(e)
    }
};

module.exports = {
    authenticateToken,
    generateAccessToken
};
