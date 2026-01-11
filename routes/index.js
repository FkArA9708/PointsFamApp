
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const tasksController = require("../controllers/tasksController");
const prizesController = require("../controllers/prizesController");
const messagesController = require("../controllers/messagesController");

router.get("/", usersController.showLogin);
router.post("/login", usersController.login);
router.get("/task/edit/:id", usersController.ensureAuth, tasksController.showEditTaskForm);
router.post("/task/edit/:id", usersController.ensureAuth, tasksController.editTask);
router.get("/dashboard", usersController.ensureAuth, tasksController.dashboard);
router.post("/task/add", usersController.ensureAuth, tasksController.addTask);
router.post("/task/complete/:id", usersController.ensureAuth, tasksController.completeTask);
router.post("/task/approve/:id", usersController.ensureAuth, tasksController.approveTask);
router.post("/task/delete/:id", usersController.ensureAuth, tasksController.deleteTask);
router.post("/points/add", usersController.ensureAuth, usersController.addPoints);
router.post("/prizes/add", usersController.ensureAuth, prizesController.addPrize);
router.post("/prizes/edit/:index", usersController.ensureAuth, prizesController.editPrize);
router.post("/prizes/delete/:index", usersController.ensureAuth, prizesController.deletePrize);
router.post("/prizes/redeem", usersController.ensureAuth, tasksController.redeemPrize);
router.get("/prizes", usersController.ensureAuth, tasksController.showPrizes);

router.post("/messages", usersController.ensureAuth, messagesController.sendMessage);
router.post("/messages/cross-family", usersController.ensureAuth, messagesController.sendCrossFamilyMessage);
router.get("/messages", usersController.ensureAuth, messagesController.showMessages);



module.exports = router;