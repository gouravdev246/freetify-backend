const { default: mongoose } = require('mongoose')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function register(req, res) {
    try {
        const { username, email, password, role = "user" } = req.body
        const isAlreadyExsist = await userModel.findOne({ $or: [{ username }, { email }] })

        if (isAlreadyExsist) {
            return res.status(400).json({
                message: 'Username or email already exists'
            })


        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({
            username, email, password: hashedPassword, role: role
        })
        const token = jwt.sign({
            id: newUser._id,
            role: newUser.role
        }, process.env.JWT_SECRET)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        res.status(201).json({
            newUser: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'Error registering user'
        })
    }
}


async function loginUser(req, res) {

    const { username, email, password } = req.body
    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" })

    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Password is incorrect " })

    }
    try {
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        res.status(200).json({
            message: 'Login Successful',

            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Error logging in user'
        })
    }
}

module.exports = { register, loginUser }