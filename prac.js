const handleDbReq = require('./oracleDBManager/dbmanager')


const serveRequest = new handleDbReq()

 var id =  new Date() * Math.round(Math.random()* 100);

var j = {

    
    tablename: "BUSINESSCATEGORIES",
    operation: "insert",
   
    ID : ""+id+"",
    MAINCATEGORY: "wholesales",

    SUBCATEGORY: "shopping centers"

   

}

var k = {

    fields : ["MAINCATEGORY", "SUBCATEGORY", "ID"],
    tablename : "BUSINESSCATEGORIES",
    operation : "select"
}

serveRequest.run(k).then(function(suc){

    console.log(suc.code)
}, function(err){

    console.log(err)
})