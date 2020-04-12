
/*
    defines an object which contains functions executed as callback
    when a client requests for `index` paths in the server
*/
const controller = {

    /*
        executed when the client sends an HTTP GET request `/favicon.ico`
        as defined in `../routes/routes.js`
    */
    getFavicon: function (req, res) {
        res.status(204);
    },

    /*
        executed when the client sends an HTTP GET request `/`
        as defined in `../routes/routes.js`
    */
    getIndex: function (req, res) {

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

            // render `../views/index.hbs`
            res.render('index', details);
        }
    }
}

/*
    exports the object `controller` (defined above)
    when another script exports from this file
*/
module.exports = controller;
