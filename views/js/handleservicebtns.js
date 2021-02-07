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

function handlecommentbtn(id, username, profileimage){

  var comment =  $('#comment').val() 

  alert( comment+ " : "  + id + " : "+ username ) 

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      

      var resq = JSON.parse(this.responseText)

      if(resq.code == 200){

        console.log(resq.result)

        var jsonres =resq.result

        var resultcounter =jsonres.length-1
        var innert = ''
        while( resultcounter >= 0){


          var commentt = resq.result[resultcounter]
          innert = innert + ` <div class="review">
          <div class="clientDetail">

              <div class="profileImg">
                  <img src="./../images/${commentt.PROFILEIMAGE}" alt="" srcset="">

              </div>

              <div class="profilename"> <h5>${commentt.USERNAME}</h5></div>
             
          </div>
         
          <p>${commentt.BUSINESSREVIEWS}</p>

      </div>`;

          resultcounter--;
        }

        document.getElementById('reviewsSection').innerHTML = innert;


      }else{

        console.log(resq.result)

      }
    }
  };
  xhttp.open("POST", "/postcomment", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("comment="+comment+"&username="+username+"&appid="+id+"&profileimage="+profileimage);
}

function handleEmailBtn(appemail, useremail, username, profileimage){


  var content =  $('#content').val()

  var topic =  $('#topic').val()


  var email =  ''

  if($('#email').val()  == '' ){

    email  = useremail
  }else{

    email  = $('#email').val()
  }



  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      

      var resq = JSON.parse(this.responseText)

      if(resq.code == 200){

       alert('Email was posted successfully')
      }else{

        alert('Error submitting email...\n please try again')
        console.log(resq.result)

      }
    }
  };
  xhttp.open("POST", "/postemail", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("email="+email+"&username="+username+"&appemail="+appemail+"&profileimage="+profileimage+"&topic="+topic+"&content="+content);


}