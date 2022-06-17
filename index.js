const inquirer = require("inquirer");
require("console.table");
const { Employee, Role, Department } = require("./models");
// const seedData = require("./seeds/seed");

let roleChoices = [1, 2, "3"];

let managerChoices = [1, 2, "3"];

let employees = [];

let depChoices = async () => {
  const departmentChoices = await Department.findAll({
    attributes: ["id", "dep_name"],
    raw: true,
  });
  let choices = [];
  departmentChoices.forEach((choice) => {
    choices.push(choice.dep_name);
  });

  return choices;

  // return departmentChoices;
  // process.exit(0);
};

let addEmployees = async () => {
  inquirer.prompt(addEmployee).then(async (data) => {
    const employee = await Employee.create({
      first_name: data.first_name,
      last_name: data.last_name,
      role_id: data.role_id,
      manager_id: data.manager_id,
    });
    init();
  });
};
let addRoles = async () => {
  //prompt for answers
  inquirer.prompt(addRole).then(async (data) => {
    //set department answer to variable to use in FindOne query
    let depChoice = data.department;
    //we can use finder.(column name) to grab to value we need. --finder.id
    let finder = await Department.findOne({
      where: {
        dep_name: depChoice,
      },
      raw: true,
    });

    const role = await Role.create({
      title: data.title,
      salary: data.salary,
      department: data.department,
      department_id: finder.id,
    });
    init();
  });
};

let addDepartments = async () => {
  inquirer.prompt(addDepartment).then(async (data) => {
    const department = await Department.create({
      dep_name: data.dep_name,
    });
    init();
  });
};

const viewOrAdd = async (data) => {
  if (data.toDo === "View all employees") {
    const employees = await Employee.findAll({ raw: true });
    console.table(employees);
    init();
  }
  if (data.toDo === "View all roles") {
    const roles = await Role.findAll({ raw: true });
    console.table(roles);
    init();
  }
  if (data.toDo === "View all departments") {
    const departments = await Department.findAll({ raw: true });
    console.table(departments);
    init();
  }
  if (data.toDo === "Add employee") {
    addEmployees();
  }
  if (data.toDo === "Add role") {
    addRoles();
  }
  if (data.toDo === "Add department") {
    addDepartments();
  }
  if (data.toDo === "Update employee role") {
  }
};

const openingQs = [
  {
    name: "toDo",
    message: "What would you like to do?",
    type: "list",
    choices: [
      "View all employees",
      "View all roles",
      "View all departments",
      "Add employee",
      "Add role",
      "Add department",
      "Update employee role",
    ],
  },
];

const addDepartment = [
  {
    name: "dep_name",
    message: "What is the name of the department?",
    type: "input",
  },
];

const addRole = [
  {
    name: "title",
    message: "What is the name of the role?",
    type: "input",
  },
  {
    name: "salary",
    message: "What is the salary of the role?",
    type: "input",
  },
  {
    name: "department",
    message: "What department does the role belong to?",
    type: "list",
    choices: depChoices,
  },
];

const addEmployee = [
  {
    name: "first_name",
    message: "What is the employee's first name?",
    type: "input",
  },
  {
    name: "last_name",
    message: "What is the employee's last name?",
    type: "input",
  },
  {
    name: "role_id",
    message: "What is the Employee's role?",
    type: "list",
    choices: roleChoices,
  },
  {
    name: "manager_id",
    message: "Who is the employee's manager?",
    type: "list",
    choices: managerChoices,
  },
];

const updateRole = [
  {
    name: "empName",
    message: "Which employee's role do you want to update?",
    type: "list",
    choices: employees,
  },
  {
    name: "newRole",
    message: "Which role do you want to assign the selected employee?",
    type: "list",
    choices: roleChoices,
  },
];

function init() {
  inquirer.prompt(openingQs).then((data) => {
    viewOrAdd(data);
  });
}

init();
