import os from "os";
import ejs from "ejs";
import diskscape from "../discspace/index.js";
import { checkOnlineStatus } from "../utils/apiUtils.js";
import { sendAlertMail } from "../mailer/mailUtils.js";

export async function checkSatatusAndSendAlert() {
  const promises = [
    getCMSStatus(),
    getBackendStatus(),
    getFrontendStatus(),
    getMemoryFootPrints(),
  ];
  Promise.allSettled(promises).then(async (results) => {
    let failedServices = [];
    const allGoodServices = [];
    results.forEach((result) =>
      result.status === "fulfilled"
        ? allGoodServices.push(result)
        : failedServices.push(result)
    );
    console.log(failedServices);
    failedServices = failedServices.map((service) => {
      return { status: service.status, value: service.reason };
    });

    const htmlString = await ejs.renderFile("src/template/alert.ejs", {
      serviceArr: [...failedServices, ...allGoodServices],
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
    checkOnlineStatus("https://staging.awsomecoders.com", "Frontend")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

async function getBackendStatus() {
  return new Promise((resolve, reject) => {
    checkOnlineStatus("https://stagingapi.awsomecoders.com/api/v1", "Backend")
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
