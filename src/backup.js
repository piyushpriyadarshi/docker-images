import dotenv from "dotenv";
dotenv.config();
import './scheduler.js';

async function startProcess() {
  try {
      console.log("Bacup Scripts Running in Backgroun...");
  } catch (error) {
    console.log(error);
  }
}
startProcess();

