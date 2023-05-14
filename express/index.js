let express = require("express");

let app = express();app.listen(3001, () => {
    console.log("Server running on port 3001");
});

app.get("/url", (req, res, next) => {
    res.json(["Angela","Pam","Michael","Dwight","Kevin"]);
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get("/test", (req, res, next) => {
    res.json("backend response")
})