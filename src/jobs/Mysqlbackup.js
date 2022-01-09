import cp from "child_process";

export default async function takeMysqlBackup() {
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