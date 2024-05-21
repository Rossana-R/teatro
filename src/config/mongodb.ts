import mongoose from "mongoose";
import { MONGO_URI } from "../constant";

function initMongoDB() {
  console.log(`URI`, MONGO_URI);
  mongoose
    .connect(
      `${MONGO_URI}`,
      { useNewUrlParser: true }
    )
    .then(() => {
      console.log("Success connect to MongoDB"); // tslint:disable-line
      // callback();
    })
    .catch((err) => {
      console.log(`Failed connect to MongoDB cause => ${err}`); // tslint:disable-line
      process.exit(0);
    });
}
export default initMongoDB;
