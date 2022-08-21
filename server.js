// const mysql = require("mysql2");
// const consoleTable = require("console.table");
// const inquirer = require("inquirer");
import inquirer from "inquirer";
import mysql from "mysql2";
import consoleTable from "console.table";
import "dotenv/config";

// Connect to database - use dotenv
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect(function () {
  startMenu;
});

// question arrays to clean up code below
const menu = [
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
    name: "options",
  },
];

const empData = [
  {
    type: "input",
    message: "What is the employee's first name?",
    name: "first_name",
  },
  {
    type: "input",
    message: "What is the employee's last name?",
    name: "last_name",
  },
  {
    type: "list",
    message: "What is the employee's role?",
    choices: [
      { name: "Sales Lead", value: 1 },
      { name: "Salesperson", value: 2 },
      { name: "Lead Engineer", value: 3 },
      { name: "Software Engineer", value: 4 },
      { name: "Account Manager", value: 5 },
      { name: "Accountant", value: 6 },
      { name: "Legal Team Lead", value: 7 },
      { name: "Lawyer", value: 8 },
    ],
    name: "role_id",
  },
  {
    type: "input",
    message: "What is the manager's ID number?",
    name: "manager_id",
  },
];

const roleData = [
  {
    type: "input",
    message: "What is the title of this role?",
    name: "title",
  },
  {
    type: "input",
    message: "What is the salary of this role?",
    name: "salary",
    validate: function (salaryInput) {
      if (!salaryInput || isNaN(salaryInput)) {
        console.log("Please enter a valid salary.");
        return false;
      } else {
        return true;
      }
    },
  },
  {
    type: "list",
    message: "What is department is this role a part of?",
    choices: [
      { name: "Sales", value: 1 },
      { name: "Legal", value: 2 },
      { name: "Finance", value: 3 },
      { name: "Engineering", value: 4 },
    ],
    name: "department_id",
  },
];

const deptData = [
  {
    type: "input",
    message: "What is the name of this department?",
    name: "dept_name",
  },
];

// run start menu
function startMenu() {
  inquirer.prompt(menu).then((choice) => {
    console.log(choice);
    if (choice.option === "View All Employees") {
      viewAllEmployees();
    } else if (choice.option === "Add Employee") {
      addEmployee();
    } else if (choice.option === "Update Employee Role") {
      updateEmployee();
    } else if (choice.option === "View All Roles") {
      viewAllRoles();
    } else if (choice.option === "Add Role") {
      addRole();
    } else if (choice.option === "View All Departments") {
      viewAllDepts();
    } else if (choice.option === "Add Department") {
      addDept();
    } else {
      console.log("You are leaving the Employee Tracker! See you next time");
      //return;
      db.end;
    }
  });
}

// query for employees
function viewAllEmployees() {
  console.log("view all employees placeholder");
  // db.query();
}

// add employee
function addEmployee() {
  inquirer.prompt(empData).then((employee) => {
    console.log(
      `You have added a new employee, ${employee.first_name} ${employee.last_name}!`
    );
    // https://www.youtube.com/watch?v=gZugKSoAyoY
    // https://www.sqlservertutorial.net/sql-server-basics/sql-server-insert-multiple-rows/
    db.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
      SET ?`,
      {
        first_name: employee.first_name,
        last_name: employee.last_name,
        role_id: employee.role_id,
        manager_id: employee.manager_id,
      }
    );
    console.log(`\nWould you like to continue with another operation?\n`);
    startMenu();
  });
}

// updatnpm e employee
function updateEmployee() {
  console.log("update Employee placeholder");
}

// https://www.sqlservertutorial.net/sql-server-basics/sql-server-select/
// query for roles
function viewAllRoles() {
  db.query(
    `SELECT job_role.id, job_role.title, job_role.salary, department.dept_name as department
    FROM job_role
    JOIN department ON job_role.department_id = department.id`,
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        consoleTable(result);
        startMenu();
      }
    }
  );
}

// add role
function addRole() {
  inquirer.prompt(roleData).then((role) => {
    console.log(`You have added a new role, ${role.title}.`);
    db.query(
      `INSERT INTO job_role (title, salary, department_id)
      SET ?`,
      {
        title: role.title,
        salary: role.salary,
        department_id: role.department_id,
      }
    );
    console.log(`\nWould you like to continue with another operation?\n`);
    startMenu();
  });
}

// query for departments
function viewAllDepts() {
  db.query("SELECT * FROM department", function (err, result) {
    if (err) {
      console.log(err);
    } else {
      consoleTable(result);
      startMenu();
    }
  });
}

// add department
function addDept() {
  inquirer.prompt(deptData).then((dept) => {
    console.log(`You have added a new Department, ${dept.dept_name}.`);
    db.query(
      `INSERT INTO department (dept_name)
      SET ?`,
      {
        dept_name: dept_name,
      }
    );
    console.log(`\nWould you like to continue with another operation?\n`);
    startMenu();
  });
}

// start the app
startMenu();
