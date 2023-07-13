const services = require("../services");

module.exports = {
  getAll: async (req, res) => {
    try {
      const locations = await services.locations.getAll();
      res.status(200).send(locations);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const location = await services.locations.getById(req.params.locationId);
      if (!location) {
        res.status(404).send({ error: "Location not found" });
      } else {
        res.status(200).send(location);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { location } = req.body;
      const newLocation = await services.locations.create({ location });
      res.status(201).send(newLocation);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  updateById: async (req, res) => {
    try {
      const { location } = req.body;
      const updatedLocation = await services.locations.updateById(
        req.params.locationId,
        { location }
      );
      if (!updatedLocation) {
        res.status(404).send({ error: "Location not found" });
      } else {
        res.status(200).send(updatedLocation);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteById: async (req, res) => {
    try {
      const deletedLocation = await services.locations.deleteById(req.params.locationId);
      if (!deletedLocation) {
        res.status(404).send({ error: "Location not found" });
      } else {
        res.sendStatus(204);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};
