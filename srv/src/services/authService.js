

const jwt = require ('jsonwebtoken');

function authenticateToken(req, res, next) {
console.log("auth middleware is here")

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const accessToken = token || req.cookies.accessToken;

    if (!accessToken) return res.status(401).send("Permission denied");

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

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
