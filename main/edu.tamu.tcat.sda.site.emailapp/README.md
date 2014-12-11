Email Subscriber Application for Special Divine Action
======================================================

This project is a Symfony (v2.6) PHP application designed to track email
subscribers who enter their address into the "email" box on the SDA site.


Deployment
----------

1.  Extract sources to the destination of your choice and symlink the
    deployment configuration directory (containing parameters.yml) into the
    root project directory as "deploy":

        $ ln -s /path/to/sda.deploy/serverconf/emailapp ./deploy

    For documentation on the available configuration parameters, please see the
    "deploy/parameters.yml" file.

2.  To verify that all system dependencies are installed and configured
    correctly, please run the included check.php file from a command-line:

        $ php app/check.php

3.  Please fix any errors and then run the deployment script:

        $ sudo ./deploy.sh

    Upon subsequent updates, please re-run this deployment script.

4.  Ensure that the "app/cache" and "app/logs" directories (and their contents)
    are writable by the web user.

5.  Point your server's document root at the "web" directory

6.  For good measure, check that your web server's PHP configuration by
    visiting "config.php" at the application site root in your browser.


Usage
-----

To add an email, send a POST request to the root path of the site. The only
data should be the "email" of the user:

    <form action="/path/to/app/">
        <input name="email" type="email" />
        <button type="submit">Subscribe</button>
    </form>

The submission should be handled through JavaScript: If the data is properly
formatted and successfully entered into the database, the server will respond
with a "200 Ok" status. If there was an error, the status code will be "400 Bad
Request".

To access the submitted email addresses, visit the application in a browser.
After authentication, the user will be presented with a table of email
addresses. Addresses can be marked as entered into an email service (e.g.
listserv) or deleted from the system.

