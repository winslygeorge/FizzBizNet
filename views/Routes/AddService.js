const express = require('express')

const formidable = require('formidable')

const clean  =  require('./../databasemanagementMYSQL/clean')

const db  =  require('./../../oracleDBManager/dbmanager')

const path = require('path')

const fs = require('fs')

const dbcon  =  new db()

const route = express.Router()

const isbizSet = (req, res, next)=>{

    if(req.session.appid != null && req.session.appid != undefined && req.session.isAuth){

        next()
    }else{

        res.redirect('/AddService')
    }
}

route.post('/addService',  (req, res)=>{

    console.log(req.body)

    var form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files)=>{

        var bizApp ;

        var businessName , businessIcon, bizMission, bizEmail, hqContinent, hqCountry, hqTown, hqAddress, bizRange, bizTopic, bizIntro, bizCat = null

        var businessNameErr , businessIconErr, bizMissionErr, bizEmailErr, hqContinentErr, hqCountryErr, hqTownErr, hqAddressErr, bizRangeErr, bizTopicErr, bizIntroErr, bizCatErr = null

        if(!err){
//business name 

if(fields.businessName.match(/^[a-zA-Z0-9.\\\s]+$/)){

  businessName = clean.CleanData(fields.businessName)
                   
    
        }else{
    
           businessNameErr = "required letters and numbers only, no space"
        }

//business mission

if(fields.businessMission.match(/^[a-zA-Z0-9.\\\s]+$/)){

   bizMission = clean.CleanData(fields.businessMission)
                   
    
        }else{
    
           bizMissionErr = "required letters and numbers only, no space"
        }

//business introduction

if(fields.businessIntro.match(/^[a-zA-Z0-9.\\\s]+$/)){

   bizIntro = clean.CleanData(fields.businessIntro)
                   
    
        }else{
    
          bizIntroErr = "required letters and numbers only, no space"
        }
//business topic validation

if(fields.businessTopic.match(/^[a-zA-Z0-9.\\\s]+$/)){

   bizTopic = clean.CleanData(fields.businessTopic)
                   
    
        }else{
    
            bizTopicErr = "required letters and numbers only, no space"
        }

//business category validation

if(fields.category.match(/^[0-9]{3}/)){

   bizCat = fields.category
                   
    
        }else{
    
           bizCatErr = "required letters and numbers only, no space"
        }

//business email validation


bizEmail = clean.CleanData(fields.businessEmail)

         //location validation


if(fields.continent.match(/^[a-zA-Z0-9\s]+$/)&& fields.HQcountry.match(/^[a-zA-Z0-9\s]+$/)&&fields.HQcity.match(/^[a-zA-Z0-9\s]+$/)&&fields.range.match(/^[a-zA-Z0-9\s]+$/)){

    hqContinent = clean.CleanData(fields.continent)
    hqCountry =  clean.CleanData(fields.HQcountry)
    hqTown = clean.CleanData(fields.HQcity)
    hqAddress  =  clean.CleanData(fields.HQaddress)
    bizRange =  clean.CleanData(fields.range)
}else{

hqContinentErr = "Expected letters space and numbers only on location"
}


//brand image validation

if(  handleImageUpload(files)){



    businessIcon = files.businessIcon.name

  }else{

    businessIconErr = "invalid image type \n Expected .png, .jpg, .jpeg" 
  }

//handle socila media 

var social = { 

    facebook : clean.CleanData(fields.facebook),
    instagram : clean.CleanData(fields.instagram),
    twitter : clean.CleanData(fields.twitter),
    linkedln : clean.CleanData(fields.linkedln),
    github : clean.CleanData(fields.github),
    youtube : clean.CleanData(fields.youtube)

}
var profileIg = businessName+'_'+Date.now()+'_'+Math.round(Math.random()* 1E9)+'.'+businessIcon.split('.')[1]

  bizApp = {

    id : new Date() * Math.round(Math.random()*1000),
    businessname : businessName,
    brandicon : profileIg,
    mission : bizMission,
    businessemail : bizEmail,
    continent : hqContinent,
    country : hqCountry,
    towncity : hqTown,
    address : hqAddress,
    range : bizRange,
    shortintro : bizIntro,
    shorttopic : bizTopic,
    businesscategory :  parseInt(bizCat),

    operation : "insert",

    tablename : "BUSINESSAPP"
  }


  
if(bizApp.address != null && bizApp.brandicon != null && bizApp.businesscategory != null && bizApp.businessemail != null && bizApp.businessname != null && bizApp.continent != null && bizApp.country != null && bizApp.mission != null && bizApp.range != null && bizApp.shortintro != null && bizApp.shorttopic != null && bizApp.towncity != null){


    dbcon.run(bizApp).then(function(result){


        if(result.code == 200 ){


            var oldPath = files.businessIcon.path

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


            for (const key in social) {
                if (social.hasOwnProperty(key)) {
                    const element = social[key];

                    if(element != null && element != undefined && element != ''){

                        console.log("element is ok")

                        var mediaLink = {

                            id : new Date()* Math.round(Math.random()* 198),

                            socialname : element,

                            BUSINESSSOCIALMEDIALINK : key,

                           

                            businessappid : bizApp.id,
                            operation : "insert",

                            tablename : "businesssocialmedia"
                        }

                        dbcon.run(mediaLink).then(function(results){

                            if(results.code ==200 ){

                                console.log("social media submitted successfully")
                            }else{

                                console.log(results.result)
                            }
                        })
                    }
                    
                
            }
            }
          
            req.session.appid = bizApp.id
            req.session.appname =  bizApp.businessname
            res.redirect('/sdetailsa')
          
        }else{

            console.log(result.result)
            res.render('AddService/index', {error : "There was Error submitting... ", bizApp : bizApp})
        }
    }, function(err){
        console.log(result.result)
        res.render('AddService/index', {error : "There was Error submitting... ", bizApp : bizApp})

    })
}else{

    res.render('AddService/index', {businessIconErr : businessIconErr, bizCatErr : bizCatErr,  bizEmailErr: bizEmailErr, bizMissionErr : bizEmailErr, bizIntroErr : bizIntroErr, bizRangeErr : bizRangeErr, bizTopicErr : bizTopicErr, hqContinentErr: hqContinentErr, businessNameErr: businessNameErr, businessName : bizApp.businessname, businessMission : bizMission, businessEmail : bizEmail, businessIntro : bizIntro, businessTopic : bizTopic, businessRange : bizRange, businessCountry : hqCountry, businessTown : hqTown , businessAddress: hqAddress})
}
 
        }else{

            console.log(err)
            res.send('error submiting form')
        }
    })


})


