const Categorias = require("../models/categorias");

exports.getCategories = async (req, res) => {
  try {
    Categorias.findAll().then((response) => {
      return res.status(200).json(response);
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    let category;
    let duplicated;

    const VerifyCategory = (callback) => {
      Categorias.findByPk(req.params.id, {
        attributes: ["id"],
        raw: true,
      }).then((response) => {
        category = response;
        return callback();
      });
    };

    const VerifyDuplicated = (callback) => {
      if (category) {
        Categorias.findOne({
          attributes: ["id"],
          where: {
            categoria: req.body.categoria,
          },
          raw: true,
        }).then((response) => {
          if (response) {
            duplicated = true;
          }
          return callback();
        });
      } else {
        return callback();
      }
    };

    async.waterfall([VerifyCategory, VerifyDuplicated], () => {
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }

      if (duplicated) {
        return res.status(406).json({ message: "Duplicated category." });
      }

      Categorias.update(
        {
          categoria: req.body.categoria,
        },
        { where: { id: category.id } }
      ).then(() => {
        return res
          .status(200)
          .json({ message: "Category update successfully." });
      });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Categorias.findOne({
      where: { categoria: req.body.categoria },
    });

    if (category) {
      return res.status(406).json({ message: "Duplicated category." });
    }

    Categorias.create({
      categoria: req.body.categoria,
    }).then(() => {
      return res
        .status(201)
        .json({ message: "Category created successfully." });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
