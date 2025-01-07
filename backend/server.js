import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import dbconnect from './utils/db.js'
import Authroutes from './routes/auth.js'
dotenv.config()

import redis from './utils/redis.js'
dbconnect()

const app=express()
const PORT=process.env.PORT || 3000;
 
app.use(express.json())
app.use(cors())

app.use('/avatars', express.static(path.join(process.cwd(), 'avatars')))

app.use('/api/auth',Authroutes)

app.get('/',(req,res)=>{
    res.send('test')
})

app.listen(PORT,()=>{
    console.log(`server is walking on port ${PORT}`)
})