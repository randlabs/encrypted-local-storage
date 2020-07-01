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
exports.isSupportedStrongCipher = exports.generateMasterKey = exports.decrypt = exports.encrypt = void 0;
var cipher_utils_1 = require("./cipher-utils");
var IV_SIZE = 12;
var SALT_SIZE = 32;
var ITERATIONS = 1000000;
function createMasterKey(password) {
    return __awaiter(this, void 0, void 0, function () {
        var encoder, passphraseKey, masterkey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encoder = new TextEncoder();
                    passphraseKey = encoder.encode(password);
                    return [4, window.crypto.subtle.importKey("raw", passphraseKey, "PBKDF2", false, ["deriveBits", "deriveKey"])];
                case 1:
                    masterkey = _a.sent();
                    return [2, masterkey];
            }
        });
    });
}
function importDerivedKey(masterkey, salt, iterations) {
    return __awaiter(this, void 0, void 0, function () {
        var derivedKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, window.crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt, iterations: iterations, hash: "SHA-512" }, masterkey, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"])];
                case 1:
                    derivedKey = _a.sent();
                    return [2, derivedKey];
            }
        });
    });
}
function encrypt(value, key) {
    return __awaiter(this, void 0, void 0, function () {
        var iv, salt, derivedKey, encoder, encrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof value !== "string") {
                        throw new Error("Invalid string");
                    }
                    iv = cipher_utils_1.generateRandomValues(IV_SIZE);
                    salt = cipher_utils_1.generateRandomValues(SALT_SIZE);
                    return [4, importDerivedKey(key, salt, ITERATIONS)];
                case 1:
                    derivedKey = _a.sent();
                    encoder = new TextEncoder();
                    return [4, window.crypto.subtle.encrypt({
                            name: "AES-GCM",
                            iv: iv
                        }, derivedKey, encoder.encode(value))];
                case 2:
                    encrypted = _a.sent();
                    return [2, cipher_utils_1.toHexString(iv) + cipher_utils_1.toHexString(salt) + cipher_utils_1.toHexString(new Uint8Array(encrypted))];
            }
        });
    });
}
exports.encrypt = encrypt;
function decrypt(encrypted, key) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, derivedKey, iv, decrypted, decoder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof encrypted !== "string") {
                        throw new Error("Invalid string");
                    }
                    salt = cipher_utils_1.fromHexString(encrypted.substr(IV_SIZE * 2, SALT_SIZE * 2));
                    if (!salt || salt.length !== SALT_SIZE) {
                        throw new Error("Invalid salt");
                    }
                    return [4, importDerivedKey(key, salt, ITERATIONS)];
                case 1:
                    derivedKey = _a.sent();
                    iv = cipher_utils_1.fromHexString(encrypted.substr(0, IV_SIZE * 2));
                    if (!iv || iv.length !== IV_SIZE) {
                        throw new Error("Invalid initial vector");
                    }
                    return [4, window.crypto.subtle.decrypt({
                            name: "AES-GCM",
                            iv: iv
                        }, derivedKey, cipher_utils_1.fromHexString(encrypted.substr((SALT_SIZE + IV_SIZE) * 2)))];
                case 2:
                    decrypted = _a.sent();
                    decoder = new TextDecoder();
                    return [2, decoder.decode(decrypted)];
            }
        });
    });
}
exports.decrypt = decrypt;
function generateMasterKey(password) {
    return __awaiter(this, void 0, void 0, function () {
        var masterKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, createMasterKey(password)];
                case 1:
                    masterKey = _a.sent();
                    return [2, masterKey];
            }
        });
    });
}
exports.generateMasterKey = generateMasterKey;
function isSupportedStrongCipher() {
    return __awaiter(this, void 0, void 0, function () {
        var masterkey, random, derivedKey, iv, encoder, encrypted, decrypted, decoder, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4, createMasterKey("test")];
                case 1:
                    masterkey = _a.sent();
                    random = cipher_utils_1.generateRandomValues(SALT_SIZE);
                    return [4, importDerivedKey(masterkey, random, 10)];
                case 2:
                    derivedKey = _a.sent();
                    iv = cipher_utils_1.generateRandomValues(IV_SIZE);
                    encoder = new TextEncoder();
                    return [4, window.crypto.subtle.encrypt({
                            name: "AES-GCM",
                            iv: iv
                        }, derivedKey, encoder.encode("test"))];
                case 3:
                    encrypted = _a.sent();
                    return [4, window.crypto.subtle.decrypt({
                            name: "AES-GCM",
                            iv: iv
                        }, derivedKey, encrypted)];
                case 4:
                    decrypted = _a.sent();
                    decoder = new TextDecoder();
                    if (decoder.decode(decrypted) === "test") {
                        return [2, true];
                    }
                    return [3, 6];
                case 5:
                    err_1 = _a.sent();
                    return [3, 6];
                case 6: return [2, false];
            }
        });
    });
}
exports.isSupportedStrongCipher = isSupportedStrongCipher;
//# sourceMappingURL=strong-cipher.js.map