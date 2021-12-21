$.ajaxSetup({
    beforeSend: function beforeSend(xhr, settings) {
        function getCookie(name) {
            let cookieValue = null;


            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');

                for (let i = 0; i < cookies.length; i += 1) {
                    const cookie = jQuery.trim(cookies[i]);

                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (`${name}=`)) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }

            return cookieValue;
        }

        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        }
    },
});

const txt = document.getElementById('id_text')
const photo = document.getElementById('id_photo')
const alertBox = document.getElementById('alert-box')
const imgbox = document.getElementById('img-box')
const handleAlerts = (type,text,color)=>{
    alertBox.innerHTML = `<div role="alert">
    <div class="bg-${color}-500 text-white font-bold rounded-t px-4 py-2">
      ${type}
    </div>
    <div class="border border-t-0 border-${color}-400 rounded-b bg-${color}-100 px-4 py-3 text-${color}-700">
      <p>${text}</p>
    </div>
  </div>`
}
var url = ""
var img_data = ""
var file = ""
let photos = document.getElementById('id_photo')
const fd = new FormData()
// TODO:Photo listener
photos.addEventListener("change",function(e){
    e.preventDefault()
        img_data = photos.files[0]
        url = URL.createObjectURL(img_data)
        console.log(url)
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            console.log(reader.result);
          }, false);
        
          if (file) {
            reader.readAsDataURL(img_data);
          }
        //   $(".img-box").toggleClass("hidden")
        //   $(".js-model").addClass("hidden")
          imgbox.src=`${url}`
        //   imgbox.innerHTML = `<img class="flex" src="${url}" width="315px" height="315px" style="margin:auto; padding-bottom:1rem"><br><br>`
          fd.append('photo',photos.files[0])
         


          
})

$(document).on("click",".js-toggle-model",function(e){
    e.preventDefault()
    console.log("I was clicked")
    $(".js-model").toggleClass("hidden")
})
// TODO:Upload
.on("click",".js-submit",function(e){
    e.preventDefault()
    const text = $(".js-post-text").val().trim()
    const imgLength = $(".js-post-photo").val()
    const number_of_posts = $("#posts").text()
    const $btn = $(this)
    const $fvalue = $(".js-follower-text")
    console.log(imgLength.length)
    if(!imgLength.length){
        handleAlerts('Danger','Please upload any image','red')
        return false
    }
    if(!text.length){
        handleAlerts('Danger','Please fill the photo description','red')
        return false
    }

    fd.append('text',text)
   
    // TODO:Photo 

    $btn.prop("disabled", true).text("Posting!")
    $.ajax({
        type: 'POST',
        url: $(".js-post-text").data("post-url"),
        enctype:'multipart/form-data',
        data: fd,  
        success: (dataHtml) => {
           
            $("#posts-container").prepend(dataHtml);
            $btn.prop("disabled", false).text("Create Post");
            document.getElementById("posts").innerText = Number(number_of_posts) + 1
            handleAlerts('success','Succesfully saved','green')
            setTimeout(()=>{
                alertBox.innerHTML=""
                $(".js-post-text").val('')
                photos.value=""
                imgbox.innerHTML=""
                imgbox.src=""
                $(".js-model").addClass("hidden")
               
            },2000)
            
        },
        error: (error) => {
            console.warn(error)
            $btn.prop("disabled", false).text("Error");
            handleAlerts('Danger','Something went wrong','red')
        },
        cache:false,
        contentType:false,
        processData:false,
    });

})

// TODO:Follow Unfollow
.on("click",".js-follow",function(e) {
    e.preventDefault();
    console.log("Clicked")
    const action = $(this).attr("data-action")
    $.ajax({
        type: 'POST',
        // url: $(this).data("follow-url"),
        url: $(this).data("url"),
        enctype:'multipart/form-data',
        data: {
            action: action,
            username: $(this).data("username"),
        },  
        success: (data) => {
           $(".js-follow-text").text(data.wording)
           if(action == "follow"){
               $(this).attr("data-action","unfollow")
              
                
           }else{
            // $("#follow-container").prepend(data)
            $(this).attr("data-action","follow")
           }
          
            
        },
        error: (error) => {
            console.warn(error)
      
        },
    });
})







    
