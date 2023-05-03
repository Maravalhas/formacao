const jwt = require("jsonwebtoken");
const Users = require("../models/users");

exports.GeneralValidations = async (req, res, next) => {
  try {
    let token = req.headers.authorization
      ? req.headers.authorization.substring(7)
      : null;

    if (!token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Invalid token." });
      }

      Users.findByPk(decoded.user).then((user) => {
        if (user.eliminado === "S" || user.activo === "N") {
          return res.status(401).json({ messsage: "User is not active" });
        } else {
          req.user = decoded.user;
          next();
        }
      });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
