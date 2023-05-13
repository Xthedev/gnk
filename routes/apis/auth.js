const { Usersdb, UsersDb } = require("../../databases/databases");
const User = require("../../schema/UserSchema");
var validator = require('validator');
var cache = require('memory-cache');
const cryptr = require("../../utils/encrypt");
const randomOtp = require('random-otp-generator');
const { SendOtpMail } = require("../../utils/mailer");
const JsonRecords = require('json-records');
    
const Auth = (app)=>{






/* -------------------------------------------------------------------------- */
/*                             REGISTER NEW  USER                             */
/* -------------------------------------------------------------------------- */
app.post('/api/auth/register',(req,res)=>{

    try {
          /* --------------------------- VALIDATE THE EMAIL --------------------------- */
    let isemail = validator.isEmail(req.body.email);
    /* -------------------------- VALIDATE THE PASSWORD ------------------------- */
    let isstrongpassword = validator.isStrongPassword(req.body.password); 

    /* ------------------- IF PROVIDED EMAIL IS IN VALID FORM ------------------- */
    if(isemail){

        /* --------------------- IF PROVIDED PASSWORD IS STRONG --------------------- */
        if(isstrongpassword){
            let checkuser=[];
            /* ----------------- First check if the user already exists ----------------- */
          try {
          checkuser =  UsersDb.get(record => record.email ===  req.body.email.trim());

          } catch (error) {
            checkuser=[];
          }
            
            if(checkuser.length>0){
                res.status(400).json({"error":true,"message":"User with this email already exists."})

            }
            else{
                /* ------------------------- tag user to user Object ------------------------ */
                const user = User;
                user.email = req.body.email;
                user.password = cryptr.encrypt(req.body.password);
                user.firstname = req.body.firstname;
                user.lastname = req.body.lastname;
                user.dateofbirth = req.body.dateofbirth;
                user.gender = req.body.gender;
                /* -------------------------- STORE NEW USER OBJECT ------------------------- */
               try {
                UsersDb.add(user);
                res.status(200).json({"error":false,"message":"User Registered Successfully"})

                
               } catch (error) {
                res.status(400).json({"error":true,"message":error.message})

                
               }
               
                  
                
            
            }

        }else{
            res.status(400).json({"error":true,"message":"Password must contain a LowerCase,Uppercase , Number, Symbol and must be up to 8 characters long."})

        }


    }else{
        res.status(400).json({"error":true,"message":"Email Address is not valid"})

    }
   
    
    } catch (error) {
        res.status(512).json({"error":true,"message":error.message})
    }
  
});

/* -------------------------------------------------------------------------- */
/*                               LOGIN THE USER                               */
/* -------------------------------------------------------------------------- */



app.post('/api/auth/login',(req,res)=>{

        try {
                   /* --------------------------- VALIDATE THE EMAIL --------------------------- */
            let isemail = validator.isEmail(req.body.email);
                  /* ------------------- IF PROVIDED EMAIL IS IN VALID FORM ------------------- */
            if(isemail){
                /* ----------------- First check if the user already exists ----------------- */
                const checkuser= UsersDb.get(record => record.email ===  req.body.email.trim() && cryptr.decrypt(record.password) === req.body.password.trim());
                if(checkuser.length>0){
                    let userdetails = checkuser[0];
                    delete userdetails["password"];
                    res.status(200).json({"error":false,"message":"User Logged In Successfully", "data":userdetails});

                }else{
                    res.status(400).json({"error":true,"message":"No such user exists, please check your credentials and try again"})

                }
            }
            else{
                res.status(400).json({"error":true,"message":"Email Address is not valid"})

            }
        } catch (error) {
            console.log(error);
            res.status(512).json({"error":true,"message":error.message})
   
        }
 



});
/* -------------------------------------------------------------------------- */
/*                                   SENDOTP                                  */
/* -------------------------------------------------------------------------- */
app.post('/api/auth/sendotp',(req,res)=>{
    
    
    try {
        let isemail = validator.isEmail(req.body.email);
        if(isemail){
            /* ---------------------- GENERATE AN OTP OF SIX DIGITS --------------------- */
            const email = req.body.email;
            const otp = randomOtp(6);
            /* ------------------------ STORE IN TEMPORARY CACHE ------------------------ */
            cache.put(email,otp);
            SendOtpMail(email,otp);

            res.status(200).json({"error":false,"message":"OTP sent successfully"})
  
        }else{
            res.status(400).json({"error":true,"message":"Email Address is not valid"})

        }
    } catch (error) {
        res.status(400).json({"error":true,"message":error.message})

    }

})






/* -------------------------------------------------------------------------- */
/*                                VERIFY EMAIL                                */
/* -------------------------------------------------------------------------- */

app.post('/api/auth/verifyemail',(req,res)=>{
    
    
    try {
        let isemail = validator.isEmail(req.body.email);
        if(isemail){
            /* ---------------------- GENERATE AN OTP OF SIX DIGITS --------------------- */
            const email = req.body.email;
            const otpreceived = req.body.otp.trim();
            try {
               const otp = cache.get(email);
                if(otp==otpreceived){

                    try {
                          let user =UsersDb.get(record => record.email === email)[0];
                          user.emailverifiedstatus =1;
                          let updated = user;
                          /* -------------- UPDATE THE RECORD TO HAVE THE EMAIL VERIFIED -------------- */
                          UsersDb.remove(record => record.email === email);
                          UsersDb.add(user);
                          res.status(200).json({"error":false,"message":"Your Email has been verified."})
  
                    } catch (error) {
                        res.status(400).json({"error":true,"message":"No such user exists on our platform....."})

                    }
                  

                    
                }else{
                    res.status(400).json({"error":true,"message":"Provided OTP is wrong...."})

                }

            } catch (error) {
                res.status(400).json({"error":true,"message":"No Otp code found for this email."})

            }
           

        }else{
            res.status(400).json({"error":true,"message":"Email Address is not valid"})

        }
    } catch (error) {
        res.status(400).json({"error":true,"message":error.message})

    }

})



/* -------------------------------------------------------------------------- */
/*                              UPDATE USER BIO                               */
/* -------------------------------------------------------------------------- */

app.post('/api/auth/update',(req,res)=>{
    try {
        const user = req.body;
        const email = req.body.email;
        let founduser =UsersDb.get(record => record.email === email);
        if(founduser.length>0){
 /* ---------------------------- GRAB USER OBJECTS --------------------------- */
            founduser=founduser[0];
            console.log(founduser);
            if(validator.isEmpty(user.mobile)){}else{  founduser.mobile=user.mobile;      }
            if(validator.isEmpty(user.dateofbirth)){}else{    founduser.dateofbirth=user.dateofbirth;     }
            if(validator.isEmpty(user.gender)){}else{   founduser.gender=user.gender;      }
            if(validator.isEmpty(user.address)){}else{   founduser.address=user.address;      }
            if(validator.isEmpty(user.city)){}else{     founduser.city=user.city;    }
            if(validator.isEmpty(user.state)){}else{   founduser.state=user.state;      }
            if(validator.isEmpty(user.country)){}else{   founduser.country=user.country      }
            if(validator.isEmpty(user.usertype)){}else{   founduser.usertype=user.usertype;      }
            
            UsersDb.remove(record => record.email === email);
            UsersDb.add(founduser);
            res.status(200).json({"error":false,"message":"Data updated successfully"});

        }else{
            res.status(400).json({"error":true,"message":"No such user with that email exists."});
   
        }
         } catch (error) {
        res.status(400).json({"error":true,"message":error.message});
    }

  
})

/* -------------------------------------------------------------------------- */
/*                          UPLOAD USER PROFILE PHOTO                         */
/* -------------------------------------------------------------------------- */
/* ---------------------- UPLOAD PROFILE PHOTO FOR USER --------------------- */
app.post('/api/auth/photo',(req,res)=>{


    if(validator.isEmail(req.body.email)){
 /* ---------------- create a db for photos for specific user ---------------- */
        const email = req.body.email;
        const photo = req.body.photo;
        /* ---------------- Create A personal photospace for the user --------------- */
        const UsersPersonalPhoto = new JsonRecords(`./databases/photosdb/${email}.json`);
        //GENERATE IMAGE STORE
        UsersPersonalPhoto.add({"email":email,"photo":photo});

        res.status(200).json({"error":true,"message":"User Profile photo uploaded successfully"});
        
    }else{
        res.status(400).json({"error":true,"message":"Provided Email is Invalid"});
        
    }
   
})
/* -------------------------------------------------------------------------- */
/*                         GET PROFILE PHOTO BY EMAIL                         */
/* -------------------------------------------------------------------------- */
/* ----------------------- GET PROFILE PHOTO BY EMAIL ----------------------- */
app.get('/api/auth/getphoto/:email',(req,res)=>{
    if(validator.isEmail(req.params.email)){
        const email = req.params.email;
        try {
            const UsersPersonalPhoto = new JsonRecords(`./databases/photosdb/${email}.json`);
            let profilepicture = UsersPersonalPhoto.get()[0];
            res.status(200).json({"error":true,"message":"Photo acquired successfully", "data":profilepicture});
       
        } catch (error) {
            res.status(400).json({"error":true,"message":"No Profile picture available for this user"});

        }
       

    }else{
        res.status(400).json({"error":true,"message":"Provided Email is Invalid"});
        
    }
})


/* -------------------------------------------------------------------------- */
/*                          UPLOAD USER IDENTITY CARD                         */
/* -------------------------------------------------------------------------- */

app.post('/api/auth/updateidentity',(req,res)=>{

    if(validator.isEmail(req.body.email)){
 /* ---------------- create a db for photos for specific user ---------------- */
        const email = req.body.email;

    
        try {
              /* ---------------- Create A personal photospace for the user --------------- */
        const UsersPersonalID= new JsonRecords(`./databases/idcardsdb/${email}.json`);
        //GENERATE IMAGE STORE
        UsersPersonalID.add({"email":email,"idcardtype":req.body.idcardtype,"idcardnumber":req.body.idcardnumber,"idcardexpiry":req.body.idcardexpiry,"idcardfront":req.body.idcardfront,"idcardback":req.body.idcardback});

        res.status(200).json({"error":true,"message":"User IDCARD uploaded successfully"});
        
        } catch (error) {
            res.status(400).json({"error":true,"message":"An error occured saving your idcard"});
        
        }
     
    }else{
        res.status(400).json({"error":true,"message":"Provided Email is Invalid"});
        
    }
   
})

/* -------------------------------------------------------------------------- */
/*                            GET ID CARD BY EMAIL                            */
/* -------------------------------------------------------------------------- */
app.get('/api/auth/getidentity/:email',(req,res)=>{
    if(validator.isEmail(req.params.email)){
        const email = req.params.email;
        try {
            const UsersPersonalID= new JsonRecords(`./databases/idcardsdb/${email}.json`);
            let idcard= UsersPersonalID.get()[0];
            res.status(200).json({"error":true,"message":"IDCARD acquired successfully", "data":idcard});
       
        } catch (error) {
            res.status(400).json({"error":true,"message":"No ID available for this user"});

        }
       

    }else{
        res.status(400).json({"error":true,"message":"Provided Email is Invalid"});
        
    }
})

}
module.exports=Auth;