export default function showOverlay(elementID, what){
   let overlay = document.getElementById(elementID);
   if(overlay===null){
       return;
   }
   if(what){
       if (what === "show") {
           overlay.classList.add('fadeInANM');
           overlay.classList.remove('fadeOutANM');

           overlay.style.display = "flex";
       } else {
           overlay.classList.remove('fadeInANM');
           overlay.classList.add('fadeOutANM');

           setTimeout(() => {overlay.style.display = "none"}, 300);
       }
   }else{
       if (overlay.style.display === "none") {
           overlay.classList.add('fadeInANM');
           overlay.classList.remove('fadeOutANM');

           overlay.style.display = "flex";
       } else {
           overlay.classList.remove('fadeInANM');
           overlay.classList.add('fadeOutANM');

           setTimeout(() => {overlay.style.display = "none"}, 300);
       }
   }

}