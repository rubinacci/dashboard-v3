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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const logger_1 = require("./logger");
const kLoggerCategory = 'CACHE';
class Cache {
    constructor() {
        this.cache = {};
        this.cachedValueOrClosureAsync = (key, fn, ttl) => __awaiter(this, void 0, void 0, function* () {
            let value = this.get(key);
            if (!value) {
                value = yield fn();
                this.set(key, value, ttl);
            }
            return value;
        });
    }
    static getInstance() {
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance;
    }
    set(key, value, ttl) {
        this.cache[key] = {
            value: value,
            expirationDate: new Date(new Date().getTime() + ttl)
        };
    }
    get(key) {
        const entry = this.cache[key];
        if (entry && entry.expirationDate.getTime() > new Date().getTime()) {
            logger_1.Logger.log(kLoggerCategory, `cache hit for ${key}`);
            return entry.value;
        }
        logger_1.Logger.log(kLoggerCategory, `cache miss for ${key}`);
        return null;
    }
    cachedValueOrClosure(key, fn, ttl) {
        let value = this.get(key);
        if (!value) {
            value = fn();
            this.set(key, value, ttl);
        }
        return value;
    }
}
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map