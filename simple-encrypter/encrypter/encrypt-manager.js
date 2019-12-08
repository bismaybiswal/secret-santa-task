'use strict'
const HashMap = require('hashmap');
const Util = require('../utils/utils');
const util = Util();
const Validator = require("../utils/validator");
const __validator = Validator();
let map = new HashMap();
let __MASTER__KEY__

module.exports.init = (__KEY__) => {
    __initAlphabetsMap__();
    let functions = {
        encrypt: __encrypt__,
        decrypt: __decrypt__
    };
    return new Promise((resolve, reject) => {
        __validator.validateMasterKey(__KEY__).then((isValid) => {
            if (isValid) {
                __MASTER__KEY__ = parseInt(__KEY__)
                resolve(functions);
            }
        }).catch(err => {
            reject(err);
        })
    });

};

const __decrypt__ = (encrypted) => {
    return new Promise((resolve, reject) => {
        try {
            let plaintext = "";
            const key = __MASTER__KEY__
            const no = __rotaion__no__(key)
            //check masterkey hashing and removing
            let masterHashKey = util.hashMasterKey(key.toString());
            if(!encrypted.includes(masterHashKey)){
                console.log("invalid key")
                reject({
                    error : {
                        code: "008",
                        message: "Invalid secret key"
                    }
                })
            }
            //remove masterhash key
            encrypted = encrypted.slice(masterHashKey.length, encrypted.length);
            
            //remove extra hashing
            let encryptedText = __removeExtraHashing__(encrypted, no);

            let charArr = Array.from(encryptedText.toUpperCase());
           // console.log("Before Decrypt : " + charArr)
           // console.log(charArr.length)
            let count = 1
            charArr.forEach(char => {
                if (char != undefined) {
                   // console.log("count : " + count++)
                    if (char === '?') {
                        plaintext += " "
                    } else {
                        let key = util.getKey(char, map);
                        let pos = key - no
                        while (pos <= 0) {
                            pos = 26 + pos;
                        }
                        plaintext += util.getValue(pos, map);

                        // if (pos > 0) {
                        //     plaintext += util.getValue(pos, map);
                        // }

                    }
                }
            });

            resolve(plaintext.toUpperCase())
            // resolve(encryptedText)
        } catch (err) {
            reject(err);
        }
    })
}


const __encrypt__ = (plaintext) => {
    return new Promise((resolve, reject) => {
        try {
            let encryptedText = "";
            //get input text
            let text = plaintext.toUpperCase();
            let textArr = Array.from(text);

            //get rotation number
            const __rotation__ = __rotaion__no__(__MASTER__KEY__);
            //console.log(__rotation__)
            //console.log(textArr)
            textArr.forEach(char => {
                encryptedText += hash(char, __rotation__)
                // process.exit(1)
            })
            //console.log("Encrypted text before hashing : " + encryptedText)
            encryptedText = __applyExtraHashing__(encryptedText, __rotation__)

            //apply masterkey hashing
            let masterKeyHash = util.hashMasterKey(__MASTER__KEY__.toString())
            encryptedText = masterKeyHash + encryptedText
            console.log(masterKeyHash) 

            resolve(encryptedText)
        } catch (err) {
            reject(err)
        }

    });
}

const __removeExtraHashing__ = (text, rotate) => {
    let results = '';
    results = text.slice(rotate, text.length)
    results = results.slice(0, results.length - rotate)
    return results;
}

const __applyExtraHashing__ = (text, rotate) => {
    text = util.randomizeUpperLoweCase(text);
    let encryptedText = ''
    encryptedText = `${util.getRandomChar(rotate)}${text}${util.getRandomChar(rotate)}`;
    return encryptedText;
}

const hash = (char, rotation) => {

    //space hashing
    if (char === ' ') {
        return '?'
    }

    const rotate = rotation;
    const key = util.getKey(char, map);
    let hashKey = key + rotate;
    while (hashKey > 26) {
        hashKey = hashKey - 26
    }
    const value = util.getValue(hashKey, map);
    return value;

}

const __rotaion__no__ = (__MASTER__KEY__) => {
    const masterKey = __MASTER__KEY__;
    let value = masterKey
    let sum = 0;
    while (value) {
        sum += value % 10;
        value = Math.floor(value / 10)
    }
    return sum;
}

const __initAlphabetsMap__ = () => {
    map.set(1, "A");
    map.set(2, "B");
    map.set(3, "C");
    map.set(4, "D");
    map.set(5, "E");
    map.set(6, "F");
    map.set(7, "G");
    map.set(8, "H");
    map.set(9, "I");
    map.set(10, "J");
    map.set(11, "K");
    map.set(12, "L");
    map.set(13, "M");
    map.set(14, "N");
    map.set(15, "O");
    map.set(16, "P");
    map.set(17, "Q");
    map.set(18, "R");
    map.set(19, "S");
    map.set(20, "T");
    map.set(21, "U");
    map.set(22, "V");
    map.set(23, "W");
    map.set(24, "X");
    map.set(25, "Y");
    map.set(26, "Z");


}