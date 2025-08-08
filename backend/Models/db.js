import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongo_url = process.env.MongoConnect

mongoose.connect(mongo_url)
.then(()=>{console.log("Mongo db connects")})
.catch((err)=>console.log(err.message))

