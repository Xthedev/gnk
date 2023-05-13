'use strict';

// function to generate OTP with given length and options data
const generateOtp = (length, data) => {
    let OTP = '';
    const dataLength = data.length;

    // loop to select an element in random order based on its index 
    for (let i = length; i > 0; i--) {
        OTP += data[Math.floor(Math.random() * dataLength)];
    }

    // return the generated OTP of given length and options data
    return OTP;
}

// function that generates OTP based on given options
const randomOtp = (length = 4, { lower, alpha, specialChars, alphaNum } = {}) => {
    const numbers = '1234567890';
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const special = '!@#$%^&*-+/';
    const alphaNumeric = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    let otp;
    // condition to select the type of OTP based on given options
    if (alphaNum) {
        otp = generateOtp(length, alphaNumeric);
    } else if (alpha) {
        otp = generateOtp(length, alphabets);
    } else if (specialChars) {
        otp = generateOtp(length, special);
    } else {
        otp = generateOtp(length, numbers);
    }

    // condition to check for lower case and convert OTP to lower case if true
    return lower ? otp.toLowerCase() : otp;
};

// export randomOtp function as a module for reuse
module.exports = randomOtp;
