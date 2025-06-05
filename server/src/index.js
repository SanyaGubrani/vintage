import { app } from "./app.js";
import { server } from "./utils/soket.js";
import connectDb from "./db/connectDb.js";
import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

connectDb()
  .then(() => {
    const PORT = process.env.PORT || 4080;
    server.listen(PORT, () => {
      console.log(`The server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(
      "Failed to start server due to database connection error:",
      error
    );
  });
