const services = require("../services");

module.exports = {
  getAll: async (req, res) => {
    try {
      const countries = await services.countries.getAll();
      res.status(200).send(countries);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const country = await services.countries.getById(req.params.countryId);
      if (!country) {
        res.status(404).send({ error: "Country not found" });
      } else {
        res.status(200).send(country);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { country } = req.body;
      const newCountry = await services.countries.create({ country });
      res.status(201).send(newCountry);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },

  updateById: async (req, res) => {
    try {
      const { country } = req.body;
      const updatedCountry = await services.countries.updateById(
        req.params.countryId,
        { country }
      );
      if (!updatedCountry) {
        res.status(404).send({ error: "Country not found" });
      } else {
        res.status(200).send(updatedCountry);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteById: async (req, res) => {
    try {
      const deletedCountry = await services.countries.deleteById(req.params.countryId);
      if (!deletedCountry) {
        res.status(404).send({ error: "Country not found" });
      } else {
        res.sendStatus(204);
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};
