const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const controller = require("../controllers/auth");

router
  .route("/")
  .get(controller.validateToken)
  .post(
    body("email").notEmpty(),
    body("password").notEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(403).json({ message: errors.errors });
      }
      next();
    },
    controller.login
  );

module.exports = router;
