const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Message = require("../models/message");

exports.message_get = asyncHandler(async (req, res, next) => {
    const allMessages = await Message.find({}).populate("sender").exec();

    if (req.user) {
    console.log(`${req.user.username} just visited messages`);
    res.render("messages", {title: "Message board", messages: allMessages, user: req.user});
    }
    else {
        res.render("messages", {title: "Message board", messages: allMessages});
    }
});

exports.message_create_get = asyncHandler(async (req, res, next) => {
    res.render("message-form", {title: "Send a message", user: req.user});
});

exports.message_create_post =
    asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const allMessages = await Message.find({}).populate("sender").exec();

    if (!errors.isEmpty()) {
        res.render("message-form", {title: "Send a message", errors: errors.array(), user: req.user})
    }
    else {
        const newMessage = new Message({
            text: req.body.message,
            sender: req.user
        });

        await newMessage.save();
        res.redirect("/messages");
    }
});

exports.message_delete_get = asyncHandler(async (req, res, next) => {
    res.redirect("/messages");
});

exports.message_delete_post = asyncHandler(async (req, res, next) => {
    const message = await Message.findById({ _id: req.body.messageid }).exec();

    if (message === null) {
        const err = new Error("Message not found");
        err.status = 404;
        return next(err);
    }

    await Message.findByIdAndRemove(message._id);
    res.redirect("/messages");
});
