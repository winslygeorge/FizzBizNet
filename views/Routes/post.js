const  express = require('express')
const { fstat } = require('fs')
const route = express.Router()

const path = require('path')

const fs = require('fs')

const bycrypt = require('bcrypt')

const oracledb  =  require('oracledb')

const clean = require('../databasemanagementMYSQL/clean')

const formidable =require('formidable')


const db = require('../databasemanagementMYSQL/DBManager')
const DBcon = new db()

const handleDbReq = require('./../../oracleDBManager/dbmanager')

const serveRequest = new handleDbReq()

route.post('/add/user',   (req, res)=>{

var form = new formidable.IncomingForm()
form.parse(req, function(err, fields, files){



    var newUser = {

        profileImage : clean.CleanData(new String(files.profileImage.name)),
        firstname : clean.CleanData(new String(fields.firstName)),
        lastname : clean.CleanData(new String(fields.lastName)),
        username : clean.CleanData(new String(fields.userName)),
        DOB : new Date(fields.age),
        email : clean.CleanData(new String(fields.userEmail)),
        conEmail : clean.CleanData(new String(fields.conUserEmail)),
        continent : clean.CleanData(new String(fields.continent)),
        country : clean.CleanData(new String(fields.country)),
        townCity : clean.CleanData(new String(fields.city)),
        address : clean.CleanData(new String(fields.address)),
        mobileTel : clean.CleanData(new String(fields.telno)),
        workTel : clean.CleanData(new String(fields.worktelno)),
        facebook : clean.CleanData(new String(fields.facebook)),
    instagram : clean.CleanData(new String(fields.instagram)),
    linkedln : clean.CleanData(new String(fields.linkedln)),
    twitter : clean.CleanData(new String(fields.twitter)),
    youtube : clean.CleanData(new String(fields.youtubelink)),
    github : clean.CleanData(new String(fields.github)),
    password : clean.CleanData(new String(fields.password)),
    conpasswd : clean.CleanData(new String(fields.conUserPasswd))
    }

    var fname, lname, uname, email, mobTel, wokTel, youtube, continent, country, town, dob, address, passwd, profileImg , facebook, instagram, twitter, linkedln, github= null;
    var fnameErr, lnameErr, unameErr, emailErr,conemailErr, mobTelErr, wokTelErr, continentErr, countryErr, townErr, dobErr, addressErr, passwdErr, conpasswdErr, profileImgErr = null;

//first Name Validation

    if(newUser.firstname.match(/^[a-zA-Z\s]+$/)){

       fname = newUser.firstname;
    }else{

    fnameErr = "required to be letters and space only";
    }

    //last Name Validation

 if(newUser.lastname.match(/^[a-zA-Z\s]+$/)){

lname = newUser.lastname;

        }else{

            lnameErr = "required to be letters and space only"

        }



    //User Name Validation


    if(newUser.username.match(/^[a-zA-Z0-9\s]+$/)){

uname = newUser.username
               

    }else{

        unameErr = "required letters and numbers only, no space"
    }

    //work tel input validation

    if(newUser.workTel.match(/^[+]?[0-9]/) && newUser.workTel.length >= 9 && newUser.workTel.length <= 14){


        wokTel = newUser.workTel

    }else{

       

        wokTelErr = "Expected  numbers and + only or you entered an invalid number "

    }

    // mobile tel validation

    if(newUser.mobileTel.match(/^[+]?[0-9]/) && newUser.mobileTel.length >= 9 && newUser.mobileTel.length <= 14){

               mobTel = newUser.mobileTel       

    }else{

         
        mobTelErr = "Expected  numbers and + only or you entered an invalid number"
    }

// location continet country town validation

if(newUser.continent.match(/^[a-zA-Z0-9\s]+$/)&& newUser.country.match(/^[a-zA-Z0-9\s]+$/)&&newUser.townCity.match(/^[a-zA-Z0-9\s]+$/)){

                       continent = newUser.continent
                       country = newUser.country
                       town = newUser.townCity
}else{

    continentErr = "Expected letters space and numbers only on location"
}

// Email validation

if(newUser.email.match(newUser.conEmail)){

                 email= newUser.email   

}else{

    emailErr = "Email and confirm email do not match"

}

//password Validation

if(newUser.password.match(newUser.conpasswd)){

    if(newUser.password.match(/^.*(?=.{6})(?=.*[0-9])(?=.*[A-Z]).*$/)){

     passwd = bycrypt.hashSync(newUser.password,  bycrypt.genSaltSync(10) )
   
        

    }else{

passwdErr = "Password must contain at least one capital letter , one digital number and \n it must be at least six characters "
    }

}else{

passwdErr= "Password do not match"
}

//profileImage Validation

   

  if(  handleImageUpload(files)){



    profileImg = files.profileImage.name

  }else{

    profileImgErr = "invalid image type \n Expected .png, .jpg, .jpeg" 
  }

//dob social media validation

if(newUser.facebook != null || !newUser.facebook.match('') || newUser.facebook != undefined){

    facebook = newUser.facebook
}

if(newUser.instagram != null || !newUser.instagram.match('') || newUser.instagram != undefined){

    instagram = newUser.instagram
}

if(newUser.twitter != null || !newUser.twitter.match('') || newUser.twitter != undefined){

    twitter = newUser.twitter
}

if(newUser.linkedln != null || !newUser.linkedln.match('') || newUser.linkedln != undefined){

    linkedln = newUser.linkedln
}

if(newUser.github != null || !newUser.github.match('') || newUser.github != undefined){

    github = newUser.github
}

if(newUser.youtube != null || !newUser.youtube.match('') || newUser.youtube != undefined){

    youtube = newUser.youtube
}
//date validation



dob =  newUser.DOB



//address validation

address = newUser.address

//submit validation

if(fname!=null && lname!=null && uname!=null && email!=null && wokTel!=null && continent!=null && country!=null && town!=null && address!=null && passwd !=null && dob !=null && profileImg !=null ){


  
var profileIg = uname+'_'+Date.now()+'_'+Math.round(Math.random()* 1E9)+'.'+profileImg.split('.')[1]
    var inputs = {


        username : uname,
        firstname : fname,
        lastname : lname,
        email : email,
        password : passwd,
        mobileTel : mobTel,
        profileImage :profileIg,
        continent : continent,
        country : country,
        townCity : town,
        address : address,
        DOB : dob,
        facebook : facebook,
        linkedln : linkedln,
    twitter : twitter,
    youtube : youtube,
    github : github,
    instagram : instagram,
    workTel : wokTel,
        tablename: "USERS",
        operation : "insert"

    }
  
 console.log(inputs)
    serveRequest.run(inputs).then(function(feedback){

        console.log(feedback.result)
        if(feedback.code == 200){

            var oldPath = files.profileImage.path

            var newPath = path.join(__dirname, './../images') +'/'+profileIg        
            console.log(newPath)
            var rawData = fs.readFileSync(oldPath)
        
            fs.writeFileSync(newPath, rawData, function(err){
        
                if(err){
        
                    console.log(err)
                }else{
        
                    console.log('image uploaded successfully')
                }
            })
            console.log(feedback.result)

            res.send("User Successfully Registered")
        }else{

            res.render('Register/index', {error : "Username or Email already Exists",profileError: profileImgErr,fnErr: fnameErr, lnErr: lnameErr, unErr: unameErr, emErr: emailErr, contErr: continentErr, passErr: passwdErr, wokrTelErr: wokTelErr, mobileErr: mobTelErr, firstName: fname, lastName: lname, userName: uname, email: email, confimEmail: confirmEmail, country: country, continent: continent, townCity: town, address: newUser.address, wokyTel: wokTel, mobyTel: mobTel , profileImage: profileImg})
        }


   
    })

   

}else{

    var confirmEmail= newUser.conEmail;

    console.log(fname+" : "+lname+" : "+uname+" : "+email+" : "+wokTel+" : "+continent+" : "+country+" : "+town+" : "+address+" : "+passwd+" : "+dob+" : "+profileImg);
res.render('Register/index', {profileError: profileImgErr,fnErr: fnameErr, lnErr: lnameErr, unErr: unameErr, emErr: emailErr, contErr: continentErr, passErr: passwdErr, wokrTelErr: wokTelErr, mobileErr: mobTelErr, firstName: fname, lastName: lname, userName: uname, email: email, confimEmail: confirmEmail, country: country, continent: continent, townCity: town, address: newUser.address, wokyTel: wokTel, mobyTel: mobTel , profileImage: profileImg})
}

})

})





function handleImageUpload(files){
        if(!files.profileImage){
    
            return false;
        }else{
    
            
            let ext = files.profileImage.name.split('.')[1].toLowerCase();

            if(ext.match( 'png') || ext.match('jpg')|| ext.match('jpeg')){

                     return true;

            }else{

                return false;
            }

        }
}




module.exports = route;