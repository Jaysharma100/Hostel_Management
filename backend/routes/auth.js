import express from 'express'
import {register,login,verify, addroomapi, findroom, findhostel, updatehostel, updateprofile, finduser, updateroom, announcement, complaints_reply, hostelfetch, measureMONGODB_time, measureRedisTime, lockroom, bookroom, leaveroom, downloadexcel } from '../controllers/Auth.js'
import upload from '../utils/multer.js'

const Authroutes=express.Router()

Authroutes.post('/signup',upload.single('avatar'),register);
Authroutes.post('/login',login);
Authroutes.post('/verify',verify)
Authroutes.post('/addrooms',addroomapi)
Authroutes.post('/findroom',findroom)
Authroutes.post('/findhostel',findhostel)
Authroutes.patch('/updatehostel',updatehostel)
Authroutes.patch('/updateprofile',upload.single('avatar'),updateprofile);
Authroutes.post('/finduser',finduser)
Authroutes.post('/updateroom',updateroom)
Authroutes.post('/announcement',announcement)
Authroutes.post('/complaints_reply',complaints_reply)
Authroutes.get('/hostelfetch',hostelfetch)
Authroutes.post('/measure_MONGODB_time',measureMONGODB_time)
Authroutes.post('/measure_REDIS_time',measureRedisTime)
Authroutes.post('/lockroom',lockroom)
Authroutes.post('/bookroom',bookroom)
Authroutes.post('/leaveroom',leaveroom)
Authroutes.get('/download-excel',downloadexcel)

export default Authroutes