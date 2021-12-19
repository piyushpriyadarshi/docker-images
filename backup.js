import cp from 'child_process';

cp.exec('"./mysql_docker.sh" PNYpny29@12345',function(err, stdout, stderr) {
    // handle err, stdout, stder
 console.log(stdout);
            console.log(stderr);
            if (err !== null) {
                console.log(`exec error: ${err}`);
            }
});
