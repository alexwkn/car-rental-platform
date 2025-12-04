import express from "express";
import {default as Router} from "./API/routes/index.js";
import cors from "cors";
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors()); 
app.use(Router);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});