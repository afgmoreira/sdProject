const express = require("express");
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');

const config = require('./config');
const swaggerConfig = {
    ...require("./doc/swagger.json"),
    host:       `${config.hostname}:${config.port}`,
    basePath:   `${config.baseUrl}`
};


const apiUrl = require("./api-url");
const controllers = require("./controllers");
const swaggerDocument = require("./doc/swagger.json");
const swaggerUi = require("swagger-ui-express");


const app = express();
app.use(express.json());
app.use(cors({credentials: true, origin: true}));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerConfig));


[
    { method: "get",    url: "version",                         cb: controllers.version.get },

    //circuits

    { method: "get",    url: "circuits",                        cb: controllers.circuits.getAll },
    { method: "get",    url: "circuits/:circuitId",             cb: controllers.circuits.getById },
    { method: "post",   url: "circuits",                        cb: controllers.circuits.create}, 
    { method: "put",    url: "circuits/:circuitId",             cb: controllers.circuits.updateById},
    { method: "delete", url: "circuits/:circuitId",             cb: controllers.circuits.deleteById},
    { method: "get",    url: "circuits/:circuitId/location",    cb: controllers.circuits.getLocationById},
    { method: "get",    url: "circuits/:circuitId/country",     cb: controllers.circuits.getCountryById},


    //locations

    { method: "get",    url: "locations",                       cb: controllers.locations.getAll },
    { method: "get",    url: "locations/:circuitId",            cb: controllers.locations.getById },
    { method: "post",   url: "locations",                       cb: controllers.locations.create}, 
    { method: "put",    url: "locations/:locationId",           cb: controllers.locations.updateById},
    { method: "delete", url: "locations/:locationId",           cb: controllers.locations.deleteById},

    //countries

    { method: "get",    url: "countries",                       cb: controllers.countries.getAll },
    { method: "get",    url: "countries/:countryId",            cb: controllers.countries.getById },
    { method: "post",   url: "countries",                       cb: controllers.countries.create}, 
    { method: "put",    url: "countries/:countryId",            cb: controllers.countries.updateById},
    { method: "delete", url: "countries/:countryId",            cb: controllers.countries.deleteById},


    //users

    { method: "post",   url: "users/login",                     cb: controllers.users.login},
    { method: "get",    url: "users",                           cb: controllers.users.getAll},
    { method: "post",    url: "users",                          cb: controllers.users.create },
    { method: "put",    url: "users/:userId",                   cb: controllers.users.updateById},
    { method: "delete", url: "users/:userId",                   cb: controllers.users.deleteById},
    

].forEach(({method, url, cb}) => {
    app[method](apiUrl(url), cb);
});

app.listen(config.port, () => {
    console.log(`api is listening on port ${config.port}!`)
});
