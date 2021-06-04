const mysql = require('mysql2')
const inquirer = require('inquirer');
const cTable = require('console.table');

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'sairam2021',
        database: 'employee_db'
    },
    console.log('Connected to the employee database.')
)