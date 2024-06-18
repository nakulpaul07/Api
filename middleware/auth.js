const jwt = require('jsonwebtoken');
const UserModel = require('../model/user')


const checkUserAuth = async (req, res, next) => {
    // console.log("Middelware")
    const { token } = req.cookies;
    // console.log(token);
    if (!token) {
        res.status(401).json({ status: "failed", message: "UnauthorizLogined " })
    } else {
        const data = jwt.verify(token, "nakulpalqpeisf124kskffl")
        const userdata = await UserModel.findOne({ _id: data.ID });
        // console.log(userdata)
        // console.log(data)
        req.userdata = userdata;

        next()
    }
};


module.exports = checkUserAuth