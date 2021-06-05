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



    displayEmployees = async() => {
        const employees = await db.viewAllEmployees();
        console.table(employees);
        mainQuestions();

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
    
    

    async function addEmployee() {
        const roles = await db.viewAllRoles();
        const managers = await db.viewAllManagers(); 
        const managerChoices = managers.map(({ id, Manager }) => ({
            name: Manager,
            value: id
        }));
        console.log(managerChoices);
        const roleChoices = roles.map(({ id, title }) => ({         
                name: title,
                value: id             
        }));
        const employee = await inquirer.prompt([

            {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of the new Employee?',
                validate: answerInput => {
                    if (answerInput) {
                        return true;
                    } else {
                        console.log('Please enter the new Employee\'s first name!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of the new Employee?',
                validate: answerInput => {
                    if (answerInput) {
                        return true;
                    } else {
                        console.log('Please enter the new Employee\'s last name!');
                        return false;
                    }
                }
            },  
            {
                type: 'list',
                name: 'role_id',
                message: 'What is the role assigned to the new Employee?',
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Who is the manager assigned to the new Employee?',
                choices: managerChoices
            }
        
        ])
    const params = [
            employee.first_name,
            employee.last_name,
            employee.role_id,
            employee.manager_id,
        ];
    console.log(params);    
    await db.addNewEmployee(employee);
    
    mainQuestions();
    }


    async function updateRole() {
        const employees = await db.viewAllEmployee();
        const roles = await db.viewAllRoles();
        const roleChoices = roles.map(({ id, title}) => ({         
            name: title,
            value: id             
        }));
        console.log(roleChoices);
        
        const employeeChoices = employees.map(({ id, employee_name }) => ({         
                name: employee_name,
                value: id             
        }));
        console.log(employeeChoices);
        const employee_update = await inquirer.prompt([

            {
                type: 'list',
                name: 'id',
                message: 'Select an Employee to modify Role?',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'employee_role_id',
                message: 'What is the new Role assigned to the Employee?',
                choices: roleChoices,
            },
        
        ])

    console.log(employee_update);    
    console.log(`Added ${employee_update.id} and ${employee_update.employee_role_id}  to the database`);
    await db.updateNewRole(employee_update);
    
    
    mainQuestions();
    }
    mainQuestions();
};


// Initiate main menu
console.log("WELCOME TO EMPLOYEE TRACKER!");
startApp();

