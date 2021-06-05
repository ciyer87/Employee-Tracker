const mysql = require('mysql2')
const inquirer = require('inquirer');
const db = require('./db');
require('console.table');


// Start app with npm run
const startApp = () => {

    // Main menu questions
    const mainQuestions = () => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'What would you like to do?',
                choices: [
                    'Finished',
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update an Employee Role'
                ],
            }

        ])
            .then(answers => {
                if (answers.menu === 'View All Departments') {
                    displayDepartments();
                }
                if (answers.menu === 'View All Roles') {
                    displayRoles();
                }
                if (answers.menu === 'View All Employees') {
                    displayEmployees();
                }
                if (answers.menu === 'Add a Department') {
                    addDepartment();
                }
                if (answers.menu === 'Add a Role') {
                    addRole();
                }
                if (answers.menu === 'Add an Employee') {
                    addEmployee();
                }
                if (answers.menu === 'Update an Employee Role') {
                    updateRole();
                }
                if (answers.menu === 'Finished') {
                    console.log('Goodbye!')
                    return false;
                }

            })
    };

    displayDepartments = async () => {
        const departments = await db.viewAllDepartments();
        console.table(departments);
        //const sql = `SELECT department.id, department_name from department`;
        // db.query(sql, (err, res) => {
        //     if(err) throw err;
        //     console.log('\n Displaying all department   \n')
        //     console.table(res);
             mainQuestions();
        // });
    }

    displayRoles = async () => {
        const roles = await db.viewAllRoles();
        console.table(roles);
    //     const sql = `SELECT employee_role.id, title, department.department_name, salary FROM employee_role INNER JOIN department ON employee_role.department_id = department.id;`;
    //     db.query(sql, (err, res) => {
    //         if(err) throw err;
    //         console.log('\n Displaying all roles   \n')
    //         console.table(res);
        mainQuestions();
    //     });
     }



    displayEmployees = () => {

    }

    addDepartment = async () => {

        const department = await inquirer.prompt ([
            {
                type: 'input',
                name: 'department_name',
                message: 'What is the name of the new Department?',
                validate: answerInput => {
                    if (answerInput) {
                        return true;
                    } else {
                        console.log('Please enter the new Department name!');
                        return false;
                    }
                }
            }
            

        ])

        await db.addNewDepartment(department);
        mainQuestions();

        // return inquirer.prompt ([


        //     {


        //         type: 'input',
        //         name: 'department_name',
        //         message: 'What is the name of the new Department?',
        //         validate: answerInput => {
        //             if (answerInput) {
        //                 return true;
        //             } else {
        //                 console.log('Please enter the new Department name!');
        //                 return false;
        //             }
        //         }
        //     }
        // ])
        //     .then(answers => {
        //         console.log(answers);
                
        //         await db.addNewDepartment(answers);
        //         mainQuestions();
        //     })

    };


    async function addRole() {
            const departments = await db.viewAllDepartments();
            const departmentChoices = departments.map(({ id, department_name }) => ({
                name: department_name,
                value: id
            }));
            const role = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'what is the salary of the title?'
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'To which department does the role belong?',
                    choices: departmentChoices
                }
            ]);
            await db.addNewRole(role);
            console.log(`Added ${role.title} to the database`);
            mainQuestions();
        }
    
    mainQuestions();
};

// Initiate main menu
console.log("WELCOME TO EMPLOYEE TRACKER!");
startApp();

