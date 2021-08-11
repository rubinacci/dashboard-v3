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
exports.Eth = void 0;
const web3_1 = __importDefault(require("web3"));
const logger_1 = require("./logger");
const { exec } = require("child_process");
const path = __importStar(require("path"));
const kLoggerCategory = 'ETH';
class Eth {
    constructor(infuraKey) {
        this.infuraKey = infuraKey;
        this.setup();
    }
    setup() {
        this.web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${this.infuraKey}`));
        this.web3.eth.subscribe("newBlockHeaders", (error, event) => __awaiter(this, void 0, void 0, function* () {
            if (!error) {
                const date = new Date();
                logger_1.Logger.log(kLoggerCategory, `${date} New block: ${event.number}`);
                this.updateDelta();
                this.updatePhoenix();
                return;
            }
            console.log(error);
        }));
    }
    updateDelta() {
        if (!this.deltaUpdatedPromise) {
            this.deltaUpdatedPromise = new Promise((resolve, reject) => {
                logger_1.Logger.log(kLoggerCategory, `running delta_monitor.py`);
                const startDate = new Date();
                const child = exec('python3 pool_monitor/delta_monitor.py --daemon=false', { cwd: path.join(__dirname, '../') });
                child.stdout.on('data', (data) => {
                    const str = data.toString();
                    const lines = str.split(/(\r?\n)/g);
                    lines.forEach((l) => {
                        if (l.indexOf('INSERT') > -1) {
                            logger_1.Logger.log(kLoggerCategory, `delta_monitor.py::${l}`);
                        }
                    });
                });
                child.stderr.pipe(process.stdout);
                child.on('exit', () => {
                    logger_1.Logger.log(kLoggerCategory, `delta_monitor.py done running. Took ${(new Date().getTime() - startDate.getTime()) / 1000} seconds`);
                    this.deltaUpdatedPromise = null;
                    resolve(undefined);
                });
            });
            return this.deltaUpdatedPromise;
        }
        else {
            logger_1.Logger.log(kLoggerCategory, `delta_monitor.py still running... Ignoring`);
        }
    }
    updatePhoenix() {
        if (!this.phoenixUpdatedPromise) {
            this.phoenixUpdatedPromise = new Promise((resolve, reject) => {
                logger_1.Logger.log(kLoggerCategory, `running phoenix_monitor.py`);
                const startDate = new Date();
                const child = exec('python3 pool_monitor/phoenix_monitor.py --daemon=false', { cwd: path.join(__dirname, '../') });
                child.stderr.pipe(process.stdout);
                child.stdout.on('data', (data) => {
                    const str = data.toString();
                    const lines = str.split(/(\r?\n)/g);
                    lines.forEach((l) => {
                        if (l.indexOf('INSERT') > -1) {
                            logger_1.Logger.log(kLoggerCategory, `phoenix_monitor.py::${l}`);
                        }
                    });
                });
                child.on('exit', () => {
                    logger_1.Logger.log(kLoggerCategory, `phoenix_monitor.py done running. Took ${(new Date().getTime() - startDate.getTime()) / 1000} seconds`);
                    this.phoenixUpdatedPromise = null;
                    resolve(undefined);
                });
            });
            return this.phoenixUpdatedPromise;
        }
        else {
            logger_1.Logger.log(kLoggerCategory, `phoenix_monitor.py still running... Ignoring`);
        }
    }
}
exports.Eth = Eth;
//# sourceMappingURL=eth.js.map