route.post('/saddservice',isbizSet, (req, res)=>{

    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files)=>{


        if(!err){

            var serviceIcon, serviceIconErr = null

            if(  handleserviceIconUpload(files)){



                serviceIcon = files.serviceIcon.name
            
              }else{
            
                serviceIconErr = "invalid image type \n Expected .png, .jpg, .jpeg" 
              }



        let newservice = {

            id : new Date()* Math.round(Math.random() / Math.random())* 10,

            servicename : clean.CleanData(fields.serviceName),
            serviceicon : serviceIcon,
            
            servicedesc : clean.CleanData(fields.serviceDesc),
            price : parseFloat(fields.servicePrice),

            businessid : req.session.appid,
            tablename : "services",

            operation : "insert"
        }

        var profileIg = newservice.servicename+'_'+Date.now()+'_'+Math.round(Math.random()* 1E9)+'.'+newservice.serviceicon.split('.')[1]

newservice.serviceicon = profileIg;

console.log(newservice)


        if(newservice.id != null && newservice.servicedesc != null && newservice.servicename != null && newservice.price != null && newservice.serviceicon != null){


            dbcon.run(newservice).then(function(results){

                if(results.code == 200){


                    var oldPath = files.serviceIcon.path

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
        
        

                    res.render('servicedetails/index', {newService : " Service succcessfully submitted", serviceIconErr : serviceIconErr})

                }else{

                    console.log(results.result)

                    res.render('servicedetails/index', {newService : " Error  submitting service...", serviceIconErr : serviceIconErr})

                }
            })
        }else{

            res.render('servicedetails/index', {newService : " Error  submitting  Empty values...", serviceIconErr : serviceIconErr})

        }

        }

    })
    
})

