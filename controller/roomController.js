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
    }
}
const joinRoom = async (req,res)=>{
    const {id} = req.params
    const {user} = req.params
    const room = await Room.findOne({room:id})
    if(!room){
        const error = new Error("esta sala no existe")
        return res.status(404).json({msg:error.message})
    }
    if(room.users.length >= 2){
        const error = new Error("ya hay 2 usuarios en esta sala")
        return res.status(400).json({msg:error.message})
    }
    if(room.users.includes(user)){
        const error = new Error("ya hay un usuario con este nombre en esta sala")
        return res.status(400).json({msg:error.message})
    }
    
    try {
        if(!room.users.includes(user)){
            room.users.push(user)
        }
        await room.save()
        return res.json(room) 
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg:"ocurrió un error"})
    }
}

const deleteRoom = async (req,res) =>{
    const {id} = req.params
    const room = await Room.findOne({room:id})
    if(!room){
        const error = new Error("Room not found")
        return res.status(404).json({msg:error.message})
    }
    try{
        await room.deleteOne()
        return res.json({msg:"Room Eliminada"})
    }catch(error){
        console.log(error)
    }
}
const deleteUser = async (req,res) =>{
    const {id,user} = req.params
    const room = await Room.findOne({room:id})
    if(!room){
        const error = new Error("Room not found")
        return res.status(404).json({msg:error.message})
    }
    try{
        room.users = room.users.filter(us => us != user)
        await room.save()
        return res.json({msg:"usuario eliminado"})
    }catch(error){
        console.log(error)
    }
}

export{
    getRoom,
    createRoom,
    joinRoom,
    deleteRoom,
    deleteUser
}