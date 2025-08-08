
// import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();
// import './Models/db.js';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import AuthRouter from './Routers/AuthRouter.js'
// import taskRoutes from "./Routers/taskRoutes.js";
// import questionRoutes from "./Routers/questionRoutes.js";
// // import ProductRouter from './Routers.js/ProductRouter.js'

// const app = express();

// // middle ware
// app.use(bodyParser.json());
// app.use(cors());
// // ********************* Auth Routes *******************************
// app.use('/auth',AuthRouter )
// // ********************** Crud Route ************************************
// app.use("/tasks", taskRoutes);
// // ********************** Questions routes ************************************
// app.use("/api/question", questionRoutes);

// // ****************************App executing******************************
// const Port = process.env.PORT;
// app.get('/', (req,res)=>{
//   res.send("settttttttUpppppppp")
// })
// app.listen(Port, ()=>{
//   console.log("AP working")
// })


// server.js
// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import hijabRoutes from "./Routers/hijabRoutes.js"; // 👈 yeh import karo
import AuthRouter from './Routers/AuthRouter.js'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Mount the route here
app.use("/api/styles", hijabRoutes); // 👈 /api/styles se hit hoga
app.use('/auth',AuthRouter )

mongoose.connect(process.env.MongoConnect)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));
  // / const Port = process.env.PORT;
app.get('/', (req,res)=>{
  res.send("settttttttUpppppppp")
})

app.listen(process.env.PORT || 3004, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3004}`);
});
