"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dockerode_1 = __importDefault(require("dockerode"));
const language = [{ lang: 'javascript', extension: 'js', image: 'node:alpine', cmd: 'node' }, { lang: 'c++', extension: 'cpp', cmd: 'g++', image: 'gcc' }];
const newdocker = new dockerode_1.default();
function CreateDockerContainer(_a) {
    return __awaiter(this, arguments, void 0, function* ({ code, codelang }) {
        const languageDetails = language.find((language) => language.lang === codelang);
        if (!languageDetails) {
            return console.log('language not supported');
        }
        const filepath = path_1.default.join(__dirname, 'usercode');
        fs_1.default.mkdirSync(filepath, { recursive: true });
        fs_1.default.writeFileSync(path_1.default.join(filepath, `main.` + languageDetails.extension), code);
        try {
            const isolatedContainer = yield newdocker.createContainer({ Image: languageDetails.image, Cmd: [languageDetails.cmd, `/usercode/main.${languageDetails.extension}`], HostConfig: { Binds: [`${filepath}:/usercode`] } });
            console.log(isolatedContainer.id);
            yield isolatedContainer.start();
            const stream = yield isolatedContainer.logs({
                stdout: true,
                stderr: true,
                follow: true,
            });
            let output = "";
            stream.on("data", (chunk) => {
                console.log(chunk.toString());
                output += chunk.toString();
            });
            stream.on("end", () => __awaiter(this, void 0, void 0, function* () {
                console.log(output);
                yield isolatedContainer.remove();
            }));
        }
        catch (e) {
            console.log(e);
            console.log('error in creating container');
        }
    });
}
CreateDockerContainer({ code: '#include <iostream> int main() {std::cout << "Hello, World from Docker!" << std::endl ; return 0;}', codelang: 'c++' });
// const client  =createClient();
// client.on('error', (err) => {console.log(err)});
// function delay() {
//     return new Promise(resolve => setTimeout(resolve, 1000)); // Resolve after 1 second
//   }
// async function connect(){
//     try{
//         await client.connect();
//         console.log('connected to redis server')
//     }catch(e){
//         console.log('error in connecting to redis server')
//     }
// }   
// connect();
// async function worker(){
//     while(true){
//         try{
//             const data= await client.brPop('problems',0)
//             console.log('recieved data',data)
//             const filepath=path.join(__dirname,'usercode')
//             fs.mkdirSync(filepath,{recursive:true})
//             fs.writeFileSync(path.join(filepath,'main.'+'js'),'console.log("hello")')
//         }catch(e){
//             /// handle  error
//             console.log('error in recieving data')
//         }
//     }
// }
// worker();
