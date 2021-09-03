const express = require("express");
const { validateProjectId, validateProject } = require("./projects-middleware");
const router = express.Router();

const Project = require("./projects-model");

router.get("/", (req, res) => {
  Project.get()
    .then((projects) => {
      if (!projects) {
        res.status(200).json([]);
      } else {
        res.status(200).json(projects);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Unable to locate Projects", err: err.message });
    });
});

router.get("/:id", validateProjectId, (req, res) => {
  res.json(req.project);
});

router.post("/", (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400).json({ message: "Missing required fields" });
  } else {
    Project.insert(req.body)
      .then((newProject) => {
        res.status(201).json(newProject);
      })
      .catch(() => {
        res.status(500).json({ message: "Unable to create new project" });
      });
  }
});

router.put("/:id", validateProjectId, (req, res) => {
  const { name, description, completed } = req.body;
  if (!name || !description || completed == null) {
    res.status(400).json({ message: "Missing required fields" });
  } else {
    Project.update(req.params.id, req.body).then(() => {
      res.status(200).json(req.body);
    });
  }
});

router.delete("/:id", validateProjectId, async (req, res, next) => {
  try {
    await Project.remove(req.params.id);
    res.json(req.project);
  } catch (err) {
    next(err);
  }
});
router.get("/:id/actions", validateProjectId, async (req, res, next) => {
  try {
    const result = await Project.getProjectActions(req.params.id);
    res.json(result);
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
