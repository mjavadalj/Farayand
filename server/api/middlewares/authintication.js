
module.exports.isAdmin = (req, res, next) => {
    //TODO: check valid ID
    if (req.user.role === "admin") {
        next();
    }
    else {
        return res.status(400).json({
            message: "not admin , you're not allowed"
        })
    }
}


module.exports.isTeacher = (req, res, next) => {

    if (req.user.role === "teacher") {
        next();
    }
    else {
        return res.status(400).json({
            message: "not teacher , you're not allowed"
        })
    }
}
module.exports.isSuperTeacher = (req, res, next) => {

    if (req.user.role === "superTeacher") {
        next();
    }
    else {
        return res.status(400).json({
            message: "not superTeacher , you're not allowed"
        })
    }
}