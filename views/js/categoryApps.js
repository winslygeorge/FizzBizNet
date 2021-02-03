$(document).ready(function(){

    $('.intro').animate({
        left: "0%"
    }, 3000);

    $('.subHead').animate({right: "0%"}, 3000)

    $('.menuIconCat').on('click', function(){

     
        $('.slideExplorenav').animate({

            left: "0%"
        }, 800);
    });


 $('.menuIconCaton').on('click', function(){

    
        $('.slideExplorenav').animate({

          
            left: "-70%"
        }, 800);
    });


});


