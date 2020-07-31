# Encrypted Local Storage  

#### [Overview](#Overview)
#### [How does it work?](#How-does-it-work?)
#### [Installation](#Installation)
#### [API Usage](#API-Usage)
- ##### [Create new password](#Create-new-password)
- ##### [Verify password](#Verify-password)
- ##### [Create AppStorage instance](#Create-AppStorage-instance)
- ##### [Storing data](#Storing-data)
- ##### [Loading data](#Loading-data)
- ##### [Storing private data](#Storing-private-data)
- ##### [Loading private data](#Loading-private-data)
#### [Test](#Test)
#### [Contributing](#Contributing)
#### [Copyright and License](#Copyright-and-License)

### Overview  
Encrypted local storage is a Javascript library developed by Rand Labs to securely store the information in the browser and primarily used by MyAlgo Wallet. It uses the browser’s IndexedDB API for storage and the WebCrypto API to create the keys and encrypt/decrypt data.

### How does it work?  

Encrypted local storage uses two different zones to store data, one for passwords and private keys, and the other to store public information.

For the former, we use the AES-GCM algorithm with a 12 bytes IV and 32 bytes salt. Also we use PBKDF2 to generate the keys with the supplied password and a configuration of 256-bit length, 32 bytes salt, SHA-512, and 1 million iterations.  

For public data, a 256-bit obfuscation key is created with a 16-byte IV and used in conjunction with AES-CBC to protect public data. Despite it isn’t necessary to protect public data, users might want to hide them.

To ensure a high entropy in all generated random numbers, WebCrypto’s random number generator is used.

Password verification involves decryption of the obfuscation key concatenated with a specific phrase using AES-GCM. We check both successful decryption and correctness of the phrase. After this, the obtained obfuscation key is used to decrypt the public information.

At last, every time data is saved in the storage, a new IV and SALT pair is generated and used to encrypt such data.

### Installation  

The library can be installed via npm:
```sh
npm install encrypted-local-storage
```

### API Usage  

#### Create new password  

```js
import AppStorage from "encrypted-storage"

const passwordKey = "masterkey"; // IndexedDB key
const password = "secret-password";

(async () => {
    await AppStorage.createPassword(passwordKey, password);
})().catch(e => {
    console.log(e);
});
```

#### Verify password  
```js
(async () => {
    const obfuscatekey = await AppStorage.verifyPassword(passwordKey, password);
})().catch(e => {
    console.log(e); // Invalid password
});
```

#### Create AppStorage instance  

```js
const appStorage = new AppStorage(); // obfuscatekey param its optional
const obfuscatekey = appStorage.getStorageKey();
```

#### Storing data  

```js
const itemKey = "info";
const obj = { name: "Jay", phone: "156988460", zipcode: 546944 }
(async () => {
    const appStorage = new AppStorage(obfuscatekey);
    await appStorage.saveItemToStorage(itemKey, obj);
})().catch(e => {
    console.log(e);
});
```

#### Loading data  

```js
(async () => {
    const appStorage = new AppStorage(obfuscatekey);
    const data = await appStorage.loadItemFromStorage(itemKey);
    console.log(data);
})().catch(e => {
    console.log(e);
});
```

#### Storing private data  

```js
const password = "secret-password";
const itemKey = "private_key";
const privateData = "private key information";
(async () => {
    const appStorage = new AppStorage(obfuscatekey);
    const data = new Uint8Array(Buffer.from(privateData));
    await appStorage.savePrivatekeyToStorage(itemKey, password, data);
})().catch(e => {
    console.log(e);
});
```

#### Loading private data  

```js
const password = "secret-password";
const itemKey = "private_key";

(async () => {
    const appStorage = new AppStorage(obfuscatekey);
    const data = await appStorage.loadPrivatekeyFromStorage(itemKey, password, data);
    console.log(Buffer.from(data).toString());
})().catch(e => {
    console.log(e);
});
```

### Test  


### Contributing  


### Copyright and License  
