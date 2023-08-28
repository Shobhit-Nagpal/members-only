const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    text: {type: String, required: true},
    timestamp: {type: Date, default: Date.now},
    sender: {type: Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model("Message", MessageSchema);
