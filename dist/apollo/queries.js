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
exports.fetchBlockFromTimestamp = exports.fetchLatestBlock = void 0;
const client_1 = require("./client");
const graphql_queries_1 = require("./graphql_queries");
const fetchLatestBlock = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_1.healthClient.query({
        query: graphql_queries_1.SUBGRAPH_HEALTH,
    });
    return result.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number;
});
exports.fetchLatestBlock = fetchLatestBlock;
const fetchBlockFromTimestamp = (timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let result = yield client_1.blockClient.query({
        query: graphql_queries_1.GET_BLOCK,
        variables: {
            timestampFrom: timestamp,
            timestampTo: timestamp + 600,
        },
        fetchPolicy: 'cache-first',
    });
    return (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.blocks) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.number;
});
exports.fetchBlockFromTimestamp = fetchBlockFromTimestamp;
//# sourceMappingURL=queries.js.map