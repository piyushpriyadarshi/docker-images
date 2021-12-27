import axios from "axios";

export const getData = async (url) => {
  const response = await axios.get(url);
  console.log(response.status);
  console.log(response.data);
};

export const checkOnlineStatus = async (url,serviceName) => {
    return new Promise((resolve,reject)=>{
        axios.get(url)
        .then((response)=>{
            switch(parseInt(response.status)){
                case 200:
                    resolve(new CreateResponse(serviceName,'Running'));
                    break;
                case 500:
                    reject(new CreateResponse(serviceName,'Stopped'));
                    break;
                default:
                    reject(new CreateResponse(serviceName,'Stopped'))
            }
        })
        .catch((error)=>{
            reject(new CreateResponse(serviceName,'Stopped'));
        })
    })
};


function CreateResponse(serviceName,status){
    this.serviceName=serviceName;
    this.status=status;
}