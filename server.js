// const mysql = require("mysql2");
// const consoleTable = require("console.table");
// const inquirer = require("inquirer");
import inquirer from "inquirer";
import mysql from "mysql2";
import "console.table";
import "dotenv/config";

const PORT = process.env.PORT || 3001;

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

const deptData = [
  {
    type: "input",
    message: "What is the name of this department?",
    name: "deptName",
  },
];

// Connect to database - use dotenv
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: PORT,
  },
  startMenu()
);

// intialize connection
// db.connect(function () {
//   console.log(`Connected to the employees_db database.`);
//   startMenu;
// });

// run start menu
function startMenu() {
  inquirer.prompt(menu).then((choice) => {
    console.log(choice);
    if (choice.options === "View All Employees") {
      viewAllEmployees();
    } else if (choice.options === "Add Employee") {
      addEmployee();
    } else if (choice.options === "Update Employee Role") {
      updateEmployee();
    } else if (choice.options === "View All Roles") {
      viewAllRoles();
    } else if (choice.options === "Add Role") {
      addRole();
    } else if (choice.options === "View All Departments") {
      viewAllDepts();
    } else if (choice.options === "Add Department") {
      addDept();
    } else {
      console.log("You are leaving the Employee Tracker! See you next time!");
      //return;
      db.end;
    }
  });
}

// query for employees
function viewAllEmployees() {
  // how to self reference a join for manager names instead of IDs?
  // https://learnsql.com/blog/what-is-self-join-sql/#:~:text=The%20self%20join%2C%20as%20its,the%20values%20in%20Column%20X.
  db.query(
    `SELECT staff.id AS employee_id, CONCAT(staff.first_name,' ',staff.last_name) AS employee_name, job_role.title AS job_title, job_role.salary, department.dept_name AS department_name, CONCAT(manager.first_name,' ', manager.last_name) 
    AS manager_name 
    FROM employee staff 
    INNER JOIN job_role ON job_role.id=staff.role_id 
    INNER JOIN department ON department.id=job_role.department_id 
    LEFT JOIN employee manager ON manager.id=staff.manager_id
    ORDER BY employee_id;`,
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.table(res);
        console.log("\nWould you like to continue with another operation?\n");
        startMenu();
      }
    }
  );

  // console.log("view all employees placeholder");
}

// add employee
function addEmployee() {
  // two selects for dynamic lists
  const roleList = [];
  const roleIds = [];
  db.query("SELECT id, title FROM job_role", function (err, res) {
    if (err) {
      console.log(err);
    }
    for (let i = 0; i < res.length; i++) {
      roleList.push(res[i].title);
      roleIds.push(res[i].id);
    }
  });

  const managerList = ["Is a Manager"];
  const managerIds = [null];
  db.query(
    "SELECT employee.id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employee",
    function (err, res) {
      if (err) {
        console.log(err);
      }
      for (let j = 0; j < res.length; j++) {
        managerList.push(res[j].manager_name);
        managerIds.push(res[j].id);
      }
    }
  );

  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        // create dynamic list of roles like in the add a role function
        choices: roleList,
        name: "role",
      },
      {
        type: "list",
        message: "Who is this employee's manager?",
        choices: managerList,
        name: "manager",
      },
    ])
    .then((employee) => {
      // handle role ID
      let roleID;
      for (let k = 0; k < roleList.length; k++) {
        if (employee.role == roleList[k]) {
          roleID = roleIds[k];
        }
      }

      // handle manager name to ID
      let managerID;
      for (let j = 0; j < managerList.length; j++) {
        if (employee.manager == managerList[j]) {
          managerID = managerIds[j];
        }
      }

      //console.log([employee.firstName, employee.lastName, roleID, managerID]);

      // https://www.youtube.com/watch?v=gZugKSoAyoY
      // https://www.mysqltutorial.org/mysql-nodejs/insert/
      db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        // use array not obj for values - change the role and manager parts
        [employee.firstName, employee.lastName, roleID, managerID],
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log(
              `\nYou have added a new employee, ${employee.firstName} ${employee.lastName}! \nWould you like to continue with another operation?\n`
            );
            startMenu();
          }
        }
      );
    });
}

