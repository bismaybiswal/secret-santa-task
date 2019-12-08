'use strict'

//error template
const __ERROR__ = {
    error: {
        code: null,
        message: null
    }
};
const __MASTER__KEY__FORMAT = new RegExp('^\\d+$');
const __MASTER__KEY__MIN = parseInt("100");
const __MASTER__KEY__MAX = parseInt("999");

module.exports = () => {
    return {
        validateMasterKey: __validateMasterKey__
    };
}

const __validateMasterKey__ = (key) => {
    return new Promise((resolve, reject) => {
        if (key != undefined) {
            //check if it is other than number
            if (!__MASTER__KEY__FORMAT.test(key)) {
                //construct error message
                __ERROR__.error.code = "0001"
                __ERROR__.error.message = 'Master key is should be in digits!'
                reject(__ERROR__)
            } else if (!(parseInt(key) >= __MASTER__KEY__MIN && parseInt(key) <= __MASTER__KEY__MAX)) {
                //construct error message
                __ERROR__.error.code = "0002"
                __ERROR__.error.message = 'Master key is should be between 100 to 999!'
                reject(__ERROR__)
            } else {
                resolve(true);
            }
        } else {
            //construct error message
            __ERROR__.error.code = "0000"
            __ERROR__.error.message = 'Master key is undefined. Please provide a key!'
            reject(__ERROR__)
        }
    });
}