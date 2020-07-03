export declare function generateRandomValues(size?: number): Uint8Array;
export declare function fromHexString(hexString: string): Uint8Array;
export declare function toHexString(bytes: Uint8Array): string;
export declare function digest(buffer: Uint8Array | ArrayBuffer, algorithm: "SHA-512" | "SHA-256"): Promise<string>;
