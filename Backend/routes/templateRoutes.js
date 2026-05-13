const router = require("express").Router();
const { getTemplates, createTemplate, getTemplate, deleteTemplate } = require("../controllers/templateController");
const auth = require("../middleware/auth");

router.get("/", auth, getTemplates);
router.post("/", auth, createTemplate);
router.get("/:id", auth, getTemplate);
router.delete("/:id", auth, deleteTemplate);

module.exports = router;
