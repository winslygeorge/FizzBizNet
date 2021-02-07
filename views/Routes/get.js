const { parse } = require('cookie')
const  express = require('express')
const route = express.Router()

const db = require('./../../oracleDBManager/dbmanager')

const dbcon = new db()

const isbizSet = (req, res, next)=>{

    if(req.session.appid != null && req.session.appid != undefined && req.session.isAuth == true){

        next()
    }else{

        res.redirect('/AddService')
    }
}

const isAppID = (req, res, next)=>{

    if(req.session.appid != null && req.session.appid != undefined){

        next()
    }else{

        res.redirect('/AddService')
    }
}

const isAuth = (req, res, next)=>{

    if(req.session.isAuth){

        next()
    }else{

        res.redirect('/login')
    }
}

route.get('/AddService', isAuth, (req, res)=>{

    res.render('AddService/index');
})

route.get('/Register', (req, res)=>{

    res.render('Register/index', {name: "winslow"});
})

route.get('/login', (req, res)=>{

    res.render('login/index', {name: "winslow"});
})

route.get('/sdetailsa', isbizSet , (req, res)=>{

    res.render('servicedetails/index')
})

route.get('/asublocation', isbizSet,  (req, res)=>{

    res.render('AddService/location')
})



route.get('/addimages', isbizSet, (req, res)=>{

    res.render('AddService/images')
})

route.get('/addvideos', isbizSet,  (req, res)=>{

    res.render('AddService/videos', )
})


route.get('/profile/:id', isAuth, (req, res)=>{

let userProfile = req.params.id 

var query = {

    tablename : "users",
    operation : "select",

    fields : [],

    wfield : ["username"],

    wvalue : [req.params.id]
}

dbcon.run(query).then(function(results){

 if(results.code == 200){

    res.render('profile/index', {row : results.result.rows[0], loggedUser: req.session.userDetails})
 }

}, function(err){

    console.log(err)
    
});
})

