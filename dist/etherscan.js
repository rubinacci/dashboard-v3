"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Etherscan {
    constructor() {
        this.baseURL = 'https://api.etherscan.io/'; //?module=stats&action=tokensupply&contractaddress=0xa7DE087329BFcda5639247F96140f9DAbe3DeED1&apikey=YourApiKeyToken;
        this.api = axios_1.default.create({
            baseURL: this.baseURL,
            responseType: 'json',
        });
    }
    static getInstance() {
        if (!Etherscan.instance) {
            Etherscan.instance = new Etherscan();
        }
        return Etherscan.instance;
    }
}
//# sourceMappingURL=etherscan.js.map