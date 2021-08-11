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
exports.Coingecko = void 0;
const CoinGecko = require('coingecko-api');
const moment = require('moment');
const CoinGeckoClient = new CoinGecko();
const rate_limiter_1 = require("./rate-limiter");
const cache_1 = require("./cache");
class Coingecko {
    constructor() {
        this.cache = cache_1.Cache.getInstance();
        this.rateLimiter = new rate_limiter_1.RateLimiter(10, 1000, 'coingecko');
    }
    static getInstance() {
        if (!Coingecko.instance) {
            Coingecko.instance = new Coingecko();
        }
        return Coingecko.instance;
    }
    cacheKey(coingeckoId, type) {
        return `${coingeckoId}_${type}`;
    }
    getHistoricPrices(coingeckoId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield CoinGeckoClient.coins.fetchHistory(coingeckoId, { date: moment(date).format('DD-MM-YYYY'), localization: false });
            return r.data;
        });
    }
    getCurrentPrices(coingeckoIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = coingeckoIds.sort().reduce((acc, value) => {
                return `${acc}_${value}`;
            });
            return this.cache.cachedValueOrClosure(cacheKey, () => {
                return CoinGeckoClient.simple.price({ ids: coingeckoIds, vs_currencies: ['usd', 'eth', 'btc'] });
            }, 60 * 1000);
        });
    }
    getMarketChart(coingeckoId, days) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.rateLimiter.rateLimit(() => __awaiter(this, void 0, void 0, function* () {
                const response = yield CoinGeckoClient.coins.fetchMarketChart(coingeckoId, { vs_currency: 'usd', days: days });
                return response.data;
            }));
        });
    }
    getMarketChartLastDay(coingeckoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = this.cacheKey(coingeckoId, 'chart1');
            return this.cache.cachedValueOrClosure(cacheKey, () => {
                return this.getMarketChart(coingeckoId, 1);
            }, 60 * 1000);
        });
    }
    getMarketChartLast30Days(coingeckoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = this.cacheKey(coingeckoId, 'chart30');
            return this.cache.cachedValueOrClosure(cacheKey, () => {
                return this.getMarketChart(coingeckoId, 30);
            }, 60 * 60 * 1000);
        });
    }
    getMarketChartLast365Days(coingeckoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = this.cacheKey(coingeckoId, 'chart365');
            return this.cache.cachedValueOrClosure(cacheKey, () => {
                return this.getMarketChart(coingeckoId, 365);
            }, 60 * 60 * 1000);
        });
    }
}
exports.Coingecko = Coingecko;
//# sourceMappingURL=coingecko.js.map