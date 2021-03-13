const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'User Name Cannot Be Empty'],
        unique: false
    },
    password: {
        type: String,
        required: [true, 'Password Cannot Be Empty'],
        unique: false
    },
    email: {
        type: String,
        required: [true, 'E-mail Cannot Be Empty'],
        unique: false
    },
    userAge: {
        type: Number,
        required: [true, 'Age Cannot Be Empty'],
        unique: false
    },
    chat: {
        message: {
            type: String,
            required: false,
        },
        sender: {
            type: Object,
            required: false
        }
    }
})
userSchema.statics.authUser = async function(userName, password)  {
    const findUser = await this.findOne({
        userName
    })
    const authourise = await bcrypt.compare(password, findUser.password)
    return authourise ? findUser : false
}
try {
    userSchema.pre('save', async function (next) {
        if (!this.isModified('password')) {
            return next()
        }
        this.password = await bcrypt.hash(this.password, 12)
        next()
    })
} catch (err) {
    console.log(err);
}

module.exports = mongoose.model('user', userSchema)