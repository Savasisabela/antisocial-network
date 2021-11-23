const express = require("express");
const app = express();
const db = require("./db.js");
const { hash, compare } = require("./bc.js");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const secret = require("./secrets.json").secret;
const { requireNotLoggedIn } = require("./middleware/authorization.js");

app.use(compression());

app.use(
    cookieSession({
        secret: secret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.post("/registration.json", requireNotLoggedIn, (req, res) => {
    const { password, first, last, email } = req.body;
    console.log("req.body", req.body);
    hash(password)
        .then((hashedPw) => {
            db.addUser(first, last, email, hashedPw)
                .then((data) => {
                    console.log("data after addUser:", data);
                    req.session.userId = data.rows[0].id; // creating cookie from users table id row
                    return res.json({ success: true });
                })
                .catch((err) => {
                    console.log("err on addUser in registration:", err);
                    return res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("err in registration password hash", err);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
