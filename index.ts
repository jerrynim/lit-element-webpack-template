import express from "express";

const app = express();

app.get("/ping", (req, res) => {
    res.send("pong");
});
// invoke : curl --request GET http://localhost:4000/ping

app.listen(4000, () => {
    console.log("server started at http://localhost:4000🚀");
});
