const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/user')


exports.handleGetLoginPage = (req, res) => {
    res.render('login')
}

exports.handleGetRegisterPage = (req, res) => {
    res.render('register')
}

exports.handlePostRegisterPage = (req, res) => {
    const {name, email, password, password2 } = req.body
    let errors = []
    

    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please Enter All Fields'})
    }

    if(password != password2) {
        errors.push({msg: 'Passwords do not match'})
    }

    if(passport.length <6) {
        errors.push({msg: 'Password must be at least 6 characters'})
    }

    if(errors.length > 0) {
        res.render('register', { errors, name, email, password, password2 })
    } else {

        User.findOne({email: email}).then(user => {
            if(user){
                errors.push({msg: 'Email already Exists'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })
                console.log(newUser.password)
                bcrypt.genSalt(10, (err, salt) => {
                        if(err) {
                            console.error('Error generating salt:', err)
                            return res.status(500).send('Error registering the user')
                        }
                        bcrypt.hash(newUser.password.toString(), salt, (err, hash) => {
                        if(err) {
                            console.error('Error Hashing Password', err)
                            return res.status(500).send('Error registering the user')
                        }
                        
                        newUser.password = hash
                        newUser.save().then(user => {
                            req.flash(
                                'success_msg',
                                'You are now registered and can log in'
                            )
                            res.redirect('/users/login')
                        }).catch(err => {
                            console.log(err)
                        })
                    })
                })
            }
        })
    }
}

exports.handlePostLoginPage = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next)

}

exports.handleGetLogoutPage = (req, res,) => {
    req.logout()
    req.flash('success_msg','You are logged out')
    res.redirect('/users/login')
}
