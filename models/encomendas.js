const { Model, DataTypes } = require("sequelize");
const connection = require("../utilities/connection");

const Users = require("./users");
const Categorias = require("./categorias");

class Encomendas extends Model {}

Encomendas.init(
  {
    numero: DataTypes.INTEGER,
    data: DataTypes.DATE,
    observacoes: DataTypes.TEXT,
  },
  { sequelize: connection, modelName: "_formacao_encomendas" }
);

Encomendas.belongsTo(Users, { foreignKey: "user_id" });
Users.hasMany(Encomendas, { foreignKey: "user_id" });

Encomendas.belongsTo(Categorias, { foreignKey: "id_categoria" });
Categorias.hasMany(Encomendas, { foreignKey: "user_id" });

module.exports = Encomendas;
