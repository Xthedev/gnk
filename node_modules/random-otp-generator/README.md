# random-otp-generator

'random-otp-generator' is a function that generates a random one-time password (OTP). This function takes in two arguments - length and options - and returns a randomly generated OTP as a string.

#### Installation
To use randomOtp in your project, you can install it via npm: 
````Javascript 
npm install random-otp-generator
````


#### Usage
Here's an example of how you can use randomOtp in your code:

```` Javascript
const randomOtp = require('random-otp-generator');

//  Generate a 4- digits OTP by default
const otp = randomOtp();

console.log(otp);  //Example output: "5172"

//You can also specify length of the OTP

const otp = randomOtp(6);

console.log(otp) // Example output : "517141"

````

#### You can also pass in an optional options object to customize the generated OTP:

````Javascript
// Generate a 6-character OTP consisting of lowercase letters;
const otp = randomOtp(6, { alpha: true, lower: true });

console.log(otp); // Example output: "svprna" 
````

````Javascript
// Generate a 6-character OTP consisting alphabets and numbers;
const otp = randomOtp(6, { alphaNum: true });

console.log(otp); // Example output: K8WZT1
````

````Javascript
// Generate a 6-character OTP consisting of special chars;
const otp = randomOtp(6, { specialChars: true });

console.log(otp); // Example output: ^&*@#$
````

### Arguments
The randomOtp function takes in two arguments:

```length``` (optional): The length of the OTP to be generated. Defaults to 4 if not specified.
#### `options` (optional): An object that can contain the following properties:

List of available options

```lower```: Set to true to convert generated OTP to lowercase.
```alpha```: Set to true to generate alphabetic OTP (upper-case).
```specialChars```: Set to true to generate special character based OTP.
```alphaNum```: Set to true to generate OTP with alpha-numeric characters.
### Development
This project uses JavaScript as the programming language. It has no external dependencies.
