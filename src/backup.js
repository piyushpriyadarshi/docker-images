import cp from "child_process";
import os from "os";
import dotenv from "dotenv";
import ejs from "ejs";
import sgmail from "@sendgrid/mail";
import diskspace from "./discspace/index.js";
import { checkOnlineStatus, getData } from "./utils/apiUtils.js";
import cron from "node-cron";
import { sendAlertMail } from "./mailer/mailUtils.js";
dotenv.config();

// console.log(process.env.DATABASE_PASSWORD);
// cp.exec(`"./src/backup_scripts/mysql_docker.sh" ${process.env.DATABASE_PASSWORD}`, function (err, stdout, stderr) {
//     // handle err, stdout, stder
//     console.log(stdout);
//     console.log(stderr);
//     if (err !== null) {
//         console.log(`exec error: ${err}`);
//     }
// });

function takeMysqlBackup() {
  return new Promise((resolve, reject) => {
    console.log(process.env.DATABASE_PASSWORD);
    cp.exec(
      `"./src/backup_scripts/mysql_docker.sh" ${process.env.DATABASE_PASSWORD}`,
      function (err, stdout, stderr) {
        if (err) {
          reject(err);
        } else {
          resolve("Database Backup Completed");
        }
      }
    );
  });
}

function getMemoryFootPrints() {
  return new Promise((resolve, reject) => {
    const memory = {
      cpuCount: os.cpus().length,
      totalMemory: os.totalmem() / (1024 * 1024 * 1024) + "GB",
      freeMemory: os.freemem() / (1024 * 1024 * 1024) + "GB",
      upTime: os.uptime() / (60 * 60) + "HR",
    };
    resolve(memory);
  });
}

function getDiskInfo() {
  return new Promise((resolve, reject) => {
    diskspace("/", (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

async function getFrontendStatus() {
  return new Promise((resolve, reject) => {
    checkOnlineStatus("https://staging.awsomecoders.com/", "Frontend")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

async function getBackendStatus() {
  return new Promise((resolve, reject) => {
    checkOnlineStatus("https://stagingapi.awsomecoders.com/", "Backend")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

async function getCMSStatus() {
  return new Promise((resolve, reject) => {
    checkOnlineStatus("https://stagingcms.awsomecoders.com", "CMS")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}
async function startProcess() {
  try {
    //start mysql backup
    // const result = await takeMysqlBackup();
    // const result = await getMemoryFootPrints();
    // getDiskInfo();
    // console.log(result);

    // const res=[{name:'Databases',status:'running'},{name:'Redis',status:'running'},{name:'Backend',status:'stoped'}]
    // const str= await ejs.renderFile('src/template/alert.ejs',{serviceArr:res});
    // // console.log(str);
    // const transporter = nodemailer.createTransport(smtpTransport({
    //     service: 'gmail',
    //     host: 'smtp.gmail.com',
    //     auth: {
    //       user: 'awsomecoders@gmail.com',
    //       pass: 'PIYpiy29@123'
    //     }
    //   }));
    //   const res=[{name:'Databases',status:'running'},{name:'Redis',status:'running'},{name:'Backend',status:'stoped'}]
    //   const htmlString= await ejs.renderFile('src/template/alert.ejs',{serviceArr:res});
    // sendAlertMail(transporter,'Staging Server Alert'+new Date().toISOString(),htmlString);
    const promises = [
      getCMSStatus(),
      getBackendStatus(),
      getFrontendStatus(),
      getMemoryFootPrints(),
      getDiskInfo(),
    ];
    Promise.allSettled(promises).then((results) => {
      results.forEach((result) => console.log(result));
    });
  } catch (error) {
    console.log(error);
  }
}

async function checkSatatusAndSendAlert() {
  const promises = [
    getCMSStatus(),
    getBackendStatus(),
    getFrontendStatus(),
    getMemoryFootPrints(),
  ];
  Promise.allSettled(promises).then(async (results) => {
    const failedServices = [];
    const allGoodServices = [];
    results.forEach((result) =>
      result.status === "fulfilled"
        ? allGoodServices.push(result)
        : failedServices.push(result)
    );

    console.log(allGoodServices);
    const htmlString = await ejs.renderFile("src/template/alert.ejs", {
      serviceArr: allGoodServices,
    });
    const subject =
      "Hourly Staging Server Status Alert " +
      new Date().toLocaleTimeString({ timezone: "Asia/Kolkata" });
    sendAlertMail(subject, htmlString)
      .then((data) => {
        console.log("Mail Sent");
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

startProcess();

//Run this task Every Day at 1:00 AM in the night in IST Time.
// cron.schedule(
//   "0 1 * * *",
//   () => {
//     console.log("running a task every Hour");

//   }
// );

//Run this task every 6 hours.
// cron.schedule("*/6 * * *", () => {
//   console.log("running a task every minute");
// });

//Run this task every 6 hours every Day.
cron.schedule(
  "0 12 */6 * * *",
  () => {
    console.log("Running this task Every 6 Hours at 10 minutes and 0 Seconds");
    console.log(new Date().toLocaleTimeString());
    checkSatatusAndSendAlert();
  },
  { scheduled: true, timezone: "Asia/Kolkata" }
);

//Run this Task Every Day at 2:10:00 IST
cron.schedule(
  "0 0 4 * * *",
  () => {
    console.error("Running this task Every Day at 4:00:00 AM IST ");
  },
  { scheduled: true, timezone: "Asia/Kolkata" }
);
