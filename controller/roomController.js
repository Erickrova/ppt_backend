import Room from "../models/Room.js";

const getRoom = async (req,res) =>{
    const {id} = req.params
    const room = await Room.findOne({room:id})
    if(!room){
        const error = new Error("room not found")
        return res.status(404).json({msg:error.message})
    }
    return res.json(room)
}
const createRoom = async (req,res) => {
    const {id} = req.params
    const {user} = req.params
    console.log(id,user)
    const room = await Room.findOne({room:id})
    if(room){
        const error = new Error("this room already exists")
        return res.status(404).json({msg:error.message})
    }
    try {
        const roomCreated = await Room.create({})
        roomCreated.room = id
        roomCreated.users.push(user)
        await roomCreated.save()
        return res.json(roomCreated) 
    } catch (error) {
        console.log(error)
        console.log("error aqui")
    }
}
const joinRoom = async (req,res)=>{
    const {id} = req.params
    const {user} = req.params
    const room = await Room.findOne({room:id})
    if(!room){
        const error = new Error("this room dont exists")
        return res.status(404).json({msg:error.message})
    }
    try {
        if(!room.users.includes(user)){
            room.users.push(user)
        }
        await room.save()
        return res.json(room) 
    } catch (error) {
        console.log(error)
    }
}

export{
    getRoom,
    createRoom,
    joinRoom
}