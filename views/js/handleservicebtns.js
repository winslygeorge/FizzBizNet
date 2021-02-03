$(document).ready(function(e){

    e.preventDefault()

})


function handleorderbtn(id){


    alert(id )

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        var result = JSON.parse(this.responseText)

        if(result.code == 200 ){

            alert("You have successfully placed a sevice order...")

        }else{


            alert("An Error occurred when placing the order")
        }
      }
    };
    xhttp.open("POST", "/placeorder", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("serviceid="+id);
}

function handleRateBtn(){

    $('#ratediv').fadeToggle()
}

function handleSubRateBtn(loggeduser, id){

    alert($('.starCheck').length)

    var starRateNo  =  0;
for (const key in $('.starCheck')) {
    if ($('.starCheck').hasOwnProperty(key)) {
        const element = $('.starCheck')[key];

        if(element.src  == "http://localhost:8082/images/star.svg"){


            starRateNo = starRateNo + 1
        }
        
    }
}

console.log(starRateNo);

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange=function() {
  if (this.readyState == 4 && this.status == 200) {


      var resp  = JSON.parse(this.responseText)

      console.log(resp.code)

      if(resp.code == 200 ){

        console.log("working")

var startcounter = 0;
var innert = ''
        while( startcounter < resp.result){


            innert = innert + '<img src="./../images/star.svg" alt="" style="width: 20px;"> ';


            startcounter = startcounter + 1
        }

        document.getElementById('starRate').innerHTML = innert;


      }else{

        console.log("error occurred...")
      }
   
      $('#ratediv').fadeToggle()
  }else{

    $('#ratediv').fadeToggle()
  }
};
xhttp.open("POST", "/updateapprate", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("loggeduser="+loggeduser+"&starno="+starRateNo+"&appid="+id);

}
function startClicked(no){

    alert(no)

   if( document.getElementById(no).getAttribute('src') == "./../images/star (1).svg"){

    document.getElementById(no).setAttribute('src', "./../images/star.svg")

   }else{

    document.getElementById(no).setAttribute('src', "./../images/star (1).svg")
   }



}

function handlecommentbtn(id, username){

  alert(  $('#comment').val() + " : "  + id + " : "+ username ) 
}