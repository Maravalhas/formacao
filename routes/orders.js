const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const middlewares = require("../utilities/middlewares");

const ordersController = require("../controllers/orders");
const categoriesController = require("../controllers/categories");

router
  .route("/")
  .get(middlewares.GeneralValidations, ordersController.getOrders)
  .post(
    middlewares.GeneralValidations,
    body("numero").notEmpty(),
    body("id_categoria").notEmpty(),
    body("observacoes").optional().isString(),
    body("linhas").notEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(403).json({ message: errors.errors });
      }
      next();
    },
    ordersController.postOrder
  );

router
  .route("/categories")
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

router.route("/categories/:id").put(
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

router
  .route("/:id")
  .get(middlewares.GeneralValidations, ordersController.getOrderById)
  .put(
    middlewares.GeneralValidations,
    body("numero").notEmpty(),
    body("id_categoria").notEmpty(),
    body("observacoes").optional().isString(),
    body("linhas").notEmpty(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(403).json({ message: errors.errors });
      }
      next();
    },
    ordersController.updateOrder
  );

module.exports = router;
