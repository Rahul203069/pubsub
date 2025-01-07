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
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const redis = (0, redis_1.createClient)();
redis.on('error', (err) => { err; });
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const questionid = 454;
function startservers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield redis.connect();
            console.log('connected to redis server');
        }
        catch (e) {
            console.log('error in connecting to redis server');
        }
        try {
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        }
        catch (e) {
            console.log('error in starting server');
        }
        while (true) {
            try {
                yield redis.lPush('problems', JSON.stringify({ questionid }));
            }
            catch (e) {
                console.log('error in pushing data');
            }
            yield new Promise(resolve => setTimeout(resolve, 1000)); // Resolve after 1 second
        }
    });
}
startservers();
app.get('/submission', (req, res) => {
    const { questionid, code, language } = req.body;
    try {
        redis.lPush('problems', JSON.stringify({ questionid, code, language }));
        console.log('submitted');
        res.send('submitted');
    }
    catch (e) {
        console.log('eroor in publishing');
    }
});
