const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const { restoreDefaultPrompts } = require('inquirer');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'khorne',
  // Your MySQL password
  password: 'password',
  database: 'employee'
});

const mainMenu = [
  {
    type: 'list',
    name: 'whatToDo',
    message: "What would you like to do?",
    choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "exit"]
  }
];
function exit() {
  process.exit();
}

function prompt() {
  inquirer.prompt(mainMenu).then(answers => {
    if (answers.whatToDo === 'exit') {
      exit();
    } else if (answers.whatToDo === "view all departments") {
      db.query(`SELECT name AS Department_Name, id as Department_ID FROM department`, (err, rows) => {
        console.table(rows);
        prompt();
      });

    } else if (answers.whatToDo === "view all roles") {
      db.query(`SELECT title AS Title, roles.id AS Role_ID, department.name AS Department, salary AS Salary FROM roles LEFT JOIN department ON department.id = roles.department_id`, (err, rows) => {
        console.table(rows);
        prompt();
      });
    } else if (answers.whatToDo === "view all employees") {
      db.query(`Select e.id AS ID, e.first_name AS "First Name", e.last_name AS "Last Name",
      roles.title AS "Title", department.name AS "Department", roles.salary AS "Salary",
      CONCAT(m.first_name, ' ', m.last_name) AS Manager
      FROM employee e 
      LEFT JOIN employee m ON m.id = e.manager_id
      LEFT JOIN roles ON roles.id = e.role_id
      LEFT JOIN department on department.id =  roles.department_id;`, (err, rows) => {
        console.table(rows);
        prompt();
      });
      
    } else if (answers.whatToDo === "add a department") {
      inquirer.prompt([
        {
          type: "input",
          name: "deptName",
          message: "Enter Department name"
        }
      ]).then(deptName => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [deptName.deptName], (err, result) => {
          if (err) {
            console.log("Duplicate department entered, returning to main menu");
          } else {
            console.log("Record inserted");
          }
          prompt();
        });
      });

    } else if (answers.whatToDo === "add a role") {
      const deparment_list = [];
      db.query(`SELECT name FROM department`, (err, rows) => {
        rows.forEach(ele => deparment_list.push(ele.name));
      });
      inquirer.prompt([
        {
          type: "input",
          name: "roleName",
          message: "Enter name of role"
        }, {
          type: "input",
          name: "salary",
          message: "Enter a salary",
          validate(salary) {
            if (isNaN(salary)) {
              return "Enter a number";
            } else {
              return true;
            }
          }
        },
        {
          type: "list",
          name: "department",
          message: "Select a department",
          choices: deparment_list
        }
      ]).then(ans => {
        db.query(`SELECT id FROM department WHERE department.name = ?`, [ans.department], (err, result) => {
          var id = result[0].id;
          db.query(`INSERT INTO roles (title,salary,department_id) VALUES (?,?,?)`, [ans.roleName, ans.salary, id], (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Record inserted");
            }
            prompt();

          });
        });


      });
    } else if (answers.whatToDo === "add an employee") {
      const roles = [];
      const managers = [];
      db.query(`SELECT title FROM roles`, (err, result) => {
        result.forEach(ele => {
          roles.push(ele.title);
        });
      });

    } else if (answers.whatToDo === "update an employee role") {
      const employees = [];
      const roles = [];

      db.query(`SELECT first_name,last_name FROM employee`, (err, result) => {
        result.forEach(ele => {
          employees.push(ele.first_name + " " + ele.last_name);
        });
        db.query(`SELECT title FROM roles`, (err, result) => {
          result.forEach(ele => {
            roles.push(ele.title);
          });
          inquirer.prompt([{
            type: "list",
            name: "name",
            message: "Select an employee",
            choices: employees
          },
          {
            type: "list",
            name: "role",
            message: "Select a role ",
            choices: roles
          }]).then(ans => {
            let splitName = ans.name.split(" ");
            let firstName = splitName[0];
            let lastName = splitName[1];
            let role = ans.role;
            db.query(`SELECT id FROM roles WHERE roles.title = ?`, [role], (err, result) => {
              let roleId = result[0].id;
              db.query(`UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`, [roleId, firstName, lastName], (err, results) => {
                if (err) {
                  console.log(err);
                  exit();
                } else {
                  prompt();
                }
              });
            });

          });
        });

      });

    }
  });
}

prompt();
