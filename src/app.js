import express from 'express'
import connectDB from "./utils/db.js";
import contactRoutes from "./routes/contactRoutes.js";


const app = express();

app.use(express.json())

app.use('/contacts', contactRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  });
  

connectDB();

export default app