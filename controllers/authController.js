const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Message = require("../models/message");

exports.index = asyncHandler(async (req, res, next) => {
    res.render("index", {title: "Message board"});
});

exports.sign_up_get = asyncHandler(async (req, res, next) => {
    res.render("sign-up", { title: "Sign up" });
});

exports.sign_up_post = [
    body("username", "Username must not be empty").trim().isLength({ min: 1 }).escape(),
    body("password", "Password must be minimum 8 characters").trim().isLength({ min: 8 }).escape(),
    body("firstname", "First name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("familyname", "Surname must not be empty").trim().isLength({ min: 1 }).escape(),
    body("confirmpassword", "Password does not match").trim().isLength({ min: 8 }).escape().custom((value, { req }) => {
        return value === req.body.password;
    }),
    asyncHandler( async (req,res,next) => {
        const errors = validationResult(req);
        const userExists = await User.findOne({ username: req.body.username });

        if (userExists) {
            res.render("sign-up", {title: "Sign up", user: userExists});
            return;
        }

        if (!errors.isEmpty()) {
            res.render("sign-up", {title: "Sign up", errors: errors.array()});
        }
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
                firstName: req.body.firstname,
                familyName: req.body.familyname
            });

            await newUser.save();
            res.render("index", {title: "Message board", status: "User created! Log in to see messages"});
        }
    })
];

exports.log_in_post = [
    body("username", "Username must not be empty").trim().isLength({ min: 1 }).escape(),
    body("password", "Password must not be empty").trim().isLength({ min: 8 }).escape(),
    passport.authenticate("local", {
        successRedirect: "/messages",
        failureRedirect: "/"
    })
];

exports.log_out_get = asyncHandler(async (req, res, next) => {
    
    if (req.user) {
        console.log(`${req.user.username} just logged out!`);
        req.logout(function (err) {
            if (err) {
                return next(err);
            }

            res.redirect("/");
        });
    }
    else {
        res.redirect("/");
    }
});
