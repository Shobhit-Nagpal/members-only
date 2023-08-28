const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    familyName: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    isMember: {type: Boolean, require: true, default: false},
    isAdmin: {type: Boolean, required: true, default: false}
});

UserSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.familyName}`;
});

module.exports = mongoose.model("User", UserSchema);
