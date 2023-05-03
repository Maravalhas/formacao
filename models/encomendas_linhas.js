const { Model, DataTypes } = require("sequelize");
const connection = require("../utilities/connection");

const Encomendas = require("./encomendas");

class EncomendasLinhas extends Model {}

EncomendasLinhas.init(
  {
    artigo: DataTypes.STRING(100),
    preco: DataTypes.FLOAT,
  },
  { sequelize: connection, modelName: "_formacao_encomendas_linhas" }
);

EncomendasLinhas.belongsTo(Encomendas, {
  foreignKey: "id_encomenda",
  as: "linhas",
});
Encomendas.hasMany(EncomendasLinhas, {
  foreignKey: "id_encomenda",
  as: "linhas",
});

module.exports = EncomendasLinhas;