route.post('/saddlocation', isbizSet,  (req, res)=>{

    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files)=>{


        if(!err){

        var hqContinent, hqCountry, hqTown, hqAddress , hqContinentErr= null     

if(fields.branchContinent.match(/^[a-zA-Z0-9\s]+$/)&& fields.branchHQcountry.match(/^[a-zA-Z0-9\s]+$/)&&fields.branchHQcity.match(/^[a-zA-Z0-9\s]+$/)){

    hqContinent = clean.CleanData(fields.branchContinent)
    hqCountry =  clean.CleanData(fields.branchHQcountry)
    hqTown = clean.CleanData(fields.branchHQcity)
    hqAddress  =  clean.CleanData(fields.branchHQaddress)
}else{

hqContinentErr = "Expected letters space and numbers only on location"
}

if(hqAddress !=null && hqContinent != null && hqCountry != null && hqTown != null && req.session.appid != undefined){


    var location = { 

        id : new Date() * Math.round(Math.random()*10),
        businessappid : req.session.appid,
        continent : hqContinent,
        country : hqCountry,
        towncity : hqTown,
        address : hqAddress,
         tablename : "locations",

         operation : "insert"
    }

    dbcon.run(location).then(function(results){

        if(results.code == 200){

            res.render('AddService/location', {newLocation : "New Sub Location was successfully submitted"})

        }else{

            console.log(results.result)

            res.render('AddService/location', {newLocation : "There was error submitting the new sub location"})

        }
    }, function(err){})

}else{

    res.render('AddService/location', {newLocation : hqContinentErr})

}

        }else{

            res.render('AddService/location', {newLocation : " Location succcessfully submitted"})

        }
    })
})

route.post('/addserviceimage', (req, res)=>{

    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files)=>{


        if(!err){

            var ImageIcon, ImageIconErr = null

            if(  handleserviceImagesUpload(files)){



                ImageIcon = files.img.name
            
              }else{
            
                ImageIconErr = "invalid image type \n Expected .png, .jpg, .jpeg" 
              }


              if(ImageIcon != null){

                var profileIg =req.session.appid+'_'+Date.now()+'_'+Math.round(Math.random()* 1E9)+'.'+ImageIcon.split('.')[1]


                var newImage = {

                    id : new Date()* Math.round(Math.random()*20),

                    businessappid : req.session.appid,

                    imagelink : profileIg,

                    tablename : "businessimages",

                    operation : "insert"
                }

                dbcon.run(newImage).then(function(results){

                    if(results.code == 200){

                        var oldPath = files.img.path

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
            

                        res.render('AddService/images', {newImage : "Service Image was submitted successfully..."})


                    }else{

                        console.log(results.result)
                        res.render('AddService/images', {newImage : "Error occurred during images submission...\n please retry again"})


                    }
                })
              }

        }else{

            res.render('AddService/images', {newImage : "Error occurred during images submission...\n please retry again"})

        }
    })


})
route.post('/addservicevideo', isbizSet,  (req, res)=>{

    
    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files)=>{


        if(!err){

            var newVideo =  {

                id : new Date()*Math.round(Math.random()*94),


                businessvideolink : clean.CleanData(fields.youtubeVideo),

                businessappid : req.session.appid,

              

                tablename : "businessvideos",

                operation : "insert"
            }

            if(newVideo.businessvideolink != null && newVideo.businessappid != null && newVideo.id != null){


                dbcon.run(newVideo).then(function(results){

                    if(results.code ==200){


                        res.render('AddService/videos', {newImage : "Video link was submitted sucessfully" , businessName : req.session.appname})


                    }else{

                        console.log(results.result)

                        res.render('AddService/videos', {newImage : "Error occurred during video submission...\n please retry again"  , businessName : req.session.appname})


                    }
                })

            }else{

                res.render('AddService/videos', {newImage : "Error occurred during video submission...\n please retry again"  , businessName : req.session.appname})

            }

        }else{

            res.render('AddService/videos', {newImage : "Error occurred during video submission...\n please retry again"  , businessName : req.session.appname})
 
        }
    })

})

