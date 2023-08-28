var express = require('express');
var router = express.Router();
const auth_controller =  require("../controllers/authController");
const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");

/* GET home page. */
router.get("/", auth_controller.index);


//Sign up routes
router.get("/sign-up", auth_controller.sign_up_get);
router.post("/sign-up", auth_controller.sign_up_post);

//Log in/out routes
router.post("/log-in", auth_controller.log_in_post);
router.get("/log-out", auth_controller.log_out_get);

//Messages routes
router.get("/messages", message_controller.message_get);
router.get("/messages/create", message_controller.message_create_get);
router.post("/messages/create", message_controller.message_create_post);
router.post("/messages/delete", message_controller.message_delete_post);

//User routes
router.get("/member", user_controller.member_create_get);
router.post("/member", user_controller.member_create_post);

router.get("/admin", user_controller.admin_create_get);
router.post("/admin", user_controller.admin_create_post);

module.exports = router;
