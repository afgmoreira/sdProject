const services = require("../services");

module.exports = {
  getAll: async (req, res) => {
    try {
      const circuits = await services.circuits.getAll();
      res.status(200).send(circuits);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const circuit = await services.circuits.getById(req.params.id);
      if (!circuit) {
        res.status(404).send({ error: "Circuit not found" });
      } else {
        res.status(200).send(circuit);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { circuit_ref, name, lat, lng, alt, url } = req.body;
      const newCircuit = await services.circuits.create({
        circuit_ref,
        name,
        lat,
        lng,
        alt,
        url,
      });
      res.status(201).send(newCircuit);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  updateById: async (req, res) => {
    try {
      const { circuit_ref, name, lat, lng, alt, url } = req.body;
      const updatedCircuit = await services.circuits.updateById(req.params.id, {
        circuit_ref,
        name,
        lat,
        lng,
        alt,
        url
      });
      if (!updatedCircuit) {
        res.status(404).send({ error: "Circuit not found" });
      } else {
        res.status(200).send(updatedCircuit);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteById: async (req, res) => {
    try {
      const deletedCircuit = await services.circuits.deleteById(req.params.id);
      if (!deletedCircuit) {
        res.status(404).send({ error: "Circuit not found" });
      } else {
        res.sendStatus(204);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getLocationById: async (req, res) => {
    try {
      const location = await services.circuits.getLocationById(req.params.id);
      if (!location) {
        res.status(404).send({ error: "Circuit not found" });
      } else {
        res.status(200).send(location);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getCountryById: async (req, res) => {
    try {
      const country = await services.circuits.getCountryById(req.params.id);
      if (!country) {
        res.status(404).send({ error: "Circuit not found" });
      } else {
        res.status(200).send(country);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};
