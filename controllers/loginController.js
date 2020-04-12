
// import module `bcrypt`
const bcrypt = require('bcrypt');

// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for `login` paths in the server
*/
const loginController = {

    /*
        executed when the client sends an HTTP GET request `/login`
        as defined in `../routes/routes.js`
    */
    getLogIn: function (req, res) {

        // checks if a user is logged-in by checking the session data
        if(req.session.idNum) {

            /*
                redirects the client to `/profile` using HTTP GET,
                defined in `../routes/routes.js`
                passing values using URL
                which calls getProfile() method
                defined in `./profileController.js`
            */
            res.redirect('/profile/' + req.session.idNum);
        }

        // else if a user is not yet logged-in
        else {

            /*
                sets the flag to false
                this will not display the profile and logout tab
                in the navigation bar
            */
            var details = {
                flag: false
            };

            // render `../views/login.hbs`
            res.render('login', details);
        }
    },

    /*
        executed when the client sends an HTTP POST request `/login`
        as defined in `../routes/routes.js`
    */
    postLogIn: function (req, res) {

        /*
            when submitting forms using HTTP POST method
            the values in the input fields are stored in `req.body` object
            each <input> element is identified using its `name` attribute
            Example: the value entered in <input type="text" name="idNum">
            can be retrieved using `req.body.idNum`
        */
        var idNum = req.body.idNum;
        var pw = req.body.pw;

        /*
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            this function finds a document from collection `users`
            where `idNum` is equal to `idNum`
        */
        db.findOne(User, {idNum: idNum}, '', function (result) {

            // if a user with `idNum` equal to `idNum` exists
            if(result) {

                var user = {
                    fName: result.fName,
                    lName: result.lName,
                    idNum: result.idNum
                };

                /*
                    use compare() method of module `bcrypt`
                    to check if the password entered by the user
                    is equal to the hashed password in the database
                */
                bcrypt.compare(pw, result.pw, function(err, equal) {

                    /*
                        if the entered password
                        match the hashed password from the database
                    */
                    if(equal) {

                        /*
                            stores the `idNum` and `fName` of the logged-in user
                            to the session as `idNum` and `name`
                        */
                        req.session.idNum = user.idNum;
                        req.session.name = user.fName;

                        /*
                            redirects the client to `/profile/idNum`
                            where `idNum` is equal
                            to the `idNum` entered by the user
                            defined in `../routes/routes.js`
                            which calls getProfile() method
                            defined in `./profileController.js`
                        */
                        res.redirect('/profile/' + user.idNum);
                    }

                    /*
                        else if the entered password
                        does not match the hashed password from the database
                    */
                    else {
                        var details = {
                            flag: false,
                            error: `ID Number and/or Password is incorrect.`
                        };

                        /*
                            render `../views/login.hbs`
                            display the errors
                        */
                        res.render('login', details);
                    }
                });
            }

            // else if a user with `idNum` equal to `idNum` does not exist
            else {
                var details = {
                    flag: false,
                    error: `ID Number and/or Password is incorrect.`
                };

                /*
                    render `../views/login.hbs`
                    display the errors
                */
                res.render('login', details);
            }
        });
    }
}

/*
    exports the object `loginController` (defined above)
    when another script exports from this file
*/
module.exports = loginController;