route.get('/app/:id', (req, res)=>{

    let bizProfile = req.params.id 
    var videos, services, images, location , related, social , ratings , reviews= null;
    
    var query = {
    
        tablename : "businessapp",
        operation : "select",
    
        fields : [],
    
        wfield : ["businessname"],
    
        wvalue : [req.params.id]
    }
    
    dbcon.run(query).then(function(results){
    
     if(results.code == 200){

        var row = results.result.rows[0]

        var servicequery = {
    
            tablename : "services",
            operation : "select",
        
            fields : [],
        
            wfield : ["businessid"],
        
            wvalue : [row.ID]
        }

        dbcon.run(servicequery).then(function(results){

            if(results.code == 200 ){


                services = results.result.rows

                var imagequery = {
    
                    tablename : "businessimages",
                    operation : "select",
                
                    fields : [],
                
                    wfield : ["businessappid"],
                
                    wvalue : [row.ID]
                }

                dbcon.run(imagequery).then(function(results){

                    if(results.code == 200){


                         images = results.result.rows

                        var videosquery = {
    
                            tablename : "businessvideos",
                            operation : "select",
                        
                            fields : [],
                        
                            wfield : ["businessappid"],
                        
                            wvalue : [row.ID]
                        }

                        dbcon.run(videosquery).then(function(results){

                            if(results.code == 200){




                            videos = results.result.rows

                                var locationquery = {
    
                                    tablename : "locations",
                                    operation : "select",
                                
                                    fields : [],
                                
                                    wfield : ["businessappid"],
                                
                                    wvalue : [row.ID]
                                }

                                dbcon.run(locationquery).then(function(results){

                                    if(results.code == 200 ){

                                      location = results.result.rows

                                      
                                var relatedquery = {
    
                                    tablename : "businessapp",
                                    operation : "select",
                                
                                    fields : [],
                                
                                    wfield : ["businesscategory"],
                                
                                    wvalue : [row.BUSINESSCATEGORY]
                                }

                                dbcon.run(relatedquery).then(function(results){

                                    if(results.code == 200){

                                      related = results.result.rows

                                      var socialquery = {
    
                                        tablename : "businesssocialmedia",
                                        operation : "select",
                                    
                                        fields : [],
                                    
                                        wfield : ["businessappid"],
                                    
                                        wvalue : [row.ID]
                                    }

                                    dbcon.run(socialquery).then(function(results){

                                        if(results.code == 200){

                                            social = results.result.rows

                                            var ratingquery = {
    
                                                tablename : "ratings",
                                                operation : "select",
                                            
                                                fields : [],
                                            
                                                wfield : ["businessappid"],
                                            
                                                wvalue : [row.ID]
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

                     var startcounter = 0

                     ratings = []

                     while(startcounter < averagerating){

                        ratings.push(startcounter)

                        startcounter++;
                     }


                     var commentquery = {
    
                        tablename : "businessreviews",
                        operation : "select",
                    
                        fields : [],
                    
                        wfield : ["businessappid"],
                    
                        wvalue : [row.ID]
                    }
        
        
                    dbcon.run(commentquery).then(function(results){
        
                        if(results.code == 200){
        
                     
                            reviews = results.result.rows
        
                            console.log("results successful")

                            if(req.session.userDetails != null && req.session.userDetails != undefined){


                                var newLike = {

                                    id : new Date()* Math.round(Math.random()*17),
                                    username : req.session.userDetails.username,
                                    businessappid : row.ID,
                                    tablename : 'views',
                                    operation: 'insert'
                                }
                            
                                if(newLike.id != null && newLike.id != undefined && newLike.username != null && newLike.username != undefined  && newLike.businessappid != null && newLike.businessappid != undefined ){
                            
                                    dbcon.run(newLike).then(function(results){
                            
                                        if(results.code == 200){
                            
                                           console.log({code : 200, result: "Like successful"})
                                        }else{
                                            console.log({code : 101, result: "already liked"})
                            
                                        }
                                    })
                                }else{
                            
                                    console.log({code : 101, result: "error"})
                            
                                }
                            
                            }

                                    

                            res.render('serviceApp/index', {comments: reviews, ratings : ratings, loggedUser : req.session.userDetails, social : social, row : row, videos : videos, images : images, services: services, location: location, related : related, loggedUser: req.session.userDetails})
       
               
                        }else{
        
                            console.log(results.result)
        
                            res.render('serviceApp/index', {comments: reviews, ratings : ratings, loggedUser : req.session.userDetails, social : social, row : row, videos : videos, images : images, services: services, location: location, related : related, loggedUser: req.session.userDetails})
                        }
                    })

                                                }else{
                                                    res.render('serviceApp/index', {comments: reviews, ratings : ratings, loggedUser : req.session.userDetails, social : social, row : row, videos : videos, images : images, services: services, location: location, related : related, loggedUser: req.session.userDetails})


                                                }
                                            })

                                    
                                        }else{

                                            res.render('serviceApp/index', {comments: reviews, ratings : ratings, loggedUser : req.session.userDetails, social : social, row : row, videos : videos, images : images, services: services, location: location, related : related, loggedUser: req.session.userDetails})

                                        }
                                    })


                                    }else{

                                        console.log(results.result)
                                        res.render('serviceApp/index', {comments: reviews, ratings : ratings, loggedUser : req.session.userDetails, social : social, row : row, videos : videos, images : images, services: services, location: location, related : related, loggedUser: req.session.userDetails})


                                    }
                                })


                                    }else{

                                        console.log(results.result)
                                        res.render('serviceApp/index', {comments: reviews, ratings : ratings, loggedUser : req.session.userDetails, social : social, row : row, videos : videos, images : images, services: services, location: location, related : related, loggedUser: req.session.userDetails})

                                    }
                                })

                               

                            }else{

                                console.log(results.result)

                                res.render('serviceApp/index', {comments: reviews, ratings : ratings, loggedUser : req.session.userDetails, social : social, row : row, videos : videos, images : images, services: services, location: location, related : related, loggedUser: req.session.userDetails})
                            }
                        })

                    }else{

                        console.log(results.result)

                        res.render('serviceApp/index', {comments: reviews, ratings : ratings, loggedUser : req.session.userDetails, social : social, row : row, videos : videos, images : images, services: services, location: location, related : related, loggedUser: req.session.userDetails})
                    }
                })


            }else{

                console.log(results.result)

                res.render('serviceApp/index', {comments: reviews, ratings : ratings, loggedUser : req.session.userDetails, social : social, row : row, videos : videos, images : images, services: services, location: location, related : related, loggedUser: req.session.userDetails})


            }
        })
    
     }else{

        console.log(results.result)

        res.render('Error/index')

     }
    
    }, function(err){
    
        console.log(err)
        
    });
    })

    route.get('/apps/:id', (req, res)=>{

var catid = req.params.id

var wholesales = []
var  lifestyle = []
var  beauty =[]
var  technology = []
var  education = []
var consultancy = []
if(catid != null && catid != undefined && catid != ''){


    if(catid.match('all')){


                var appsquery = {
    
                    tablename : "businessapp",
                    operation : "select",
                
                    fields : []
                }

                dbcon.run(appsquery).then(function(results){

                    if(results.code  == 200){

                        var apps = results.result.rows

                        var appcounter = 0

                        while(appcounter < apps.length){

                            var app = apps[appcounter]
                           
                            if(`${apps[appcounter].BUSINESSCATEGORY}`.startsWith('1')){


                                wholesales.push(app)
                            }else if(`${apps[appcounter].BUSINESSCATEGORY}`.startsWith('2')){

                                lifestyle.push(app)
                            }else if(`${apps[appcounter].BUSINESSCATEGORY}`.startsWith('3')){

                             beauty.push(app)
                            }else if(`${apps[appcounter].BUSINESSCATEGORY}`.startsWith('4')){

                                technology.push(app)
                            }else if(`${apps[appcounter].BUSINESSCATEGORY}`.startsWith('5')){

                                education.push(app)
                            }else if(`${apps[appcounter].BUSINESSCATEGORY}`.startsWith('6')){

                                consultancy.push(app)
                            }else{

                                console.log("Category id not defined")

                            }

                            appcounter++;
                        }


                        res.render( 'homezapps/index',{loggedUser : req.session.userDetails, appscat : {wholesales : wholesales, beauty : beauty, lifestyle : lifestyle, technology : technology, education : education, consultancy: consultancy} })
                    }else{

                        res.send({error : 404, text : "Could not get the apps try again..."})

                    }

                })

            }

}else{

    res.send({error : 404, text : "App does not Exist"})
}
    })
module.exports = route;