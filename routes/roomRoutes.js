import express from "express"
import { createRoom, getRoom, joinRoom } from "../controller/roomController.js"

const router = express.Router()

router.get("/:id",getRoom)
router.get("/create/:id/:user",createRoom)
router.get("/join/:id/:user",joinRoom)

export default router