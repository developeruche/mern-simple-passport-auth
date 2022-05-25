const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const User = require("./models/User");

// this function would get the cookie sent from the frontend in the header
const cookieExtractor = req => {
    let token = null;

    if(req && req.cookies) {
        token = req.cookies["access_token"];
    }

    return token;
}

// this middle ware would be used for authorization (MEANING: this can be used to protect routes)
passport.use(new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: "Developeruche"
}, (payload, done) => {
    User.findById({_id: payload.sub}, (err, user) => {
        if(err) return done(err, false);
        if(user) return done(null, user);
        else return done(null, false);
    })
}));


// this middle ware would be handling authentication using (username) and (password) === this would only be used during login
passport.use(new LocalStrategy((username, password, done) => {
    // check to see if the user exist
    User.findOne({username}, (err, user) => {
        // something went wrong while trying to get the user
        if(err) return done(err);
        // whi=en their is no user in the database with this username
        if(!user) return done(null, false);
        // 
        user.comparePassword(password, done);
    })
}));