import express from "express"
import dotenv from "dotenv"
import conectDB from "./config/db.js"
import cors from "cors"
import {Server} from "socket.io"
import roomRoutes from "./routes/roomRoutes.js"
import axios from "axios"

const app = express()
dotenv.config()
conectDB()
app.use(express.json())
const whiteList = [process.env.FRONTEND_URL]
app.use(cors({origin:whiteList}))

const PORT = process.env.PORT || 4000


app.use("/api/room",roomRoutes)


const server = app.listen(PORT,()=>{
    console.log("server on port 4000 url: http://localhost:4000")
})

const io = new Server(server,{
    pingTimeout: 60000,
    cors: {
        origin: whiteList
    }
})

let usersOn = []

io.on("connection",socket =>{
    // console.log("on socket.io")
    socket.on("onRoom",data =>{
        socket.join(data.sala)
        if(![data.usuario,data.sala].includes("")){
            if(usersOn.some(sala => sala.nombre === data.sala)){
                let salaAgregar = usersOn.filter(sala => sala.nombre === data.sala)[0]
                let salasSinSalaAgregar = usersOn.filter(sala => sala.nombre !== data.sala)
                if(!salaAgregar.usuarios?.includes(data.usuario)){
                    salaAgregar.usuarios.push(data.usuario)
                }
                salasSinSalaAgregar.push(salaAgregar)
                usersOn = salasSinSalaAgregar
                // console.log("sala creada",salaAgregar)
            }else{
                usersOn.push({nombre:data.sala,usuarios:[data.usuario]})
                // console.log("creando sala",{nombre:data.sala,usuarios:[data.usuario]})
            }
        }
        socket.data.username = data
        let users = usersOn.filter(room => room.nombre === data.sala)[0]
        socket.to(data.sala).emit("usersOn",users?.usuarios)
        // console.log(users.usuarios)
        // console.log(`${data.usuario} on room ${data.sala}`)
    })
    socket.on("disconnect",async ()=>{
        const data = socket.data.username
        if(data?.sala){
            let room = usersOn.filter(room => room.nombre == data.sala)[0]
            let rooms = usersOn.filter(room => room.nombre != data.sala)
            if(room?.usuarios){
                room.usuarios = room?.usuarios?.filter(user => user != data.usuario)
            }
            if(room?.usuarios.length > 0){
                rooms.push(room)
            }else{
                try {
                    await axios.delete(`${process.env.BACKEND_URL}/api/room/delete/${room.nombre}`)
                } catch (error) {
                }
            }
            usersOn = rooms
            socket.to(data.sala).emit("leaveUser",room?.usuarios)
            // console.log(usersOn)

        }
        // else{
        //     console.log("no hay usuario")   
        // }
    })
    socket.on("leaveroom",data =>{
        if(data?.sala){
            let room = usersOn.filter(room => room.nombre == data.sala)[0]
            let rooms = usersOn.filter(room => room.nombre != data.sala)
            if(room?.usuarios){
                room.usuarios = room?.usuarios?.filter(user => user != data.usuario)
            }
            if(room?.usuarios.length > 0){
                rooms.push(room)
            }
            usersOn = rooms
            socket.to(data.sala).emit("leaveUser",room?.usuarios)
            // console.log(usersOn)

        }
        // else{
        //     console.log("no hay usuario")   
        // }
    })
    socket.on("startRound",(data)=>{
        socket.to(data.sala).emit("roundStarted",data.ronda)
    })
    socket.on("revancha",data =>{
        socket.to(data).emit("startingRevancha")
    })
    socket.on("contador",data =>{
        const contador = (data.contador - 1)
        socket.to(data.sala).emit("contando",contador)
    })
    socket.on("eligiendo",data=>{
        socket.to(data.sala).emit("eleccion",data)
    })
    socket.on("getRoom",data=>{
        let room = usersOn.filter(room => room.nombre == data)[0]
        socket.emit("room",room)
    })

})