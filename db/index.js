import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB = path.join(__dirname, "db.json");

app.get("/debt", (_, res) => {
  const dbFile = fs.readFileSync(DB, "utf-8");
  const dbData = JSON.parse(dbFile);
  res.send(dbData);
});

app.post("/debt", (req, res) => {
  const data = req.body;
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
  res.status(200).send(data);
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
