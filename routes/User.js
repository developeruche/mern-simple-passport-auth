const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Todo = require("../models/Todo");



// utils function
const signToken = userId => {
    return JWT.sign({
        iss: "Developeruche",
        sub: userId,
    }, "Developeruche", {
        expiresIn: "20h"
    })
}


userRouter.post("/register", (req, res) => {
    // obtaining data from the request body
    const {username, password, role} = req.body;

    // checking the user exist (we don't want double users)
    User.findOne({username}, (err, user) => {
        if(err) res.status(500).json({message: {msgBody: "An Error has Occurred", msgError: true}});
        if(user) res.status(400).json({message: {msgBody: "Username is already taken", msgError: true}});
        else {
            const newUser = new User({username,password,role});
            newUser.save(err => {
                if(err) res.status(500).json({message: {msgBody: "An Error has Occurred", msgError: true}});
                else res.status(201).json({message: {msgBody: "Account successfully", msgError: false}});
            })
        }
    });
});


userRouter.post("/login", passport.authenticate('local', {session: false}), (req, res) => {
    if(req.isAuthenticated()) {
        const {_id, username, role} = req.user;
        const token = signToken(_id);

        // sending the cookies to the cookies to the frontend
        res.cookie('access_token', token, {httpOnly: true, sameSite: true});
        res.status(200).json({isAuthenticated: true, user: {username, role}})
    }
})


userRouter.get("/logout", passport.authenticate('jwt', {session: false}), (req, res) => {
    // clearing the cookies from the browser
    res.clearCookie('access_token');
    res.json({user: {username: "", role: ""}, success: true});
});


userRouter.post("/todo", passport.authenticate('jwt', {session: false}), (req, res) => {
    const todo = new Todo(req.body);
    todo.save(err => {
        if(err) res.status(500).json({message: {msgBody: "An Error has Occurred", msgError: true}});
        else {
            req.user.todos.push(todo);
            req.user.save(err => {
                if(err) res.status(500).json({message: {msgBody: "An Error has Occurred", msgError: true}});
                res.status(201).json({message: {msgBody: "Successfully created todo", msgError: false}})
            });
        }
    });
});


userRouter.get("/todos", passport.authenticate('jwt', {session: false}), (req, res) => {
    User.findById({_id: req.user._id}).populate('todos').exec((err, document) => {
        if(err) res.status(500).json({message: {msgBody: "An Error has Occurred", msgError: true}});
        else res.status(200).json({todos: document.todos, authenticated: true});
    });
});


userRouter.post("/admin", passport.authenticate('jwt', {session: false}), (req, res) => {
    if(req.user.role === "admin") {
        res.status(200).json({message: {msgBody: "Welcome, You have been validated as an admin", msgError: false}})
    }else {
        res.status(403).json({message: {msgBody: "You are not an ADMIN", msgError: true}})
    }
});


userRouter.post("/authenticated", passport.authenticate('jwt', {session: false}), (req, res) => {
    const {username, role} = req.user;
    res.status(200).json({isAuthenticated: true, user: {username, role}});
});



module.exports = userRouter;






