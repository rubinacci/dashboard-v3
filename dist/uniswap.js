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
exports.Uniswap = void 0;
const sdk_1 = require("@uniswap/sdk");
const erc20_abi_1 = require("./erc20-abi");
const constants_1 = require("./constants");
const rate_limiter_1 = require("./rate-limiter");
const cache_1 = require("./cache");
const logger_1 = require("./logger");
const kLoggerCategory = 'UNISWAP';
const kCacheTTL = 15 * 1000;
class Uniswap {
    constructor(web3) {
        this.symbolCache = {};
        this.coinTokens = {};
        this.ethDecimals = 18;
        this.usdc = new sdk_1.Token(sdk_1.ChainId.MAINNET, 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6);
        this.eth = new sdk_1.Token(sdk_1.ChainId.MAINNET, constants_1.Contracts.weth, 18);
        this.web3 = web3;
        this.rateLimiter = new rate_limiter_1.RateLimiter(10, 1000, 'uniswap');
        this.cache = cache_1.Cache.getInstance();
    }
    contractSymbol(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.symbolCache[address] && this.symbolCache[address].tokenSymbol) {
                return this.symbolCache[address].tokenSymbol;
            }
            else {
                const tokenContract = new this.web3.eth.Contract(erc20_abi_1.erc20ABI, address);
                const tokenSymbol = yield tokenContract.methods.symbol().call();
                let cacheObject = this.symbolCache[address] || {};
                cacheObject.tokenSymbol = tokenSymbol;
                this.symbolCache[address] = cacheObject;
                return tokenSymbol;
            }
        });
    }
    contractDecimals(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.symbolCache[address] && this.symbolCache[address].tokenDecimals) {
                return this.symbolCache[address].tokenDecimals;
            }
            else {
                const tokenContract = new this.web3.eth.Contract(erc20_abi_1.erc20ABI, address);
                const tokenDecimals = yield tokenContract.methods.decimals().call();
                let cacheObject = this.symbolCache[address] || {};
                cacheObject.tokenDecimals = tokenDecimals;
                this.symbolCache[address] = cacheObject;
                return tokenDecimals;
            }
        });
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let coinIndex = 0; coinIndex < constants_1.AllContracts.length; ++coinIndex) {
                const coin = constants_1.AllContracts[coinIndex];
                const coinDecimals = yield this.contractDecimals(coin);
                const coinToken = new sdk_1.Token(sdk_1.ChainId.MAINNET, coin, coinDecimals);
                this.coinTokens[coin] = coinToken;
            }
        });
    }
    getCoinPriceInUSDC(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `${coin.name}_usdc`;
            return this.cache.cachedValueOrClosure(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                if (coin.contract !== constants_1.Contracts.weth) {
                    const WETHUSDCPair = yield sdk_1.Fetcher.fetchPairData(this.eth, this.usdc);
                    const COINETHPair = yield sdk_1.Fetcher.fetchPairData(this.coinTokens[coin.contract], this.eth);
                    const route = new sdk_1.Route([WETHUSDCPair, COINETHPair], this.usdc);
                    return route.midPrice.invert().toSignificant(6);
                }
                else {
                    const pair = yield sdk_1.Fetcher.fetchPairData(this.coinTokens[coin.contract], this.usdc);
                    const route = new sdk_1.Route([pair], this.usdc);
                    const price = route.midPrice.invert().toSignificant(6);
                    logger_1.Logger.log(kLoggerCategory, `price for ${coin}: ${price}`);
                    return price;
                }
            }), kCacheTTL);
        });
    }
    getCoinPriceInETH(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `${coin.name}_eth`;
            return this.cache.cachedValueOrClosure(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                const pair = yield sdk_1.Fetcher.fetchPairData(this.coinTokens[coin.contract], this.eth);
                const route = new sdk_1.Route([pair], this.eth);
                return route.midPrice.invert().toSignificant(6);
            }), kCacheTTL);
        });
    }
}
exports.Uniswap = Uniswap;
//# sourceMappingURL=uniswap.js.map