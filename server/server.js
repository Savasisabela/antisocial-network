const express = require("express");
const app = express();
const db = require("./db.js");
const { hash, compare } = require("./bc.js");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const secret = require("./secrets.json").secret;
const { requireNotLoggedIn } = require("./middleware/authorization.js");
const cryptoRandomString = require("crypto-random-string");

const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const { sendEmail } = require("./ses.js");

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

const fileSizeLimitErrorHandler = (err, req, res, next) => {
    if (err) {
        return res.json({ fileTooBig: true });
    } else {
        next();
    }
};

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

app.post("/login.json", requireNotLoggedIn, (req, res) => {
    const { email, password } = req.body;
    db.getUserByEmail(email)
        .then((data) => {
            const dataPw = data.rows[0].password;
            const inputPw = password;

            compare(inputPw, dataPw).then((match) => {
                if (match) {
                    req.session.userId = data.rows[0].id;
                    return res.json({ success: true });
                } else {
                    console.log("wrong password");
                    return res.json({ success: false });
                }
            });
        })
        .catch((err) => {
            console.log("error on post in login:", err);
            console.log("wrong email");
            return res.json({ success: false });
        });
});

app.post("/password/getcode", (req, res) => {
    const code = cryptoRandomString({
        length: 6,
    });
    const { email } = req.body;
    console.log("email", email);
    db.checkForUser(email)
        .then((data) => {
            if (data.rows[0].count > 0) {
                db.storeCode(email, code).then(() => {
                    sendEmail(
                        `${email}`,
                        "Your code to reset password",
                        `Reset you password with this code ${code}.
                            This code will expire in 10 minutes.`
                    );
                });
            }
            return res.json({ success: true });
        })
        .catch((err) => {
            console.log("error on post to /password/reset", err);
            return res.json({ success: true });
        });
});

app.post("/password/reset", (req, res) => {
    const { code, password, email } = req.body;

    db.getCode(code, email).then((data) => {
        if (data.rows.length) {
            hash(password).then((hasedPw) => {
                db.setNewPassword(hasedPw, email)
                    .then(() => res.json({ success: true }))
                    .catch((err) => {
                        console.log("error on setNewPassword", err);
                        return res.json({ success: false });
                    });
            });
        } else {
            res.json({ success: false });
        }
    });
});

app.get("/newusers", (req, res) => {
    db.getNewUsers()
        .then(({ rows }) => {
            return res.json(rows);
        })
        .catch((err) => {
            console.log("error sending new users to client: ", err);
            return res.sendStatus(500);
        });
});

app.get("/finduser/:search", (req, res) => {
    const { search } = req.params;
    const userId = req.session.userId;
    console.log("userId", userId);
    db.getUsersBySearch(search, userId)
        .then(({ rows }) => {
            return res.json(rows);
        })
        .catch((err) => {
            console.log("error sending users to client: ", err);
            return res.sendStatus(500);
        });
});

app.get(`/api/user/:id`, (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    db.getUserById(id === "undefined" ? userId : id)
        .then(({ rows }) => {
            if (userId === id) {
                return res.json({ ownId: true });
            }
            return res.json(rows);
        })
        .catch((err) => {
            console.log("error sending images to client: ", err);
            return res.json({ noId: true });
        });
});

app.post(
    "/profile/upload",
    uploader.single("file"),
    fileSizeLimitErrorHandler,
    s3.upload,
    (req, res) => {
        if (req.file) {
            const userId = req.session.userId;
            const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
            db.addProfilePic({ url, userId })
                .then(({ rows }) => res.json(rows[0]))
                .catch((err) => console.log("error on addProfilePic:", err));
        } else {
            res.json({
                success: false,
            });
        }
    }
);

app.post("/bio/upload", (req, res) => {
    console.log("req.body", req.body);
    if (req.body) {
        const userId = req.session.userId;
        const bio = req.body.bio;
        db.addBio({ bio, userId })
            .then(() => res.json({ success: true }))
            .catch((err) => console.log("error on addBio:", err));
    } else {
        console.log("problem getting bio on server side");
        res.json({
            success: false,
        });
    }
});

app.get(`/api/friendship/:id`, (req, res) => {
    const otherId = req.params.id;
    const ownId = req.session.userId;
    db.friendshipStatus({ ownId, otherId })
        .then(({ rows }) => {
            console.log("rows", rows);
            if (!rows.length) {
                res.json({
                    friendship: false,
                    reqReceived: false,
                    reqSent: false,
                });
            } else if (!rows[0].accepted && rows[0]["sender_id"] == ownId) {
                res.json({
                    friendship: false,
                    reqReceived: false,
                    reqSent: true,
                });
            } else if (!rows[0].accepted && rows[0]["sender_id"] == otherId) {
                res.json({
                    friendship: false,
                    reqReceived: true,
                    reqSent: false,
                });
            } else if (rows[0].accepted) {
                res.json({
                    friendship: true,
                    reqReceived: false,
                    reqSent: false,
                });
            } else {
                res.json({
                    problem: true,
                });
            }
        })
        .catch((err) => {
            console.log("error getting friendship status", err);
            res.json({ err: true });
        });
});

app.post("/api/friendship", (req, res) => {
    const { otherId, btnText } = req.body;
    const ownId = req.session.userId;
    if (btnText == "Send Friend Request") {
        db.sendFriendRequest({ ownId, otherId })
            .then(() => res.json({ reqSent: true }))
            .catch((err) => console.log("err sendFriendRequest", err));
    } else if (btnText == "Accept Friend Request") {
        db.acceptFriendRequest({ ownId, otherId })
            .then(() => res.json({ accepted: true }))
            .catch((err) => console.log("err acceptFriendRequest", err));
    } else if (btnText == "Cancel Friend Request" || btnText == "Unfriend") {
        db.cancelFriendRequest({ ownId, otherId })
            .then(() => res.json({ canceled: true }))
            .catch((err) => console.log("err cancelFriendRequest", err));
    } else {
        res.json({ problem: true });
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
