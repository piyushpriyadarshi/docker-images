import cp from 'child_process';
import os from 'os';
import dotenv from 'dotenv';
import ejs from 'ejs';
import sgmail from'@sendgrid/mail';
import diskspace from './discspace/index.js';
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
        cp.exec(`"./src/backup_scripts/mysql_docker.sh" ${process.env.DATABASE_PASSWORD}`, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else{
                resolve("Database Backup Completed")
            }
        });
    })
}

function getMemoryFootPrints(){
    return new Promise((resolve,reject)=>{
        const memory={
            cpuCount:os.cpus().length,
            totalMemory:os.totalmem()/(1024*1024*1024) +"GB",
            freeMemory:os.freemem()/(1024*1024*1024) +"GB",
            upTime : os.uptime()/(60*60) +"HR",
        }
        resolve(memory)
    })
}

function getDiskInfo(){
    return new Promise((resolve,reject)=>{
       diskspace('/',(err,info)=>{
            console.log(info);
       });
    })
}

async function getFrontendStatus(){
    return new Promise((resolve,reject)=>{
       
    })
}

async function getBackendStatus(){
    return new Promise((resolve,reject)=>{
        
    })
}
async function startProcess(){
    try {
        //start mysql backup
        // const result = await takeMysqlBackup();
        // const result = await getMemoryFootPrints();
        // getDiskInfo();
        // console.log(result); 


        // const res=[{name:'Databases',status:'running'},{name:'Redis',status:'running'},{name:'Backend',status:'stoped'}]
        // const str= await ejs.renderFile('src/template/alert.ejs',{serviceArr:res});
        // console.log(str);

        sendAlertMail();
        
    } catch (error) {
        console.log(error);
    }
}

async function sendAlertMail(){
    const res=[{name:'Databases',status:'running'},{name:'Redis',status:'running'},{name:'Backend',status:'stoped'}]
    const htmlString= await ejs.renderFile('src/template/alert.ejs',{serviceArr:res});
    sgmail.setApiKey('');
    const msg = {
        to: 'piyush@piyushpriyadarshi.com', // Change to your recipient
        from: 'priyadarship4@gmail.com', // Change to your verified sender
        subject: 'Servers Alert ',
        html: htmlString,
      }
      sgmail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
}



startProcess();