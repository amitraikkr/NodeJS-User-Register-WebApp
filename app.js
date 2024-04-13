const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')

require('./config/passport')(passport)

const PORT = process.env.PORT || 3002
const app = express()


// Connect to MongoDB
const db = require('./config/param').mongoURL
mongoose.connect(
    db,
    {  useNewUrlParser: true}
).then(() => console.log('MongoDB Connected ...'))
.catch(err => console.log(err))

app.use(expressLayouts)
app.set("view engine", 'ejs')

app.use(express.urlencoded({ extended: true}))

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use( function(req,res, next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

app.use("/", require('./routes/index'))
app.use('/users',require('./routes/users'))

// Server is listening 
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))






