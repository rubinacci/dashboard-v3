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
exports.AllCoins = exports.AllContracts = exports.Contracts = void 0;
const coin_1 = require("./model/coin");
const node_fetch_1 = __importDefault(require("node-fetch"));
const util_1 = require("./util");
const util_2 = require("./apollo/util");
const cache_1 = require("./cache");
var Contracts;
(function (Contracts) {
    Contracts["statera"] = "0xa7de087329bfcda5639247f96140f9dabe3deed1";
    Contracts["bpt"] = "0xcd461b73d5fc8ea1d69a600f44618bdfac98364d";
    Contracts["sbpt"] = "0x55353cbadda8fd525f0e6f307b3527d518416700";
    Contracts["delta"] = "0x59f96b8571e3b11f859a09eaf5a790a138fc64d0";
    Contracts["wsta"] = "0xedeec5691f23e4914cf0183a4196bbeb30d027a0";
    Contracts["weth"] = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
})(Contracts || (Contracts = {}));
exports.Contracts = Contracts;
;
const AllContracts = Object.keys(Contracts).map((x) => Contracts[x]);
exports.AllContracts = AllContracts;
const fetchPricesWithPeriods = (address, periods, source) => __awaiter(void 0, void 0, void 0, function* () {
    const result = {};
    yield Promise.all(periods.map((period) => __awaiter(void 0, void 0, void 0, function* () {
        const [startTime, interval] = cache_1.Cache.getInstance().cachedValueOrClosure(`TIMEFRAME_${period}`, () => util_1.getTimeframeOptions(period), parseInt(process.env.CACHE_TTL));
        result[period] = yield util_2.getTokenPriceHistory(address, startTime, interval, source);
    })));
    return result;
});
const fetchVolumesWithPeriods = (address, periods, source) => __awaiter(void 0, void 0, void 0, function* () {
    const result = {};
    yield Promise.all(periods.map((period) => __awaiter(void 0, void 0, void 0, function* () {
        const [startTime, interval] = cache_1.Cache.getInstance().cachedValueOrClosure(`TIMEFRAME_${period}`, () => util_1.getTimeframeOptions(period), parseInt(process.env.CACHE_TTL));
        result[period] = yield util_2.getTokenVolumeHistory(address, startTime, interval, source);
    })));
    return result;
});
const fetchAPYs = (address, periods, source) => __awaiter(void 0, void 0, void 0, function* () {
    const result = {};
    yield Promise.all(periods.map((period) => __awaiter(void 0, void 0, void 0, function* () {
        const days = util_1.getTimeframeOptionsDays(period);
        const [startTime,] = util_1.getTimeframeOptions(period);
        const interval = util_1.getTimeframeInterval(period);
        result[period] = yield util_2.getTokenAPY(address, startTime, interval, days, source);
    })));
    return result;
});
const ETHERSCAN_API_KEY = "NKZ4HTP4DNJPB3KZSJKI9IN3NPWUQA1N5D";
const fetchSupply = (address) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (yield node_fetch_1.default(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${address}&apikey=${ETHERSCAN_API_KEY}`)).json())["result"];
});
const fetchCoingeckoMarketData = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield (yield node_fetch_1.default(`https://api.coingecko.com/api/v3/coins/${name}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`)).json());
    return {
        "circulating_supply": result["market_data"]["circulating_supply"],
        "current_price": result["market_data"]["current_price"]["usd"],
        "market_cap": result["market_data"]["market_cap"]["usd"]
    };
});
const STATERA = new coin_1.Coin('statera', 'STA', Contracts.statera, 'statera', () => __awaiter(void 0, void 0, void 0, function* () { return yield fetchPricesWithPeriods(Contracts.statera, ["24h", "30d", "all"], "uniswap"); }), () => __awaiter(void 0, void 0, void 0, function* () { return yield fetchVolumesWithPeriods("0x59f96b8571e3b11f859a09eaf5a790a138fc64d0", ["all"], "uniswap"); }), () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        marketData: yield fetchCoingeckoMarketData("statera"),
        supply: yield fetchSupply(Contracts.statera),
        liquidity: yield util_2.getCurrentLiquidity("0x59f96b8571e3b11f859a09eaf5a790a138fc64d0", "uniswap")
    };
}));
const WSTA = new coin_1.Coin('wsta', 'WSTA', Contracts.wsta, null, () => __awaiter(void 0, void 0, void 0, function* () { return yield fetchPricesWithPeriods(Contracts.wsta, ["24h", "30d", "all"], "uniswap"); }), () => __awaiter(void 0, void 0, void 0, function* () { return yield fetchVolumesWithPeriods("0xa94700c1a1ae21324e78d5bdf6b2924e45a6068f", ["all"], "uniswap"); }), () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        apy: yield fetchAPYs(Contracts.wsta, ["24h", "1w", "30d"], "uniswap"),
        supply: yield fetchSupply(Contracts.wsta),
        liquidity: yield util_2.getCurrentLiquidity("0xa94700c1a1ae21324e78d5bdf6b2924e45a6068f", "uniswap")
    };
}));
const STANOS = new coin_1.Coin("stanos", "SBPT", Contracts.sbpt, null, () => __awaiter(void 0, void 0, void 0, function* () { return yield fetchPricesWithPeriods(Contracts.sbpt, ["24h", "30d", "all"], "balancer"); }), () => __awaiter(void 0, void 0, void 0, function* () { return yield fetchVolumesWithPeriods(Contracts.sbpt, ["all"], "balancer"); }), () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        apy: yield fetchAPYs(Contracts.sbpt, ["24h", "1w", "30d"], "balancer"),
        supply: yield fetchSupply(Contracts.sbpt),
        liquidity: yield util_2.getCurrentLiquidity(Contracts.sbpt, "balancer")
    };
}));
const AllCoins = [STATERA, WSTA, STANOS];
exports.AllCoins = AllCoins;
//# sourceMappingURL=constants.js.map