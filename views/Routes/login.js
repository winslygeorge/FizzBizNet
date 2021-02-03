const express = require('express')
const { password } = require('../../oracleDBManager/dbconfig')
const oracledb =  require('./../../oracleDBManager/dbmanager')

const bycrypt = require('bcrypt')

const Clean = require('./../databasemanagementMYSQL/clean')

const route = express.Router()

route.get('/loginUser', (req, res)=>{
let db =  new oracledb()
var userCredidentials;
if(req.query.userName.indexOf('@') != -1){


    userCredidentials = {

        tablename : "users",
    
        operation : "select",
    
        fields : ["username", "password", "email"],
        wfield : ["email"],
        wvalue : [Clean.CleanData(req.query.userName)]
    }
 
}else{

    userCredidentials = {

        tablename : "users",
    
        operation : "select",
    
        fields : ["email", "password", "username", "profileimage"],
        wfield : ["username"],
        wvalue : [req.query.userName]
    }

}

db.run( userCredidentials).then(function(feedback){

    if(feedback.code == 200 ){

        let passd = feedback.result.rows[0].PASSWORD


       if (bycrypt.compareSync(req.query.passwd, passd)){



        req.session.isAuth  =  true

        req.session.userDetails  =  {

            username : feedback.result.rows[0].USERNAME,
            email : feedback.result.rows[0].EMAIL,
            profileimage : feedback.result.rows[0].PROFILEIMAGE

        }

        res.render('serviceApp/index')

       }else{


        res.redirect('/login')
       }
      
    }else{

        console.log(feedback.code)

        res.redirect('login')
    }
})


})

module.exports = route