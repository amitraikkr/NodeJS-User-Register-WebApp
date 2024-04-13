
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = function(passport) {
console.log(passport)

passport.use(
    new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
        
        User.findOne({
            email: email
        }).then(user => {
            if (!user){
                return done(null, false, { message: 'User is not registered'})
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Password incorrect'})
                }
            })
        })
    })
)

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(async(id, done) => {
        try{
            const user = await User.findById(id) 
            done(null, user)
        }catch (err) {
            done(err)
        }
    })
}