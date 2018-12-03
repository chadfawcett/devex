
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)


# BCDevExchange Application

The [BCDevExchange](https://bcdevexchange.org) is a platform that provides new ways for British Columbia's public sector to connect with developers and other IT professionals.


The latest version is a mean.js application running in OpenShift using Docker.

***

## Table of Contents

* [Contributing](https://github.com/BCDevExchange/devex#contribute)
* [Development](https://github.com/BCDevExchange/devex#development)
* [Copyright and License](https://github.com/BCDevExchange/devex#copyright-and-license)

***

## Contribute

We are open to pull requests. Please read our [contributing guidelines](https://github.com/BCDevExchange/devex/blob/master/CONTRIBUTING.md). 

## Development

Prerequisite: Docker

To get started, run the following command to set things up the first time:
```bash
$ setup.sh
```

This will start a Docker container running mongo and build a new image for the application code.  If you already have an instance of mongo running
then you will likely get errors.  Make sure to shutdown your local mongo instance.

Once setup has finished you can run the codebase with:
```bash
$ dev.sh
```

This will run the application image and link it to your running database container.  It will not start the application, however, but put you in the command line ready to do so.
By default the application starts in development mode and if this is the first time running you should seed the dtabase users, so start the first time with:
```bash
$ MONGO_SEED=true npm start
```
Once the seeding is done you need not do it again unless you lose your mongo container and data somehow, so each
other time runing the application you can simply run
```bash
$ npm start
```
You should now be able to run the application by entering "localhost:3030" into your browser.  If you are not able to view the application properly, then you need to add the Bower node package.  Do this by returning to the command line and running
```bash
$ bower install --allow-root
```
Once Bower has been installed, run 
```bash
$ npm run quiet
```

### Notes

The root files are NOT mounted in the container in the same way as the rest of the code.  Therefore, if you are adding a new
module through bower or npm you will need to update the local package.json or other files appropriately.

The node_modules directory does NOT exist in the repo and should not be added in case you accidentally run npm install locally

Production Mode:
In Production:
```bash
MONGO_SEED=true npm run start:prod
npm run start:prod
```
Tests:

```bash
$ npm test
```
This will run both the server-side tests (located in the `app/tests/` directory) and the client-side tests (located in the `public/modules/*/tests/`).

To execute only the server tests, run the test:server task:

```bash
$ npm run test:server
```

To execute only the server tests and run again only changed tests, run the test:server:watch task:

```bash
$ npm run test:server:watch
```

And to run only the client tests, run the test:client task:

```bash
$ npm run test:client
```

Running with TLS (SSL)
Application will start by default with secure configuration (SSL mode) turned on and listen on port 8443.
To run your application in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:

```bash
$ npm run generate-ssl-certs
```

After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, execute prod task `npm run start:prod`
* enable/disable SSL mode in production environment change the `secure` option in `config/env/production.js`


## License

* **[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)**
* Copyright &copy; 2018 BC Developers' Exchange










