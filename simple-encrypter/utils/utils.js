'use strict'

module.exports = () => {
    return {
        getKey: getKey,
        getValue: getValue,
        getRandomChar: getRandomChar,
        randomizeUpperLoweCase: randomizeUpperLoweCase,
        hashMasterKey: hashMasterKey
    };
}

const hashMasterKey = (masterKey) => {
    const hash = {
        "0" : "99",
        "1" : "65",
        "2" : "66",
        "3" : "67",
        "4" : "68",
        "5" : "69",
        "6" : "95",
        "7" : "96",
        "8" : "97",
        "9" : "98"
    };
    let hashValues = 0;
    let charArr = Array.from(masterKey);
    charArr.forEach(char => {
        hashValues += parseInt(hash[char])
    });
    
    let encoded = Buffer.from(hashValues.toString()).toString('base64')
    console.log(hashValues.toString());
    return encoded;

}

const randomizeUpperLoweCase = (text) => {
    let results = '';
    Array.from(text).forEach((v) => {
        let chance = Math.round(Math.random());
        results += chance ? v.toUpperCase() : v.toLowerCase();
    })
    return results;
}

const getRandomChar = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const getKey = (value, map) => {
    for (const pair of map) {
        if (value === pair.value) {
            return pair.key;
        }
    }
}

const getValue = (key, map) => {
    for (const pair of map) {
        if (key === pair.key) {
            return pair.value;
        }
    }
}