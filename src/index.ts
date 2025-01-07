import express from 'express';
import {createClient} from 'redis'
const redis = createClient();
redis.on('error', (err) => {err});
const app = express();
const port = 3000;
app.use(express.json());
const questionid=454

async function startservers(){
try{
    await redis.connect();
    
    console.log('connected to redis server')

}catch(e){
    console.log('error in connecting to redis server')

}
try{
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

}catch(e){
console.log('error in starting server')
}


while(true){
    
    try{

         await    redis.lPush('problems',JSON.stringify({questionid}))
        
}catch(e){
    console.log('error in pushing data')

}

await new Promise(resolve => setTimeout(resolve, 1000)); // Resolve after 1 second


}}

startservers();


app.get('/submission', (req, res) => {


    const {questionid,code,language}=req.body


    try{


        redis.lPush('problems',JSON.stringify({questionid,code,language}))
        console.log('submitted')
        res.send('submitted')
    }catch(e){
        console.log('eroor in publishing')
    }

})
