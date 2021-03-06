const inquirer = require("inquirer");
const Sequelize = require("sequelize");

require("console.table");
const { Employee, Role, Department } = require("./models");
// const seedData = require("./seeds/seed");

let depChoices = async () => {
  const departmentChoices = await Department.findAll({
    attributes: ["id", "dep_name"],
    raw: true,
  });
  //this becomes the array that is returned for the list of department choices
  let choices = [];
  departmentChoices.forEach((choice) => {
    choices.push(choice.dep_name);
  });
  return choices;
};

let roleChoices = async () => {
  const roleFinder = await Role.findAll({
    attributes: ["id", "title"],
    raw: true,
  });
  let choices = [];
  roleFinder.forEach((choice) => {
    choices.push(choice.title);
  });
  return choices;
};

let managerChoices = async () => {
  const manChoices = await Employee.findAll({
    attributes: ["id", "first_name", "last_name"],
    raw: true,
  });
  let choices = ["none"];
  manChoices.forEach((choice) => {
    choices.push(`${choice.first_name} ${choice.last_name}`);
  });
  return choices;
};

let addEmployees = async () => {
  inquirer.prompt(addEmployee).then(async (data) => {
    let roleChoice = data.role;

    //we need to split the names apart
    let managerChoice = data.manager;

    let manChoiceSplit = managerChoice.split(" ");
    //firstName is a string value of first name
    let firstName = manChoiceSplit[0];

    let finder = await Role.findOne({
      where: {
        title: roleChoice,
      },
      raw: true,
    });

    let manFinder = await Employee.findOne({
      where: {
        first_name: firstName,
      },
      raw: true,
    });
    if (firstName === "none") {
      const employee = await Employee.create({
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        role_id: finder.id,
        manager: null,
        manager_id: null,
      });
    } else {
      const employee = await Employee.create({
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        role_id: finder.id,
        manager: data.manager,
        manager_id: manFinder.id,
      });
    }
    init();
  });
};
let addRoles = async () => {
  //prompt for answers
  inquirer.prompt(addRole).then(async (data) => {
    //set department choice to variable to use in FindOne query
    let depChoice = data.department;
    //we can use finder.(column name) to grab to value we need. --finder.id
    let finder = await Department.findOne({
      where: {
        dep_name: depChoice,
      },
      raw: true,
    });
    //create the new role
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

let updateRoles = async () => {
  inquirer.prompt(updateRole).then(async (data) => {
    //first&last name
    let employee = data.name;
    let employeeSplit = employee.split(" ");
    let firstName = employeeSplit[0];
    let lastName = employeeSplit[1];
    let roleTitle = data.role;

    let roleFinder = await Role.findOne({
      where: {
        title: roleTitle,
      },
      raw: true,
    });

    let finder = await Employee.findOne({
      where: {
        first_name: firstName,
        last_name: lastName,
      },
      raw: true,
    });

    await Employee.update(
      {
        role: roleTitle,
        role_id: roleFinder.id,
      },
      {
        where: { id: finder.id },
      }
    );
    init();
  });
};

let deleteEmployee = async () => {
  inquirer.prompt(deleteEmpQs).then(async (data) => {
    let employee = data.name;
    let employeeSplit = employee.split(" ");
    let firstName = employeeSplit[0];
    let lastName = employeeSplit[1];

    await Employee.destroy({
      where: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    await Employee.update(
      {
        manager: null,
      },
      {
        where: { manager: employee },
      }
    );

    init();
  });
};

let deleteDepartment = async () => {
  inquirer.prompt(deleteDepQs).then(async (data) => {
    let department = data.name;

    await Department.destroy({
      where: {
        dep_name: department,
      },
    });

    init();
  });
};
let deleteRole = async () => {
  inquirer.prompt(deleteRoleQs).then(async (data) => {
    let role = data.name;

    await Role.destroy({
      where: {
        title: role,
      },
    });

    init();
  });
};

const seeBudgets = async () => {
  let resp = await Role.findAll({
    attributes: [
      "department",
      [Sequelize.fn("sum", Sequelize.col("salary")), "total_amount"],
    ],
    group: ["Role.department"],
    raw: true,
  });

  return resp;
};

let viewDepEmps = async () => {
  inquirer.prompt(viewDepEmpQ).then(async (data) => {
    let department = data.name;

    const sorted = await Role.findAll({
      where: {
        department: department,
      },
      raw: true,
    });
    let titleArr = [];
    sorted.forEach((title) => {
      titleArr.push(title.title);
    });

    const emps = await Employee.findAll({
      where: {
        role: titleArr,
      },
      raw: true,
    });
    console.table(emps);
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
    updateRoles();
  }
  if (data.toDo === "Delete employee") {
    deleteEmployee();
  }
  if (data.toDo === "Delete department") {
    deleteDepartment();
  }
  if (data.toDo === "Delete role") {
    deleteRole();
  }
  if (data.toDo === "See department utilized budgets") {
    const employees = await seeBudgets();
    console.table(employees);
    init();
  }
  if (data.toDo === "View employees by department") {
    viewDepEmps();
  }
  if (data.toDo === "Exit") {
    console.log("Goodbye");
    process.exit(0);
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
      "Delete employee",
      "Delete department",
      "Delete role",
      "See department utilized budgets",
      "View employees by department",
      "Exit",
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
    name: "role",
    message: "What is the Employee's role?",
    type: "list",
    choices: roleChoices,
  },
  {
    name: "manager",
    message: "Who is the employee's manager?",
    type: "list",
    choices: managerChoices,
  },
];

const updateRole = [
  //were using 'managerChoices' because its already setup to return all emoloyee first/last names
  {
    name: "name",
    message: "Which employee's role do you want to update?",
    type: "list",
    choices: managerChoices,
  },
  {
    name: "role",
    message: "Which role do you want to assign the selected employee?",
    type: "list",
    choices: roleChoices,
  },
];

const deleteEmpQs = [
  {
    name: "name",
    message: "Which employee would you like to delete?",
    type: "list",
    choices: managerChoices,
  },
];

const deleteDepQs = [
  {
    name: "name",
    message: "Which department would you like to delete?",
    type: "list",
    choices: depChoices,
  },
];
const deleteRoleQs = [
  {
    name: "name",
    message: "Which role would you like to delete?",
    type: "list",
    choices: roleChoices,
  },
];

const viewDepEmpQ = [
  {
    name: "name",
    message: "Which department's employees would you like to see?",
    type: "list",
    choices: depChoices,
  },
];

function init() {
  inquirer.prompt(openingQs).then((data) => {
    viewOrAdd(data);
  });
}

init();
