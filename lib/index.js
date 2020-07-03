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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = __importDefault(require("./storage"));
var StrongCipher = __importStar(require("./cipher/strong-cipher"));
var cipher_1 = __importDefault(require("./cipher/cipher"));
var cipher_utils_1 = require("./cipher/cipher-utils");
var AppStorage = (function () {
    function AppStorage(storagekey) {
        this.cipher = new cipher_1.default(storagekey);
    }
    AppStorage.prototype.getStorageKey = function () {
        return this.cipher.getObfuscatekey();
    };
    AppStorage.prototype.loadItemFromStorage = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedData, decryptedData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, storage_1.default.getItem(key)];
                    case 1:
                        encryptedData = _a.sent();
                        if (!encryptedData) {
                            return [2, null];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4, this.cipher.decrypt(encryptedData)];
                    case 3:
                        decryptedData = _a.sent();
                        return [2, decryptedData];
                    case 4:
                        err_1 = _a.sent();
                        return [2, null];
                    case 5: return [2];
                }
            });
        });
    };
    AppStorage.prototype.saveItemToStorage = function (key, item) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.cipher.encrypt(item)];
                    case 1:
                        encryptedData = _a.sent();
                        return [4, storage_1.default.setItem(key, encryptedData)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    AppStorage.prototype.savePrivatekeyToStorage = function (key, password, pk) {
        return __awaiter(this, void 0, void 0, function () {
            var masterkey, encryptedPk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, StrongCipher.generateMasterKey(password)];
                    case 1:
                        masterkey = _a.sent();
                        return [4, StrongCipher.encrypt(cipher_utils_1.toHexString(pk), masterkey)];
                    case 2:
                        encryptedPk = _a.sent();
                        return [4, AppStorage.setItem(key, encryptedPk)];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    AppStorage.prototype.loadPrivatekeyFromStorage = function (key, password) {
        return __awaiter(this, void 0, void 0, function () {
            var masterkey, encryptedPk, hexPK, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, StrongCipher.generateMasterKey(password)];
                    case 1:
                        masterkey = _a.sent();
                        return [4, AppStorage.getItem(key)];
                    case 2:
                        encryptedPk = _a.sent();
                        if (!encryptedPk) {
                            throw new Error("No privatekey found in the storage");
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4, StrongCipher.decrypt(encryptedPk, masterkey)];
                    case 4:
                        hexPK = _a.sent();
                        return [2, cipher_utils_1.fromHexString(hexPK)];
                    case 5:
                        err_2 = _a.sent();
                        if (err_2.message !== "Invalid object" && err_2.message !== "Invalid salt" && err_2.message !== "Invalid initial vector") {
                            throw new Error("Invalid Password");
                        }
                        throw err_2;
                    case 6: return [2];
                }
            });
        });
    };
    AppStorage.verifyPassword = function (key, password, okPhrase) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedMasterpass, masterkey, decryptedMasterpass, PHRASE, obfuscatekey, validate, OK, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4, storage_1.default.getItem(key)];
                    case 1:
                        encryptedMasterpass = _a.sent();
                        if (!encryptedMasterpass) return [3, 4];
                        return [4, StrongCipher.generateMasterKey(password)];
                    case 2:
                        masterkey = _a.sent();
                        return [4, StrongCipher.decrypt(encryptedMasterpass, masterkey)];
                    case 3:
                        decryptedMasterpass = _a.sent();
                        PHRASE = okPhrase ? okPhrase : AppStorage.MY_ALGO_STORAGE;
                        obfuscatekey = decryptedMasterpass.substr(0, decryptedMasterpass.length - (PHRASE.length * 2));
                        validate = decryptedMasterpass.substring(decryptedMasterpass.length - (PHRASE.length * 2));
                        OK = Buffer.from(cipher_utils_1.fromHexString(validate)).toString();
                        if (OK === PHRASE) {
                            return [2, obfuscatekey];
                        }
                        _a.label = 4;
                    case 4: return [3, 6];
                    case 5:
                        err_3 = _a.sent();
                        console.warn("Something went wrong: " + err_3.message);
                        return [3, 6];
                    case 6: throw new Error("Invalid password");
                }
            });
        });
    };
    AppStorage.createPassword = function (key, password, okPhrase) {
        return __awaiter(this, void 0, void 0, function () {
            var masterkey, obfuscatekey, PHRASE, OK, masterpass, encryptedMasterpass;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, StrongCipher.generateMasterKey(password)];
                    case 1:
                        masterkey = _a.sent();
                        obfuscatekey = cipher_utils_1.generateRandomValues(32);
                        PHRASE = okPhrase ? okPhrase : AppStorage.MY_ALGO_STORAGE;
                        OK = new Uint8Array(Buffer.from(PHRASE));
                        masterpass = cipher_utils_1.toHexString(obfuscatekey) + cipher_utils_1.toHexString(OK);
                        return [4, StrongCipher.encrypt(masterpass, masterkey)];
                    case 2:
                        encryptedMasterpass = _a.sent();
                        return [4, this.setItem(key, encryptedMasterpass)];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    AppStorage.removeItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, storage_1.default.removeItem(key)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    AppStorage.setItem = function (key, item) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, storage_1.default.setItem(key, item)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    AppStorage.getItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, storage_1.default.getItem(key)];
                    case 1:
                        item = _a.sent();
                        return [2, item];
                }
            });
        });
    };
    AppStorage.hasItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var hasItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, storage_1.default.hasItem(key)];
                    case 1:
                        hasItem = _a.sent();
                        return [2, hasItem];
                }
            });
        });
    };
    AppStorage.resetStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, storage_1.default.clearStorage()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    AppStorage.zeroBuffer = function (pk) {
        for (var i = 0; i < pk.length; i++) {
            pk[i] = 0;
        }
    };
    AppStorage.MY_ALGO_STORAGE = "MY_ALGO_STORAGE";
    return AppStorage;
}());
exports.default = AppStorage;
