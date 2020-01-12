     function myFunction() {
     var y = document.getElementById("myText").value;
     var x = document.getElementById("myDIV");
     var z = document.getElementById("yourDIV");
     var zz = document.getElementById("loginDIV");
     if (y === "BillingsSWMT") {
         if (x.style.display === "none") {
           x.style.display = "block";
         } else {
           x.style.display = "none";
         }
       zz.style.display= "none";
     } else {
      z.style.display = "block";
     }
     
     }