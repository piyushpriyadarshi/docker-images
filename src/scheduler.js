import nodeCron from "node-cron";
import { checkSatatusAndSendAlert } from "./jobs/checkServicesOnlineStatus.js";
import takeMysqlBackup from "./jobs/Mysqlbackup.js";


nodeCron.schedule('0 0 */6 * * *',()=>{
    checkSatatusAndSendAlert();
});

nodeCron.schedule('0 0 4 * * *',()=>{
    takeMysqlBackup();
});