const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const config = require("./config");
const swaggerConfig = {
  ...require("./doc/swagger.json"),
  host: `${config.hostname}:${config.port}`,
  basePath: `${config.baseUrl}`,
};

const apiUrl = require("./api-url");
const controllers = require("./controllers");
const swaggerDocument = require("./doc/swagger.json");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use(bodyParser.urlencoded({ extended: false }));

function checkRole(checkedRole) {
  const roles = {
    view: 0,
    edit: 1,
    admin: 2,
  };

  return (req, res, next) => {
   
    if (!checkedRole) {
      return next();
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send("Unauthorized: Token not provided");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles[decoded.role] >= roles[checkedRole]) {
        req.user = decoded; 
        return next();
      }

      return res.status(401).send("Unauthorized: You don´t have permission");
    } catch (err) {
      return res.status(401).send("Unauthorized: Invalid token");
    }
  };
}

[
  
  { method: "get", url: "version", cb: controllers.version.get },

  // Circuits 
  { method: "get", url: "circuits", cb: controllers.circuits.getAll, checkedRole: "view" },
  { method: "get", url: "circuits/:id", cb: controllers.circuits.getById, checkedRole: "view" },
  { method: "post", url: "circuits", cb: controllers.circuits.create, checkedRole: "edit" },
  { method: "put", url: "circuits/:id", cb: controllers.circuits.updateById, checkedRole: "edit" },
  { method: "delete", url: "circuits/:id", cb: controllers.circuits.deleteById, checkedRole: "edit" },
  { method: "get", url: "circuits/:id/location", cb: controllers.circuits.getLocationById, checkedRole: "view" },
  { method: "get", url: "circuits/:id/country", cb: controllers.circuits.getCountryById, checkedRole: "view" },

  // Locations 
  { method: "get", url: "locations", cb: controllers.locations.getAll, checkedRole: "view" },
  { method: "get", url: "locations/:id", cb: controllers.locations.getById, checkedRole: "view" },
  { method: "post", url: "locations", cb: controllers.locations.create, checkedRole: "edit" },
  { method: "put", url: "locations/:id", cb: controllers.locations.updateById, checkedRole: "edit" },
  { method: "delete", url: "locations/:id", cb: controllers.locations.deleteById, checkedRole: "edit" },

  // Countries 
  { method: "get", url: "countries", cb: controllers.countries.getAll, checkedRole: "view" },
  { method: "get", url: "countries/:id", cb: controllers.countries.getById, checkedRole: "view" },
  { method: "post", url: "countries", cb: controllers.countries.create, checkedRole: "edit" },
  { method: "put", url: "countries/:id", cb: controllers.countries.updateById, checkedRole: "edit" },
  { method: "delete", url: "countries/:id", cb: controllers.countries.deleteById, checkedRole: "edit" },

  // Users 
  { method: "post", url: "users/login", cb: controllers.users.login },
  { method: "get", url: "users", cb: controllers.users.getAll, checkedRole: "admin" },
  { method: "get", url: "users/:id", cb: controllers.users.getUserById, checkedRole: "admin" },
  { method: "post", url: "users", cb: controllers.users.create},
  { method: "put", url: "users/:id", cb: controllers.users.updateById, checkedRole: "admin" },
  { method: "delete", url: "users/:id", cb: controllers.users.deleteById, checkedRole: "admin" },

].forEach(({ method, url, checkedRole, cb }) => {
  app[method](apiUrl(url), checkRole(checkedRole), cb);
});

app.listen(config.port, () => {
  console.log(`api is listening on port ${config.port}!`);
});
