const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const middlewares = require("../utilities/middlewares");

const categoriesController = require("../controllers/categories");

router
  .route("/")
  .get(middlewares.GeneralValidations, categoriesController.getCategories)
  .post(
    middlewares.GeneralValidations,
    body("categoria").notEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(403).json({ message: errors.errors });
      }
      next();
    },
    categoriesController.createCategory
  );

router.route("/:id").put(
  middlewares.GeneralValidations,
  body("categoria").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ message: errors.errors });
    }
    next();
  },
  categoriesController.updateCategory
);

module.exports = router;