// update employee
function updateEmployee() {
  // get employee list & role list for update
  let employeeList = [];
  db.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS emp_name FROM employee",
    function (err, res) {
      if (err) {
        console.log(err);
      }
      //console.log([res]);
      for (let i = 0; i < res.length; i++) {
        employeeList.push(res[i].emp_name);
        //console.log(res[i].employees);
      }
      console.log("this is the list:", employeeList);
    }
  );

  const roleUpdList = [];
  const updateIds = [];
  db.query("SELECT id, title FROM job_role", function (err, res) {
    if (err) {
      console.log(err);
    }
    for (let j = 0; j < res.length; j++) {
      roleUpdList.push(res[j].title);
      updateIds.push(res[j].id);
    }
  });

  inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee would you like to update?",
        choices: employeeList,
        name: "empUpdate",
      },
      {
        type: "list",
        message: "What is the employee's updated role?",
        choices: roleUpdList,
        name: "roleUpdate",
      },
    ])
    .then((update) => {
      // handle updated role ID
      let roleIDUpd;
      for (let k = 0; k < roleUpdList.length; k++) {
        if (update.roleUpdate == roleUpdList[k]) {
          roleIDUpd = roleIds[k];
        }
      }

      console.log([update.empUpdate, roleIDUpd]);

      // query for update https://www.w3schools.com/mysql/mysql_update.asp
      console.log(`\nWould you like to continue with another operation?\n`);
      startMenu();
    });

  //console.log("update Employee placeholder");
}

// https://www.sqlservertutorial.net/sql-server-basics/sql-server-select/
// query for roles
function viewAllRoles() {
  db.query(
    // add department id info
    `SELECT job_role.id, job_role.title, job_role.salary, department.dept_name as department
    FROM job_role
    JOIN department ON job_role.department_id = department.id`,
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.table(res);
        console.log("\nWould you like to continue with another operation?\n");
        startMenu();
      }
    }
  );
}

// add role
function addRole() {
  // wrap query around questions for dynamic list of department names, so created depts get called in
  db.query("SELECT * FROM department", function (err, res) {
    if (err) {
      console.log(err);
    }

    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the title of this role?",
          name: "roleTitle",
        },
        {
          type: "input",
          message: "What is the salary of this role?",
          name: "roleSalary",
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
          // needs to be nested in the query instead of outside of it
          choices: function () {
            let deptList = [];
            for (let i = 0; i < res.length; i++) {
              deptList.push(res[i].dept_name);
            }
            return deptList;
          },
          name: "department",
        },
      ])
      .then((role) => {
        // handle dept id issue
        let deptID;
        // loop through the dept_names and compare to job_role id
        for (let j = 0; j < res.length; j++) {
          if (res[j].dept_name == role.department) {
            deptID = res[j].id;
          }
        }

        db.query(
          "INSERT INTO job_role (title, salary, department_id) VALUES (?, ?, ?)",
          // call the ID as the deptID above, not the role department choice
          [role.roleTitle, role.roleSalary, deptID],
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log(
                `\nYou have added the new ${role.roleTitle} role! \nWould you like to continue with another operation?\n`
              );
              startMenu();
            }
          }
        );
      });
  });
}

// query for departments
function viewAllDepts() {
  db.query("SELECT * FROM department", function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
      console.log("\nWould you like to continue with another operation?\n");
      startMenu();
    }
  });
}

// add department
function addDept() {
  inquirer.prompt(deptData).then((dept) => {
    db.query(
      "INSERT INTO department (dept_name) VALUES (?)",
      [dept.deptName],
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(
            `\nYou have added the new ${dept.deptName} Department!\nWould you like to continue with another operations?\n`
          );
          startMenu();
        }
      }
    );
  });
}

// start the app
//startMenu();
