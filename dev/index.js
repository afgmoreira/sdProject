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
    viewer: 0,
    editor: 1,
    admin: 2,
  };

  return (req, res, next) => {
    // Check if the required role is specified
    if (!checkedRole) {
      return next();
    }

    // Get the token from the Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // If token is not provided, return Unauthorized
    if (!token) {
      return res.status(401).send("Unauthorized: Token not provided");
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user role is equal to or higher than the required role
      if (roles[decoded.role] >= roles[checkedRole]) {
        req.user = decoded; // Attach user information to the request object
        return next();
      }

      return res.status(401).send("Unauthorized: You don´t have permission");
    } catch (err) {
      return res.status(401).send("Unauthorized: Invalid token");
    }
  };
}

[
  // Add your routes here with requiredRole parameter
  { method: "get", url: "version", cb: controllers.version.get },

  // Circuits Access Methods
  { method: "get", url: "circuits", cb: controllers.circuits.getAll, requiredRole: "viewer" },
  { method: "get", url: "circuits/:id", cb: controllers.circuits.getById, requiredRole: "viewer" },
  { method: "post", url: "circuits", cb: controllers.circuits.create, requiredRole: "editor" },
  { method: "put", url: "circuits/:id", cb: controllers.circuits.updateById, requiredRole: "editor" },
  { method: "delete", url: "circuits/:id", cb: controllers.circuits.deleteById, requiredRole: "editor" },
  { method: "get", url: "circuits/:id/location", cb: controllers.circuits.getLocationById, requiredRole: "viewer" },
  { method: "get", url: "circuits/:id/country", cb: controllers.circuits.getCountryById, requiredRole: "viewer" },

  // Locations Access Methods
  { method: "get", url: "locations", cb: controllers.locations.getAll, requiredRole: "viewer" },
  { method: "get", url: "locations/:id", cb: controllers.locations.getById, requiredRole: "viewer" },
  { method: "post", url: "locations", cb: controllers.locations.create, requiredRole: "editor" },
  { method: "put", url: "locations/:id", cb: controllers.locations.updateById, requiredRole: "editor" },
  { method: "delete", url: "locations/:id", cb: controllers.locations.deleteById, requiredRole: "editor" },

  // Countries Access Methods
  { method: "get", url: "countries", cb: controllers.countries.getAll, requiredRole: "viewer" },
  { method: "get", url: "countries/:id", cb: controllers.countries.getById, requiredRole: "viewer" },
  { method: "post", url: "countries", cb: controllers.countries.create, requiredRole: "editor" },
  { method: "put", url: "countries/:id", cb: controllers.countries.updateById, requiredRole: "editor" },
  { method: "delete", url: "countries/:id", cb: controllers.countries.deleteById, requiredRole: "editor" },

  // Users Access Methods
  { method: "post", url: "users/login", cb: controllers.users.login },
  { method: "get", url: "users", cb: controllers.users.getAll, requiredRole: "admin" },
  { method: "get", url: "users/:id", cb: controllers.users.getUserById, requiredRole: "admin" },
  { method: "post", url: "users", cb: controllers.users.create, requiredRole: "admin" },
  { method: "put", url: "users/:id", cb: controllers.users.updateById, requiredRole: "admin" },
  { method: "delete", url: "users/:id", cb: controllers.users.deleteById, requiredRole: "admin" },

].forEach(({ method, url, checkedRole, cb }) => {
  app[method](apiUrl(url), checkRole(checkedRole), cb);
});

app.listen(config.port, () => {
  console.log(`api is listening on port ${config.port}!`);
});
