const util = require('util');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    // Your username
    user: 'root',
    // Your password
    password: 'sairam2021',
    database: 'employee_db'
});
connection.connect();
// Setting up connection.query to use promises instead of callbacks
// This allows us to use the async/await syntax
connection.query = util.promisify(connection.query);
module.exports = connection;