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
exports.StatsProvider = void 0;
const cache_1 = require("./cache");
const ts_retry_promise_1 = require("ts-retry-promise");
const constants_1 = require("./constants");
class StatsProvider {
}
exports.StatsProvider = StatsProvider;
StatsProvider.fetchChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield cache_1.Cache.getInstance().cachedValueOrClosureAsync("GLOBAL_CHARTDATA", () => __awaiter(void 0, void 0, void 0, function* () {
        const [prices, volumes] = yield Promise.all([
            yield Promise.all(constants_1.AllCoins.map(coin => ts_retry_promise_1.retry(() => coin.fetchPrices(), { retries: 3 }).catch(() => ({})))),
            yield Promise.all(constants_1.AllCoins.map(coin => ts_retry_promise_1.retry(() => coin.fetchVolumes(), { retries: 3 }).catch(() => ({}))))
        ]);
        const pricesPerCoin = {};
        const volumesPerCoin = {};
        constants_1.AllCoins.forEach((coin, i) => { pricesPerCoin[coin.name] = prices[i]; });
        constants_1.AllCoins.forEach((coin, i) => { volumesPerCoin[coin.name] = volumes[i]; });
        return {
            "prices": pricesPerCoin,
            "volumes": volumesPerCoin
        };
    }), parseInt(process.env.CACHE_TTL));
});
StatsProvider.fetchStats = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield cache_1.Cache.getInstance().cachedValueOrClosureAsync("GLOBAL_STATS", () => __awaiter(void 0, void 0, void 0, function* () {
        const stats = yield Promise.all(constants_1.AllCoins.map(coin => ts_retry_promise_1.retry(() => coin.fetchStats(), { retries: 3 }).catch(() => ({}))));
        const statsPerCoin = {};
        constants_1.AllCoins.forEach((coin, i) => { statsPerCoin[coin.name] = stats[i]; });
        return statsPerCoin;
    }), parseInt(process.env.CACHE_TTL));
});
//# sourceMappingURL=StatsProvider.js.map