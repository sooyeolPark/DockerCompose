const express = require("./node_modules/express");
const app = express();
const port = 3000;

app.get("/node", (req, res) => res.send("This is Node Server"));

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);