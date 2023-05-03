const { Model, DataTypes } = require("sequelize");
const connection = require("../utilities/connection");

class Categorias extends Model {}

Categorias.init(
  {
    categoria: DataTypes.STRING(100),
  },
  { sequelize: connection, modelName: "_formacao_categorias" }
);

module.exports = Categorias;
