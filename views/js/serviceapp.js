var x = document.getElementsByClassName("imagesIng");


$(document).ready(function(){



if($(document).width() < 771){

    $('.galleryImages').attr('class', 'imagesIng');

    var myIndex = 0;

    //carousel();

    $('#imgNext').on('click' , function(){

    
        myIndex++;
        if (myIndex > x.length) {myIndex = 1}

        $( "#"+ x[myIndex-1].getAttribute("id")).fadeToggle();
    });
    
    $('#imgBack').on('click' , function(){

    
        myIndex--;
        if (myIndex > x.length|| myIndex< 0) {myIndex = 1}

        $( "#"+ x[myIndex-1].getAttribute("id")).fadeToggle();
    });

}else{

    $('.imagesIng').attr('class', 'galleryImages').css('display', 'inline-block');

}
   
})






function carousel() {
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}

    $( "#"+ x[myIndex-1].getAttribute("id")).fadeToggle();
   
   // x[myIndex-1].style.display = "block"; 
    
  if($(document).width() < 771){

    setTimeout(carousel, 8000);   
  }
     
  }