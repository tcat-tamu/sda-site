# Development Dependencies

This project's build system requires the following software to be installed:

* Node.js (>=6.0.0 && <8.0.0)
  * bower (>=1.7.9)
  * gulp (>= 1.2.2)
* Ruby (>=2.0.0)
  * bundler (>=1.13.0)

Optionally, the following image optimization utilities may be installed:

* ImageMagick
* OptiPNG

# Application Development Setup

Both the admin app and the user-facing home app have development servers that allow the app to be run locally when under development. However, when running these applications, some of the server paths defined by application config will not work. This will cause some links to malfunction when clicked.

Both applications depend on the shared **sda** library and on certain style configurations in the **web** Jekyll project, hence both of these should be built prior to launching the **admin** or **site** app development server:

    cd apps/sda
    npm install
    gulp
    cd ../../web
    bundle install
    bundle exec jekyll build
    cd ..

Once the dependencies are built, the app dev server may be launched. **admin** will be used here, but the process is identical for the **site** app:

    cd apps/admin
    rm -rf bower_components/sda
    npm install
    bower install
    gulp serve

Each app's server configuration proxys API requests to a locally running SDA/TRC server instance by default. This can be changed by modifying the `server.middleware` configuration value in **gulp/server.js**. If the local server instance is used, please ensure it is properly configured, launched, and listening on port 9999. Please refer to documentation in the **sda.deploy** repository for more details on server configuration.

# Build and Deployment Instructions

Afetr installing the development dependencies above, building may be done in an automated script or manually as detailed in the sections that follow.

Once built, the build artifacts in the **web/_site** directory may be deployed to the document root of the hosting server.

## Automated Assembly

The **build.sh** script assembles the entire site in a single command:

    ./build.sh

## Manual Assembly

First, build the shared **sda** library since it contains code necessary to run both the admin and user-facing apps:

    cd apps/sda
    npm install
    gulp
    cd ../..

Now the admin and user-facing apps can be built. First remove any remnant "sda" library scripts installed by bower:

    cd apps/admin
    rm -rf bower_components/sda
    npm install
    bower install
    gulp
    cd ../..

    cd apps/site
    rm -rf bower_components/sda
    npm install
    bower install
    gulp
    cd ../..

The apps need to be copied into their corresponding directories for deployment:

    cp -r apps/admin/dist web/admin
    cp -r apps/site/dist web/sda

Next, compile the remaining static content via Jekyll, removing any previous build artifacts:

    cd web
    rm -rf _site
    bundle install
    bundle exec jekyll build
    cd ..

Optionally, the images in the output **web/_site** directory may be optimized if the necessary utilities are installed:

    cd web/_site/assets/images
    mogrify -resize 1200 -strip -interlace Plane -sampling-factor 4:2:0 -quality 75% banners{,/**}/*.{jpg,png}
    mogrify -resize 600 -strip -interlace Plane -sampling-factor 4:2:0 -quality 75% nav-tiles{,/**}/*.{jpg,png}
    optipng -o7 -zm1-9 -fix **/*.png
    cd ../../../..

These commands may produce "No such file or directory" errors. Please ignore.
