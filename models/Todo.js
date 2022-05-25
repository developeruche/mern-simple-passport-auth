const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});


// exporting the Schema model
module.exports = mongoose.model("Todo", TodoSchema);