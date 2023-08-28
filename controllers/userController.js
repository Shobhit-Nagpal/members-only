const {body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const User = require("../models/user");

exports.member_create_get = asyncHandler(async (req, res, next) => {
    res.render("member-form", {title: "Join the club", user: req.user});
});

exports.member_create_post = [
    body("secretpass", "Code should not be empty").trim().isLength({ min: 1 }).escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const user = await User.find({ username: req.user.username }).exec();
        console.log(user);

        if (user === null) {
            const err = new Error("User does not exist");
            err.status = 404;
            return next(err);
        }

        if (String(req.body.secretpass) !== String(process.env.MEMBER_SECRET_PASS)) {
            res.render("member-form", {title: "Join the club", user: req.user, status: "Wrong code."});
            return;
        }

        if (!errors.isEmpty()) {
            res.render("member-form", {title: "Join the club", user: req.user});
        }
        else {
           const _user = new User({
                firstName: req.user.firstName,
               familyName: req.user.familyName,
               username: req.user.username,
               password: req.user.password,
               isMember: true,
               _id: req.user._id
           });

            const updatedUser = await User.findByIdAndUpdate(req.user.id, _user, {});
            res.redirect("/messages");
        }
    })
];

exports.admin_create_get = asyncHandler(async (req, res, next) => {
    res.render("admin-form", {title: "Gain access if you're worthy.", user: req.user});
});

exports.admin_create_post = [
    body("accesscode", "Access code must not be empty").trim().isLength({ min: 1 }).escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const user = await User.find({ username: req.username }).exec();

        if (user === null) {
            const err = new Error("User not found");
            err.status = 404;
            return next(err);
        }

        if (String(process.env.ADMIN_ACCESS_CODE) !== String(req.body.accesscode)) {
            res.render("admin-form", {title: "Gain access if you're worthy", user: req.user, status: "Access denied"})
        }

        if (!errors.isEmpty()) {
            res.render("admin-form", {title: "Gain access if you're worthy", user: req.user, errors: errors.array()});
        }
        else {
            const _user = new User({
                firstName: req.user.firstName,
                familyName: req.user.familyName,
                username: req.user.username,
                password: req.user.password,
                isMember: req.user.isMember,
                isAdmin: true,
                _id: req.user._id
            });

            const updatedUser = await User.findByIdAndUpdate(req.user.id, _user, {});
            res.redirect("/messages");
        }
    })
];
