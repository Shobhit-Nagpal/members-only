const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local");
const User = require("../models/user");

module.exports = function(passport) {
    passport.use( new LocalStrategy( async function verify(username, password, done) {
        try {
            const user = await User.findOne({ username: username});

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        }
        catch(err) {
            return done(err);
        }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(async function(id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        }
        catch(err) {
            return done(err);
        }
    })
}
