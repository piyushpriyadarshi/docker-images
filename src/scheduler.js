import nodeCron from "node-cron";
import { checkSatatusAndSendAlert } from "./jobs/checkServicesOnlineStatus.js";
import takeMysqlBackup from "./jobs/Mysqlbackup.js";


nodeCron.schedule('0 02 10 * * *',()=>{
    checkSatatusAndSendAlert();
});

nodeCron.schedule('0 32 10 * * *',()=>{
    takeMysqlBackup();
});