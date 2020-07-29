# Encrypted Local Storage

## Web wallet security

### Initial setup

* User enters a password that will be used to access the wallet
* IV / Salt pair is generated to store encrypted information
* 256-bit random key is generated to encrypt public information
* Pbkdf2 masterkey is generated using the supplied password
* Derived key is created with the IV/Salt pair and 1,000,000 iterations
* Random-length blob is created consisting of:
  * The first 32 bytes are the 256-bit random key
  * The last 2 bytes has the text “ok”
  * The remaining bytes in the middle have random values
  * This blob is encrypted using the derived key.
  * The IV, Salt and encrypted blob is stored on browser’s storage under master_key as { “iv”: “xxx”, “salt”: “xxx”, “data”: “encrypted-blob” }

### Creation of a new wallet

* Wallet information (name, address and, optionally, the mnemonic)
* The user enters the password
* Based on the masterkey, a new IV/Salt pair is generated for the new wallet and a new derived key
* The mnemonic, converted to a private key, is encrypted with this new derived key

**Wallet’s data is stored under: wallet_#_info**

This structure:
{ “address”: “xxx”, ...other wallet public info, “iv”: “xxx”, “salt”: “xxx”, “data”: “encrypted-pk” }

is encrypted with AES-CBC using the random 256-bit key generated in the initial setup  and a generated IV resulting in something like:
{ “iv”: “xxx”, “data”: “encripted-public-info” }

### Accessing the wallet

* Read info stored in master_key
* User enters the password
* Pbkdf2 masterkey is generated with supplied password and derived key is imported with provided IV/Salt
* Data blob is decrypted
* The app checks if the last two characters are the string “ok” and stores the first 32 bytes to encode/decode public data

### Using the wallet

For normal usage, it is straightforward. Public info is encoded/decoded using the 256-bit random key as required.

When the private key is required:

* User enters the password.
* Masterkey is generated and the password is checked
* The wallet’s derived key is generated based on the stored IV/Salt pair
* The private key is decrypted

### Iterations:

We use 1 million iterations to increment the time it takes a local brute force attack. We adjusted this parameter to prevent attacks but keeping performance good enough on mid-end smartphones or tablets (5 seconds in a Snapdragon 632 running at 1.8 ghz).

**Alternatives**

Lowering the iterations count to some acceptable value.
To verify if the entered password is correct when the private key needs to be used, instead of checking the password and decrypting the PK, we can directly decrypt the PK and use NaCL libraries to ensure the PK belongs to the account’s address.
