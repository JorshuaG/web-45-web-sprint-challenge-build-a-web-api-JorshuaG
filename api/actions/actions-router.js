const express = require("express");
const router = express.Router();
const validateActionsId = require("./actions-middlware.js");

const Actions = require("./actions-model");

router.get("/", (req, res) => {
  Actions.get()
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch(() => {
      res.status(500).json([]);
    });
});

router.get("/:id", validateActionsId, (req, res) => {
  res.status(200).json(req.action);
});

router.post("/", (req, res) => {
  const { notes, description, project_id } = req.body;
  if (!notes || !description || !project_id) {
    res
      .status(400)
      .json({ message: "Please provide notes and a description." });
  } else {
    Actions.insert(req.body)
      .then((action) => {
        res.status(201).json(action);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There was an error saving the action to the database",
        });
      });
  }
});

router.put("/:id", validateActionsId, (req, res, next) => {
  const { notes, description, project_id, completed } = req.body;
  if (!notes || !description || !project_id || completed == null) {
    res.status(400).json({ message: "Missing required fields" });
  } else {
    Actions.update(req.params.id, req.body)
      .then(() => {
        res.status(200).json(req.body);
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.delete("/:id", validateActionsId, async (req, res, next) => {
  try {
    await Actions.remove(req.params.id);
    res.json(req.actions);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: "Something went wrong",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
