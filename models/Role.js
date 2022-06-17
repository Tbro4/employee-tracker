const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    salary: {
      type: DataTypes.STRING,
    },
    department: {
      type: DataTypes.STRING,
    },
    department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "department",
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "role",
  }
);

module.exports = Role;
