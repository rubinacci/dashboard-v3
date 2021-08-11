"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (!process.env.HEROKU) {
    require('dotenv').config();
}
const compression_1 = __importDefault(require("compression"));
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const eth_1 = require("./eth");
const api_router_1 = require("./api-router");
const logger_1 = require("./logger");
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
const eth = new eth_1.Eth(process.env.INFURA_KEY);
app.use(cors_1.default());
app.use(compression_1.default());
const kLoggerCategory = 'EXPRESS';
app.use((req, res, next) => {
    const start = Date.now();
    logger_1.Logger.log(kLoggerCategory, `start request ${req.method} ${req.url}`);
    res.once('finish', () => {
        const t = Date.now() - start;
        logger_1.Logger.log(kLoggerCategory, `finish request ${req.method} ${req.url} ${t}ms`);
        if (t >= (process.env.LOG_SLOW_REQUESTS_THRESHOLD || 5000)) {
            if (req.method == 'POST' || req.method == 'PUT') {
                logger_1.Logger.log(kLoggerCategory, `slow request ${req.method} ${req.url} ${t}ms ${JSON.stringify(req.body)}`);
            }
            else {
                logger_1.Logger.log(kLoggerCategory, `slow request ${req.method} ${req.url} ${t}ms`);
            }
        }
    });
    next();
});
// React site route
app.use(express_1.default.static(path.join(__dirname, '../', 'build')));
app.use("/api", new api_router_1.APIRouter().router);
// redirect to React app if unmatched
app.use(function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'build', 'index.html'));
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
//# sourceMappingURL=index.js.map