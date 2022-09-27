const jwt = require('jsonwebtoken');
const JWT_TOKEN = "Sunil"

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Autheticate with valid Credentails"});
    }
    try {
        const data = jwt.verify(token, JWT_TOKEN);
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).send({ error: "Auth with valid Credentails" });
    }

}



module.exports = fetchuser;