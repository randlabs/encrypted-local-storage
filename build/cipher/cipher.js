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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupportedCipher = void 0;
var strong_cipher_1 = require("./strong-cipher");
var cipher_utils_1 = require("./cipher-utils");
var AesCBC = (function () {
    function AesCBC(obfuscatekey) {
        if (obfuscatekey) {
            this.obfuscatekey = cipher_utils_1.fromHexString(obfuscatekey);
        }
        else {
            this.obfuscatekey = cipher_utils_1.generateRandomValues(32);
        }
        this.masterkey = null;
    }
    AesCBC.prototype.importMasterkey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, window.crypto.subtle.importKey("raw", this.obfuscatekey, {
                                name: "AES-CBC",
                                length: 256
                            }, false, ["encrypt", "decrypt"])];
                    case 1:
                        _a.masterkey = _b.sent();
                        return [2];
                }
            });
        });
    };
    AesCBC.prototype.getObfuscatekey = function () {
        return cipher_utils_1.toHexString(this.obfuscatekey);
    };
    AesCBC.prototype.encrypt = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var iv, encoder, encryptedValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.masterkey) return [3, 2];
                        return [4, this.importMasterkey()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        iv = cipher_utils_1.generateRandomValues(16);
                        encoder = new TextEncoder();
                        return [4, window.crypto.subtle.encrypt({
                                name: "AES-CBC",
                                iv: iv
                            }, this.masterkey, encoder.encode(JSON.stringify(value)))];
                    case 3:
                        encryptedValue = _a.sent();
                        return [2, cipher_utils_1.toHexString(new Uint8Array(encryptedValue)) + cipher_utils_1.toHexString(iv)];
                }
            });
        });
    };
    AesCBC.prototype.decrypt = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var iv, decryptedValue, decoder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.masterkey) return [3, 2];
                        return [4, this.importMasterkey()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        iv = cipher_utils_1.fromHexString(value.substr(value.length - 32));
                        if (!iv || iv.length !== 16) {
                            throw new Error("Invalid initial vector");
                        }
                        return [4, window.crypto.subtle.decrypt({
                                name: "AES-CBC",
                                iv: iv
                            }, this.masterkey, cipher_utils_1.fromHexString(value.substr(0, value.length - 32)))];
                    case 3:
                        decryptedValue = _a.sent();
                        decoder = new TextDecoder();
                        return [2, JSON.parse(decoder.decode(decryptedValue))];
                }
            });
        });
    };
    return AesCBC;
}());
exports.default = AesCBC;
function isSupportedCipher() {
    return __awaiter(this, void 0, void 0, function () {
        var isSupportedCryptoSubtle, isStrongCipher, cipher, value, encryptedValue, decryptedValue, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isSupportedCryptoSubtle = Boolean(window.crypto && window.crypto.subtle && window.crypto.getRandomValues &&
                        window.crypto.subtle.importKey && window.crypto.subtle.encrypt && window.crypto.subtle.decrypt &&
                        window.crypto.subtle.digest);
                    if (!isSupportedCryptoSubtle) return [3, 6];
                    return [4, strong_cipher_1.isSupportedStrongCipher()];
                case 1:
                    isStrongCipher = _a.sent();
                    if (!isStrongCipher) return [3, 6];
                    cipher = new AesCBC();
                    value = { test: "test" };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4, cipher.encrypt(value)];
                case 3:
                    encryptedValue = _a.sent();
                    return [4, cipher.decrypt(encryptedValue)];
                case 4:
                    decryptedValue = _a.sent();
                    return [2, value.test === decryptedValue.test];
                case 5:
                    err_1 = _a.sent();
                    return [3, 6];
                case 6: return [2, false];
            }
        });
    });
}
exports.isSupportedCipher = isSupportedCipher;
