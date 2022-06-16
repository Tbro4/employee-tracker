const inquirer = require("inquirer");

let departmentChoices = [];

let roleChoices = [];

let managerChoices = [];

let employees = [];

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
    name: "depName",
    message: "What is the name of the department?",
    type: "input",
  },
];

const addRole = [
  {
    name: "roleName",
    message: "What is the name of the role?",
    type: "input",
  },
  {
    name: "salary",
    message: "What is the salary of the role?",
    type: "input",
  },
  {
    name: "roleDep",
    message: "What department does the role belong to?",
    type: "list",
    choices: departmentChoices,
  },
];

const addEmployee = [
  {
    name: "empFirst",
    message: "What is the employee's first name?",
    type: "input",
  },
  {
    name: "empLast",
    message: "What is the employee's last name?",
    type: "input",
  },
  {
    name: "empRole",
    message: "What is the Employee's role?",
    type: "list",
    choices: roleChoices,
  },
  {
    name: "empManager",
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
  inquirer.prompt(addEmployee);
}

init();
