const services = require("../services");
const jwt = require("jsonwebtoken");

module.exports = {
  getAll: async (req, res) => {
    try {
      const users = await services.users.getAll();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await services.users.getById(req.params.id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  },

  create: async (req, res) => {
    try {
      const { username, password, role } = req.body;

      const newUser = await services.users.create({
        username,
        password,
        role,
      });

      res.status(201).send(newUser);
    } catch (error) {
      res.status(400).send({ error: "Bad Request" });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await services.users.getByUsername(username);
      if (!user) {
        return res.status(401).send({ error: "Unauthorized: Invalid username or password" });
      }

      if (user.password !== password) {
        return res.status(401).send({ error: "Unauthorized: Invalid username or password" });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).send({ token });
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  },

  updateById: async (req, res) => {
    try {
      const { username, password, role } = req.body;
  
      const updatedUser = await services.users.updateById(req.params.id, {
        username,
        password,
        role,
      });
  
      if (!updatedUser) {
        res.status(404).send({ error: "User not found" });
      } else {
        res.status(200).send(updatedUser);
      }
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  },
  
  deleteById: async (req, res) => {
    try {
      const deletedUser = await services.users.deleteById(req.params.id);
      if (!deletedUser) {
        res.status(404).send({ error: "User not found" });
      } else {
        res.sendStatus(204);
      }
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  },


};
