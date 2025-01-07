import {createClient} from 'redis'
import fs from 'fs'
import path from 'path';
import docker from 'dockerode'


interface lang{
    lang:string,
    extension:string,
    image:string
}

const language=[{lang:'javascript',extension:'js',image:'node:alpine',cmd:'node'},{lang:'c++',extension:'cpp',cmd:'g++',image:'gcc'}]
const newdocker= new docker();

async function CreateDockerContainer ({code,codelang}:{code:string,codelang:string}){


const languageDetails=language.find((language:lang)=>language.lang===codelang)
if(!languageDetails){return console.log('language not supported')}


    const filepath=path.join(__dirname,'usercode')
    fs.mkdirSync(filepath,{recursive:true})
    fs.writeFileSync(path.join(filepath,`main.`+ languageDetails.extension),code)



    try{



       const isolatedContainer= await newdocker.createContainer({Image:languageDetails.image,Cmd:[languageDetails.cmd,`/usercode/main.${languageDetails.extension}`],HostConfig:{Binds:[ `${filepath}:/usercode`]}})
console.log(isolatedContainer.id)

await isolatedContainer.start()


    const stream = await isolatedContainer.logs({
        stdout: true,
        stderr: true,
        follow: true,
      });
    
    
    let output = "";
    stream.on("data", (chunk) => {
        console.log(chunk.toString())
      output += chunk.toString();
    });
    
    stream.on("end",async()=>{
    console.log(output)
    await isolatedContainer.remove();
    })


    }catch(e){
       console.log(e)
        console.log('error in creating container')
    }


}


 CreateDockerContainer({code:'#include <iostream> int main() {std::cout << "Hello, World from Docker!" << std::endl ; return 0;}',codelang:'c++'});





const client  =createClient();
client.on('error', (err) => {console.log(err)});
function delay() {
    return new Promise(resolve => setTimeout(resolve, 1000)); // Resolve after 1 second
  }

async function connect(){
    try{
        await client.connect();
        console.log('connected to redis server')
    }catch(e){
        console.log('error in connecting to redis server')
    }
}   
connect();

async function worker(){
    
    
    while(true){
        
        try{
            
            const data= await client.brPop('problems',0)
            console.log('recieved data',data)








            
            
        }catch(e){
            /// handle  error
            console.log('error in recieving data')
        }
        
        
    }
}

worker();