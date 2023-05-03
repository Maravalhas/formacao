const { Model, DataTypes } = require("sequelize");
const connection = require("../utilities/connection");

class Users extends Model {}

Users.init(
  {
    nome_user: DataTypes.STRING,
    primeiro_nome: DataTypes.STRING,
    ultimo_nome: DataTypes.STRING,
    email: DataTypes.STRING,
    eliminado: DataTypes.STRING(1),
    activo: DataTypes.STRING(1),
  },
  { sequelize: connection, modelName: "users" }
);

module.exports = Users;
