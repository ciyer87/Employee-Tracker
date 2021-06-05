const connection = require('./connection');

class DB {
    constructor (connection) {
        this.connection = connection;
    }

    viewAllDepartments () {
        return this.connection.query(
            `
            SELECT
                department.id, 
                department_name 
            FROM 
                department;
                `
            
        )
    }

    viewAllRoles () {
        return this.connection.query(
            `
            SELECT 
                employee_role.id, 
                employee_role.title, 
                employee_role.salary,
                department.department_name AS department
            FROM 
                employee_role 
            LEFT JOIN 
                department ON employee_role.department_id = department.id
            ORDER BY
                employee_role.id;
            `
        )
    }

    viewAllEmployees() {

        return this.connection.query (
            `
            SELECT 
                employee.id, 
                employee.first_name AS "First Name", 
                employee.last_name AS "Last Name", 
                employee_role.title AS "Job Title", 
                department.department_name AS department, 
                employee_role.salary AS Salary,
                CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
            FROM 
                employee 
            LEFT JOIN 
                employee_role ON employee.role_id = employee_role.id 
            LEFT JOIN 
                department ON employee_role.department_id = department.id
            LEFT JOIN 
                employee manager ON manager.id = employee.manager_id;
            
            `
        )

        
    }

    viewAllManagers() {
        return this.connection.query (
            `
            SELECT 
                employee.id AS value, 
                CONCAT(employee.first_name, ' ', employee.last_name) AS Manager
            FROM 
                employee;
            `
        )
    }

    addNewDepartment(department) {
        return this.connection.query (
            `
            INSERT INTO
                department
            SET
                ?
            `, department
        )
    }


    addNewRole(role) {
        return this.connection.query (
            `
            INSERT INTO
                employee_role
            SET
                ?
            `, role
        )
    }

    addNewEmployee(employee) {
        return this.connection.query (
            `
            INSERT INTO
                employee 
            SET
                ?
            `, employee
        )
    }

}

module.exports = new DB(connection)