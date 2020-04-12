
// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');

/*
    defines an object which contains functions executed as callback
    when a client requests for `profile` paths in the server
*/
const profileController = {

    /*
        executed when the client sends an HTTP GET request `/profile/:idNum`
        as defined in `../routes/routes.js`
    */
    getProfile: function (req, res) {

        // query where `idNum` is equal to URL parameter `idNum`
        var query = {idNum: req.params.idNum};

        // fields to be returned
        var projection = 'fName lName idNum';

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
            calls the function findOne()
            defined in the `database` object in `../models/db.js`
            this function searches the collection `users`
            based on the value set in object `query`
            the third parameter is a string containing fields to be returned
            the fourth parameter is a callback function
            this called when the database returns a value
            saved in variable `result`
        */
        db.findOne(User, query, projection, function(result) {

            /*
                if the user exists in the database
                render the profile page with their details
            */
            if(result != null) {
                details.fName = result.fName;
                details.lName = result.lName;
                details.idNum = result.idNum;

                // render `../views/profile.hbs`
                res.render('profile', details);
            }
            /*
                if the user does not exist in the database
                render the error page
            */
            else {
                // render `../views/error.hbs`
                res.render('error', details);
            }
        });
    }
}

/*
    exports the object `profileController` (defined above)
    when another script exports from this file
*/
module.exports = profileController;
