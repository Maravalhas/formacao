const Users = require("../models/users");

const { authenticate } = require("ldap-authentication");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    authenticate({
      ldapOpts: {
        url: process.env.LDAP,
      },
      userDn: req.body.email,
      userPassword: req.body.password,
    }).then(() => {
      Users.findOne({ where: { email: req.body.email }, raw: true }).then(
        (user) => {
          if (!user) {
            return res.status(404).json({ message: "User not found." });
          }

          const token = jwt.sign({ user: user.id }, process.env.SECRET, {
            expiresIn: "1d",
          });

          return res.status(200).json({ token });
        }
      );
    });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

exports.validateToken = async (req, res) => {
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
        return res.status(200).json(user);
      });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
