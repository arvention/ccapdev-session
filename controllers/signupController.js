
// import module `validationResult` from `express-validator`
const { validationResult } = require('express-validator');

// import module `bcrypt`
const bcrypt = require('bcrypt');
const saltRounds = 10;

// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for `signup` paths in the server
*/
const signupController = {

    /*
        executed when the client sends an HTTP GET request `/signup`
        as defined in `../routes/routes.js`
    */
    getSignUp: function (req, res) {
        var details = {};

        // checks if a user is logged-in by checking the session data
        if(req.session.idNum) {

            /*
                sets `details.flag` to true
                to display the profile and logout tabs in the nav bar

                sets the value of `details.name` to `req.session.name`
                to display the name of the logged-in user
                in the profile tab of the nav bar

                sets the value of `details.uidNum` to `req.session.idNum`
                to provide the link the profile of the logged-in user
                in the profile tab of the nav bar

                these values are rendered in `../views/partials/header.hbs`
            */
            details.flag = true;
            details.name = req.session.name;
            details.uidNum = req.session.idNum;
        }

        // else if a user is not yet logged-in
        else
            /*
                sets `details.flag` to false
                to hide the profile and logout tabs in the nav bar
            */
            details.flag = false;

        // render `../views/signup.hbs`
        res.render('signup', details);
    },

    /*
        executed when the client sends an HTTP POST request `/signup`
        as defined in `../routes/routes.js`

        prior to the execution of this function, values are validated
        with an array of validation middlewares
        defined in the object `validation` in `../helpers/validation.js`
    */
    postSignUp: function (req, res) {

        // checks if there are validation errors
        var errors = validationResult(req);

        // if there are validation errors
        if (!errors.isEmpty()) {

            // get the array of errors
            errors = errors.errors;

            var details = {};

            // checks if a user is logged-in by checking the session data
            if(req.session.idNum) {

                /*
                    sets `details.flag` to true
                    to display the profile and logout tabs in the nav bar

                    sets the value of `details.name` to `req.session.name`
                    to display the name of the logged-in user
                    in the profile tab of the nav bar

                    sets the value of `details.uidNum` to `req.session.idNum`
                    to provide the link the profile of the logged-in user
                    in the profile tab of the nav bar

                    these values are rendered in `../views/partials/header.hbs`
                */
                details.flag = true;
                details.name = req.session.name;
                details.uidNum = req.session.idNum;
            }

            // else if a user is not yet logged-in
            else
                /*
                    sets `details.flag` to false
                    to hide the profile and logout tabs in the nav bar
                */
                details.flag = false;

            /*
                for each error, store the error inside the object `details`
                the field is equal to the parameter + `Error`
                the value is equal to `msg`
                as defined in the validation middlewares

                for example, if there is an error for parameter `fName`:
                store the value to the field `fNameError`
            */
            for(i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            /*
                render `../views/signup.hbs`
                display the errors defined in the object `details`
            */
            res.render('signup', details);
        }

        else {
            /*
                when submitting forms using HTTP POST method
                the values in the input fields are stored in `req.body` object
                each <input> element is identified using its `name` attribute
                Example: the value entered in <input type="text" name="fName">
                can be retrieved using `req.body.fName`
            */
            var fName = req.body.fName;
            var lName = req.body.lName;
            var idNum = req.body.idNum;
            var pw = req.body.pw;

            /*
                use hash() method of module `bcrypt`
                to hash the password entered by the user
                the hashed password is stored in variable `hash`
                in the callback function
            */
            bcrypt.hash(pw, saltRounds, function(err, hash) {

                var user = {
                    fName: fName,
                    lName: lName,
                    idNum: idNum,
                    pw: hash
                }

                /*
                    calls the function insertOne()
                    defined in the `database` object in `../models/db.js`
                    this function adds a document to collection `users`
                */
                db.insertOne(User, user, function(flag) {
                    if(flag) {
                        /*
                            upon adding a user to the database,
                            redirects the client to `/success` using HTTP GET,
                            defined in `../routes/routes.js`
                            passing values using URL
                            which calls getSuccess() method
                            defined in `./successController.js`
                        */
                        res.redirect('/success?fName=' + fName +'&lName=' + lName + '&idNum=' + idNum);
                    }
                });
            });
        }
    },

    /*
        executed when the client sends an HTTP GET request `/getCheckID`
        as defined in `../routes/routes.js`
    */
    getCheckID: function (req, res) {

        /*
            when passing values using HTTP GET method
            the values are stored in `req.query` object
            Example url: `http://localhost/getCheckID?idNum=11312345`
            To retrieve the value of parameter `idNum`: `req.query.idNum`
        */
        var idNum = req.query.idNum;

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            searches for a single document based on the model `User`
            sends an empty string to the user if there are no match
            otherwise, sends an object containing the `idNum`
        */
        db.findOne(User, {idNum: idNum}, 'idNum', function (result) {
            res.send(result);
        });
    }

}

/*
    exports the object `signupController` (defined above)
    when another script exports from this file
*/
module.exports = signupController;
