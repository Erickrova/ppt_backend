import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    room: {
        type:String,
        unique: true,
        trim: true
    },
    users:[
        {
            type:String,
            unique: true,
            trim: true
        }
    ]
})

const Room = mongoose.model("Room",roomSchema)

export default Room