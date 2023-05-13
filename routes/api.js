const Auth = require("./apis/auth");
const Api=(app)=>{
/* ----------------------------- Auth Endpoints ----------------------------- */
    Auth(app);



}

module.exports = Api;