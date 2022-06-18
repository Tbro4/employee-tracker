const Department = require("./Department");
const Role = require("./Role");
const Employee = require("./Employee");

Department.hasMany(Role, {
  foreignKey: "department_id",
  onDelete: "CASCADE",
});

Role.hasOne(Employee, {
  foreignKey: "role_id",
});

Employee.hasOne(Employee, {
  as: "parent",
  foreignKey: "manager_id",
  onDelete: "SET NULL",
});

module.exports = { Department, Role, Employee };
