import { app } from "./app.js";
import connectDb from "./db/connectDb.js";
import dotenv from "dotenv";
dotenv.config();

connectDb()
  .then(() => {
    const PORT = process.env.PORT || 4080;
    app.listen(PORT, () => {
      console.log(`The server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while running the server:", err);
  });
