export default class AppStorage {
    private cipher;
    static readonly MY_ALGO_STORAGE: string;
    constructor(storagekey?: string);
    getStorageKey(): string;
    loadItemFromStorage(key: string): Promise<any>;
    saveItemToStorage(key: string, item: any): Promise<void>;
    savePrivatekeyToStorage(key: string, password: string, pk: Uint8Array): Promise<void>;
    loadPrivatekeyFromStorage(key: string, password: string): Promise<Uint8Array>;
    static verifyPassword(key: string, password: string, okPhrase?: string): Promise<string>;
    static createPassword(key: string, password: string, okPhrase?: string): Promise<void>;
    static removeItem(key: string): Promise<void>;
    static setItem(key: string, item: string): Promise<void>;
    static getItem(key: string): Promise<string | null>;
    static hasItem(key: string): Promise<boolean>;
    static resetStorage(): Promise<void>;
    static zeroBuffer(pk: Uint8Array): void;
}
