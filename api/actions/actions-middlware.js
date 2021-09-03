const Actions = require("./actions-model");

async function validateActionsId(req, res, next) {
  try {
    const actions = await Actions.get(req.params.id);
    if (!actions) {
      res.status(404).json({ message: "Action with requested id not found" });
    } else {
      req.actions = actions;
      next();
    }
  } catch (err) {
    res.status(500).json({ message: "Problem finding actions" });
  }
}
module.exports = validateActionsId;
