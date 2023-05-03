const Encomendas = require("../models/encomendas");
const EncomendasLinhas = require("../models/encomendas_linhas");
const Categorias = require("../models/categorias");
const Users = require("../models/users");

const moment = require("moment");
const sequelize = require("sequelize");
const async = require("async");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Encomendas.findAll({
      offset: req.query.offset || 0,
      limit: req.query.limit || 0,
    });

    let total;

    if (req.query.offset && req.query.limit) {
      total = await Encomendas.findAll({ attributes: ["id"], raw: true });
    }

    return res.status(200).json(total ? { orders, total } : orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Encomendas.findByPk(req.params.id, {
      attributes: [
        "id",
        "id_categoria",
        "numero",
        "data",
        "observacoes",
        "user_id",
        [
          sequelize.fn(
            "CONCAT",
            sequelize.col("user.primeiro_nome"),
            " ",
            sequelize.col("user.ultimo_nome")
          ),
          "user_nome_completo",
        ],
      ],
      include: [
        {
          model: EncomendasLinhas,
          as: "linhas",
          attributes: ["id", "artigo", "preco"],
        },
        {
          model: Users,
          attributes: [],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.postOrder = async (req, res) => {
  try {
    let category;
    let error;
    let duplicated;

    const VerifyCategory = (callback) => {
      Categorias.findByPk(req.body.id_categoria, {
        attributes: ["id"],
        raw: true,
      }).then((response) => {
        category = response;
        return callback();
      });
    };

    const VerifyDuplicate = (callback) => {
      Encomendas.findOne({ where: { numero: req.body.numero } }).then(
        (response) => {
          if (response) {
            duplicated = true;
          }
          return callback();
        }
      );
    };

    const VerifyLines = (callback) => {
      if (category && !duplicated) {
        req.body.linhas.every((line, index) => {
          if (!line.artigo) {
            error = `No article specified at line ${index + 1}.`;
            return false;
          }
          if (!line.preco) {
            error = `No price specified at line ${index + 1}.`;
            return false;
          }
          return true;
        });
        return callback();
      } else {
        return callback();
      }
    };

    async.waterfall([VerifyCategory, VerifyDuplicate, VerifyLines], () => {
      if (!category) {
        return res.status(404).json({ message: "Invalid category." });
      }

      if (error) {
        return res.status(404).json({ message: error });
      }

      if (duplicated) {
        return res.status(406).json({ message: "Duplicated order number" });
      }

      Encomendas.create({
        numero: req.body.numero,
        data: moment().format("YYYY-MM-DD HH:mm:ss"),
        observacoes: req.body.observacoes,
        user_id: req.user,
        id_categoria: req.body.id_categoria,
      }).then((created) => {
        let toCreate = [];
        req.body.linhas.forEach((line) => {
          toCreate.push({
            id_encomenda: created.id,
            artigo: line.artigo,
            preco: line.preco,
          });
        });
        EncomendasLinhas.bulkCreate(toCreate).then(() => {
          return res
            .status(201)
            .json({ message: "Order created successfully." });
        });
      });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    let category;
    let duplicated;
    let error;

    const order = await Encomendas.findByPk(req.params.id, {
      attributes: ["id"],
      raw: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const VerifyCategory = (callback) => {
      Categorias.findByPk(req.body.id_categoria, {
        attributes: ["id"],
        raw: true,
      }).then((response) => {
        category = response;
        return callback();
      });
    };

    const VerifyDuplicate = (callback) => {
      Encomendas.findOne({ where: { numero: req.body.numero } }).then(
        (response) => {
          if (response) {
            duplicated = true;
          }
          return callback();
        }
      );
    };

    const VerifyLines = (callback) => {
      if (category && !duplicated) {
        req.body.linhas.every((line, index) => {
          if (!line.artigo) {
            error = `No article specified at line ${index + 1}.`;
            return false;
          }
          if (!line.preco) {
            error = `No price specified at line ${index + 1}.`;
            return false;
          }
          return true;
        });
        return callback();
      } else {
        return callback();
      }
    };

    async.waterfall([VerifyCategory, VerifyDuplicate, VerifyLines], () => {
      if (!category) {
        return res.status(404).json({ message: "Invalid category." });
      }

      if (error) {
        return res.status(404).json({ message: error });
      }

      if (duplicated) {
        return res.status(406).json({ message: "Duplicated order number" });
      }

      Encomendas.update({
        data: moment().format("YYYY-MM-DD HH:mm:ss"),
        observacoes: req.body.observacoes,
        id_categoria: req.body.id_categoria,
      }).then(() => {
        EncomendasLinhas.destroy({ where: { id_encomenda: order.id } }).then(
          () => {
            let toCreate = [];
            req.body.linhas.forEach((line) => {
              toCreate.push({
                id_encomenda: order.id,
                artigo: line.artigo,
                preco: line.preco,
              });
            });
            EncomendasLinhas.bulkCreate(toCreate).then(() => {
              return res
                .status(200)
                .json({ message: "Order updated successfully." });
            });
          }
        );
      });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
