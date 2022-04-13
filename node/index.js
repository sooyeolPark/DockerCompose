const express = require("./node_modules/express");
const mysql = require('mysql');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host     : 'mysql',
    port     : '3306',
    user     : 'root',
    password : 'psy1234',
    database : 'first_test'
});
connection.connect();
let data;
connection.query('SELECT * from Users', (error, rows, fields) => {
    if (error) throw error;
    data = rows;
});

connection.end();
app.get("/node", (req, res) => res.send(data));

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);

