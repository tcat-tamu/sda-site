# SDA Landing Site

## Installation and Configuration

A note regarding versions: _Always use the most recent version of the utilities avaliable._ Doing so ensures that vulnerabilities and bugs have been patched. If you find that this project does not run on the latest version of a utility, use the most recent version of the utility that works. The versions listed in the installation instructions below represent the version of the utility that was used during development.

### Prerequisites

This application is a web-based front-end for the server-side Java REST service. The web client retrieves its information from Java server application via AJAX calls to the REST API. Therefore, in order for this application to run correctly, the host machine needs the ability to:

1.  serve the web client's static HTML, JavaScript, etc. files in a web root directory over HTTP (preferably HTTPS) and
2.  to proxy API requests to the Java back-end.

The [Apache HTTP Server][] (version 2.4) with `mod_ssl` and `mod_proxy_http` enabled will satisfy both of these requirements. Other HTTP servers like [Nginx][] could also be used with the proper configuration.

For more information about the Java REST API service, please refer to its documentation.

### Deployment

1.  Download the application archive or build the application as described [below](#building).

2.  Place the application archive contents to the web root of your server. This folder should now have the following directory structure:

        WEB_ROOT/
        |-- assets/
        |-- maps/
        |-- scripts/
        |-- styles/
        '-- index.html

    See [below](#directory-structure) for an explanation of the different parts of this directory structure.

3.  Ensure that the web server user has permission to read the files. None of the application files require write-access and should be made read-only. The web server user should have execute permissions on directories.

### Configuration

Configuration values are located in the **scripts/config-xxxxxxxxxx.js** file. The "**xxxxxxxxxx**" part of the file name is a random combination of letters and numbers and is used to prevent browser caching problems following site updates. This value is generated automatically at build time.

The currently available configuration parameters are:

* **apiEndpoint**, the path to the API service provided by the Java server-side counterpart of this project. This path can be relative or absolute.

## Building

To make development easier, different areas of the site have been split into smaller, more manageable files. If these files were to be served as-is, the page load time would increase dramatically. Therefore, these files must be compiled, concatenated, and compressed to work efficiently in a production environment.

These instructions assume a UNIX-like environment and a moderate familiarity with the command line.

### Prerequisites

This project depends on [citeproc-js][], which is hosted in a mercurial repository. The tools used to build this project were designed to use git and GitHub for distribution, but the mercurial-specific prerequisites below (specifically _mercurial_ and _mercurial-bower-resolver_) provide a means of handling this odd case.

Some of the dependencies below may already be on your system. Please skip where appropriate.

1.  Install [git][] (version 2.5.0) and [mercurial][] (version 3.4).

2.  Download and install the [NodeJS][] platform. The build system surrounding this project is known to work in NodeJS version 5.4.0. Versions of NodeJS that are significantly newer or older than this version may not behave as expected

3.  Install the following build utilities as global NodeJS modules: [Gulp][] (version 3.9.0), [Bower][] (version 1.7.6), and the [Mercurial Bower Resolver][] (version 0.1.3).

        $ npm install -g gulp bower mercurial-bower-resolver

### Setup

1.  Clone this repository and open a terminal window to the project root directory.

        $ git clone https://github.com/{{gh_user}}/{{gh_repo}}.git {{target_dir}}
        $ cd {{target_dir}}

2.  Install the local build tools by issuing the following command:

        $ npm install

3.  Install front-end runtime dependencies by executing:

        $ bower install

### Compiling

1.  Within the root project directory, execute the following:

        $ gulp build

    The build process usually takes less than a minute.

2.  Deployable build artifacts are saved to the **dist** folder. Refer to the section [above](#installation-and-configuration) regarding deployment and configuration.

3.  To delete the generated build artifacts, run the following command:

        $ gulp clean

## Details

### Project Information

The SDA home page is powered by the [AngularJS][] application framework and leverages Google's own [Angular][angular best practices] and [JavaScript][javascript best practices] best practices where possible.

This project also takes advantage of additional open-source libraries where appropriate:

* [animate.css][] for transitions;
* [angular-scroll][] to scroll to anchors when clicked and highlight items when scrolling;
* [angular-toastr][] for displaying notifications;
* [angular-ui-router][] to handle URL fragment matching and application view management;
* [citeproc-js][] bibliography rendering;
* [dotjem-angular-tree][] for rendering recursive data structures;
* the [font-awesome][] icon set;
* [fullpage.js][] on the home page;
* [lodash][] JavaScript utility;
* [mathjax][] for rendering LaTeX mathematical symbols, formulas, and equations; and
* the [moment][] JavaScript time library.

### Build Technologies

This project uses a NodeJS-based stack to manage the development and build process:

* [Yeoman][] during initial project generation,
* NodeJS's own [npm][] utility for managing build plugins,
* [Gulp][] as the task runner,
* [Bower][] to fetch application dependencies,
* [Karma][] with [Jasmine][] for unit testing,
* AngularJS's [Protractor][] for end-to-end (e2e) testing,

### Directory Structure

**index.html** is the primary entry point to the application.

The **scripts** and **styles** directories contain the code necessary to give the site its interactive behavior and appearance respectively.

The **maps** directory holds source maps that make debugging problems easier. These files are not accessed unless the browser's developer tools are open and configured to fetch source maps.

The **assets** directory contains data used by the application scripts and other embedded content like fonts and images.

## Contributing

(TODO)

## License

The SDA home page web application is released under the Apache License, Version 2.0. The full content of this license is available online as described in the disclaimer below and in the **LICENSE** file at the root of the project repository.

> Copyright 2016 Texas A&M Engineering Experiment Station
>
> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
> http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.

[animate.css]: https://daneden.github.io/animate.css/
[angular best practices]: https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub
[angular-scroll]: https://github.com/oblador/angular-scroll
[angular-toastr]: https://github.com/Foxandxss/angular-toastr
[angular-ui-router]: https://github.com/angular-ui/ui-router
[angularjs]: https://angularjs.org
[apache http server]: http://httpd.apache.org
[bower]: http://bower.io
[citeproc-js]: https://bitbucket.org/fbennett/citeproc-js/wiki/Home
[dotjem-angular-tree]: https://github.com/dotJEM/angular-tree
[font-awesome]: https://fortawesome.github.io/Font-Awesome/
[fullpage.js]: http://alvarotrigo.com/fullPage/
[git]: https://git-scm.com
[gulp]: http://gulpjs.com
[homebrew]: https://brew.sh
[jasmine]: http://jasmine.github.io
[javascript best practices]: https://google.github.io/styleguide/javascriptguide.xml
[karma]: http://karma-runner.github.io
[lodash]: https://lodash.com
[mathjax]: https://www.mathjax.org
[mercurial]: htpts://www.mercurial-scm.org
[mercurial bower resolver]: https://github.com/phenomnomnominal/mercurial-bower-resolver
[moment]: http://momentjs.com/
[nginx]: https://www.nginx.com
[nodejs]: https://nodejs.org
[npm]: https://npmjs.org
[protractor]: https://angular.github.io/protractor
[yeoman]: http://yeoman.io
