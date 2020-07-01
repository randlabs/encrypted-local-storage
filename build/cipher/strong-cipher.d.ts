export declare function encrypt(value: string, key: CryptoKey): Promise<string>;
export declare function decrypt(encrypted: string, key: CryptoKey): Promise<string>;
export declare function generateMasterKey(password: string): Promise<CryptoKey>;
export declare function isSupportedStrongCipher(): Promise<boolean>;
