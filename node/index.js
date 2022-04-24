const express = require("./node_modules/express");
const mysql = require('mysql');
const app = express();
const port = 3000;
let connection = mysql.createConnection({
    host: 'mysql',
    port: '3306',
    user: 'root',
    password: 'psy1234',
    database: 'init_test'
});

function sqlExec(sql) {

    connection.connect();
    let data;
    connection.query(sql, (error, result, fields) => {
        if (error) throw error;
        data = result;
    });
    connection.end();
    return data
}

let insertSql = "INSERT INTO init_test.Users (`id`, `password`, `name`) VALUES ('test1', '1q2w3e', '테스트')";

let result = sqlExec(insertSql);

app.get("/node", (req, res) => res.send(result));


app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);

