const simpleEncrypter = require('./simple-string-encrypter')

const plainText = "Bismay kumar biswal";
const masterKey = "113";
let encryptedText;


//encrypt
simpleEncrypter.SimpleStringEncrypter(masterKey)
    .encrypt(plainText).then(data => {
        encryptedText = data;
        console.log("Encrypted: " + data)

        //decrypt
        simpleEncrypter.SimpleStringEncrypter("113")
            .decrypt(encryptedText).then(data => {
                console.log("Decrypted: " + data)
            }).catch(err => {
                console.log(err)
            })

    }).catch(err => {
        console.log(err)
    })

