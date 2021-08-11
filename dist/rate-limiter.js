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
exports.RateLimiter = void 0;
const logger_1 = require("./logger");
const kLoggerCategory = 'RATELIMITER';
class RateLimiter {
    constructor(maximumRequests, timespan, name) {
        this.maximumRequests = maximumRequests;
        this.timespan = timespan;
        this.hits = [];
        this.name = name;
    }
    purge() {
        const now = new Date().getTime();
        const date = new Date(now - this.timespan);
        this.hits = this.hits.filter((hitDate) => {
            return hitDate.getTime() > date.getTime();
        });
    }
    wait(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(undefined);
            }, ms);
        });
    }
    rateLimit(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            this.purge();
            if (this.hits.length < this.maximumRequests) {
                this.hits.push(new Date());
                return fn();
            }
            else {
                const oldestHit = this.hits[0].getTime();
                const now = new Date().getTime();
                const delay = this.timespan - (now - oldestHit);
                logger_1.Logger.log(kLoggerCategory, `Rate limiting ${this.name} for ${delay}ms`);
                // Wait until the oldest request is out the equation
                yield this.wait(delay);
                return this.rateLimit(fn);
            }
        });
    }
}
exports.RateLimiter = RateLimiter;
//# sourceMappingURL=rate-limiter.js.map