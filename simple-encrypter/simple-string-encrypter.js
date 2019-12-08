'use strict'

const __encrypt__manager__ = require('./encrypter/encrypt-manager');

let __MASTER__KEY;
module.exports.SimpleStringEncrypter = (key) => {
    __MASTER__KEY = key;
    let functions = {
        encrypt: __encrypt__,
        decrypt: __decrypt__
    }
    return functions;
}

const __encrypt__ = (plaintext) => {
    return new Promise((resolve, reject) => {
        __encrypt__manager__.init(__MASTER__KEY).then((encryptManager) => {
            encryptManager.encrypt(plaintext).then(encryptedText => {
                resolve(encryptedText)
            }).catch(err => {
                reject(err)
            })
        }).catch(err => {
            reject(err)
        })
    });
}

const __decrypt__ = (encryptedText) => {
    return new Promise((resolve, reject) => {
        __encrypt__manager__.init(__MASTER__KEY).then((encryptManager) => {
            encryptManager.decrypt(encryptedText).then(plaintext => {
                resolve(plaintext)
            }).catch(err => {
                reject(err)
            })
        }).catch(err => {
            reject(err)
        })
    })
}