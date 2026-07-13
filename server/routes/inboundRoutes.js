const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const inboundController = require("../controllers/inboundController");

router.get("/", auth, inboundController.getInbound);
router.get("/:id", auth, inboundController.getInboundById);
router.post("/", auth, inboundController.createInbound);
router.put("/:id", auth, inboundController.updateInbound);
router.delete("/:id", auth, inboundController.deleteInbound);

module.exports = router;