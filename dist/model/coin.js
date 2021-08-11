"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coin = void 0;
class Coin {
    constructor(name, symbol, contract, coingeckoId, fetchPrices, fetchVolumes, fetchStats) {
        this.name = name;
        this.symbol = symbol;
        this.contract = contract;
        this.coingeckoId = coingeckoId;
        this.fetchPrices = fetchPrices;
        this.fetchVolumes = fetchVolumes;
        this.fetchStats = fetchStats;
    }
}
exports.Coin = Coin;
//# sourceMappingURL=coin.js.map