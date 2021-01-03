if(document){
document.addEventListener("DOMContentLoaded", function(event) {
    fetch('https://localhost:3737/facebook/profile')
        .then(response => response.json())
        .then(data => renderProfilePic(data));

     function renderProfilePic(userData){
         console.log(userData);
         var img = document.createElement('img');
         img.src = userData && userData.photos && userData.photos[0].value;
         var imageHolder = document.getElementById("image");
         imageHolder.appendChild(img);
     }   
});
}