export default class AesCBC {
    private obfuscatekey;
    private masterkey;
    constructor(obfuscatekey?: string);
    private importMasterkey;
    getObfuscatekey(): string;
    encrypt(value: any): Promise<string>;
    decrypt(value: string): Promise<any>;
}
export declare function isSupportedCipher(): Promise<boolean>;
