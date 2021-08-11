"use strict";
//https://api.bloxy.info/token/token_holders_list?token=0x59F96b8571E3B11f859A09Eaf5a790A138FC64D0&key=ACCAF3LT6fEdd&format=table
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bloxy = void 0;
const cache_1 = require("./cache");
const axios_1 = __importDefault(require("axios"));
class Bloxy {
    constructor() {
        this.baseURL = 'https://api.bloxy.info'; //?module=stats&action=tokensupply&contractaddress=0xa7DE087329BFcda5639247F96140f9DAbe3DeED1&apikey=YourApiKeyToken;
        this.api = axios_1.default.create({
            baseURL: this.baseURL,
            responseType: 'json',
        });
        this.cache = cache_1.Cache.getInstance();
    }
    static getInstance() {
        if (!Bloxy.instance) {
            Bloxy.instance = new Bloxy();
        }
        return Bloxy.instance;
    }
    getHolders(contract) {
        const cacheKey = `holders_${contract}`;
        return this.cache.cachedValueOrClosure(cacheKey, () => {
            return this.api.request({ method: 'get', url: '/token/token_holders_list', params: { token: contract, key: process.env.BLOXY_API_KEY } }).then((result) => {
                return result.data;
            });
        }, 5 * 60 * 1000);
    }
}
exports.Bloxy = Bloxy;
//# sourceMappingURL=bloxy.js.map