const handleDbReq = require('./oracleDBManager/dbmanager')


const serveRequest = new handleDbReq()

 var id =  new Date() * Math.round(Math.random()* 100);

var j = {

    
    tablename: "bookings",
    operation: "update",
   
    quantity : 9,

    

    where : "id",

    val : 12902199484552
}

var k = {

    fields : ["MAINCATEGORY", "SUBCATEGORY", "ID"],
    tablename : "BUSINESSCATEGORIES",
    operation : "select"
}

serveRequest.run(j).then(function(suc){

    console.log(suc.result)
}, function(err){

    console.log(err)
})