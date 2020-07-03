export default class Storage {
    static getItem(key: string): Promise<string | null>;
    static setItem(key: string, value: string): Promise<void>;
    static removeItem(key: string): Promise<void>;
    static clearStorage(): Promise<void>;
    static hasItem(key: string): Promise<boolean>;
}
