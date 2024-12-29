import express from 'express'
import {register,login,verify, addroomapi, findroom, findhostel, updatehostel, updateprofile, finduser, updateroom, announcement, complaints_reply, hostelfetch } from '../controllers/Auth.js'
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
Authroutes.get('/hostelfetch',hostelfetch);


export default Authroutes