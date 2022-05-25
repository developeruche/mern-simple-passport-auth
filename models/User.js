const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 30,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: "Todo"
        }
    ]
})


UserSchema.pre("save", function(next) {
    // checking is the password is hashed
    if(!this.isModified("password"))
        return next();
    
    // hashing the password
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if(err)
            return next(err);
        this.password = passwordHash;
        next();
    });
});


// adding a method for comparing the password for validation sake
UserSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if(err) 
            return cb(err);
        else {
            if(!isMatch)
                return cb(null, isMatch);
            
                return cb(null, this);
        }
    });
}


// exporting the Schema model
module.exports = mongoose.model("User", UserSchema);