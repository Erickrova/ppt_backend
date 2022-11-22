import express from "express"
import { createRoom, deleteRoom, deleteUser, getRoom, joinRoom } from "../controller/roomController.js"

const router = express.Router()

router.get("/:id",getRoom)
router.get("/create/:id/:user",createRoom)
router.get("/join/:id/:user",joinRoom)
router.delete("/delete/:id",deleteRoom)
router.delete("/deleteuser/:id/:user",deleteUser)

export default router