route.post('/updateapprate', (req, res)=>{

    var startUpdate = {

        id : new Date()* Math.round(Math.random()* 2),

        username : clean.CleanData(req.body.loggeduser),

        businessappid : parseInt(clean.CleanData(req.body.appid)),

        ratingno : parseInt(clean.CleanData(req.body.starno)),

        tablename : "ratings",

        operation : "insert"

     
    } 

    if(startUpdate.businessappid != null && startUpdate.businessappid != undefined && startUpdate.id != null && startUpdate.id != undefined && startUpdate.ratingno!= null && startUpdate.ratingno != undefined  && startUpdate.username != null && startUpdate.username != undefined){

        console.log("am in")

        dbcon.run(startUpdate).then(function(results){

            if(results.code == 200  ){

                var ratingquery = {
    
                    tablename : "ratings",
                    operation : "select",
                
                    fields : [],
                
                    wfield : ["businessappid"],
                
                    wvalue : [startUpdate.businessappid]
                }
                dbcon.run(ratingquery).then(function(results){

                    if(results.code == 200){


                     var totaluser =   results.result.rows.length

                     var ratings = results.result.rows

                     var totalratings = 0

                     ratings.forEach(element => {

                       totalratings= totalratings + element.RATINGNO
                         
                     });

                     var averagerating = Math.round(totalratings/totaluser)

                     res.send({code : 200, result : averagerating})

                    }else{

                        res.send({code : 101, result : "Error getting ratings"})

                    }
                })
            }else{

                console.log(results.result)
                res.send({code : 101, result : "Error ocuured ..."})
            }
        })
    }else{

        res.send({code : 101, result : "Error ocuured ..."})
    }
})

route.post('/placeorder', (req, res)=>{

    var order = {

        id : new Date()* Math.round(Math.random()* 8),

        username : req.session.userDetails.username,
        serviceid : parseInt(clean.CleanData(req.body.serviceid)),

        tablename : "bookings",

        operation : "insert"

     
    } 


    if( order.id != null && order.id != undefined && order.serviceid != null && order.serviceid != undefined && order.username != null && order.username != undefined){
 

        dbcon.run(order).then(function(results){

            if(results.code == 200){

                res.send({code : 200})
            }else{


                console.log(results.result)
                res.send({code : 101})
            }
        })

    }else{


        console.log("An empty field..")
        res.send({code : 101})
    }

})
module.exports = route


function handleImageUpload(files){
    if(!files.businessIcon){

        return false;
    }else{

        
        let ext = files.businessIcon.name.split('.')[1].toLowerCase();

        if(ext.match( 'png') || ext.match('jpg')|| ext.match('jpeg')){

                 return true;

        }else{

            return false;
        }
    
    }
}

function handleserviceIconUpload(files){
    if(!files.serviceIcon){

        return false;
    }else{

        
        let ext = files.serviceIcon.name.split('.')[1].toLowerCase();

        if(ext.match( 'png') || ext.match('jpg')|| ext.match('jpeg')){

                 return true;

        }else{

            return false;
        }
    
    }
}

function handleserviceImagesUpload(files){
    if(!files.img){

        return false;
    }else{

        
        let ext = files.img.name.split('.')[1].toLowerCase();

        if(ext.match( 'png') || ext.match('jpg')|| ext.match('jpeg')){

                 return true;

        }else{

            return false;
        }
    
    }
}