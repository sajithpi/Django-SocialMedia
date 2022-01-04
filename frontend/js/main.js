$.ajaxSetup({
  beforeSend: function beforeSend(xhr, settings) {
    function getCookie(name) {
      let cookieValue = null;

      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i += 1) {
          const cookie = jQuery.trim(cookies[i]);

          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === `${name}=`) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }

      return cookieValue;
    }

    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
      // Only send the token to relative URLs i.e. locally.
      xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
    }
  },
});

const txt = document.getElementById("id_text");
const photo = document.getElementById("id_photo");
const alertBox = document.getElementById("alert-box");
const imgbox = document.getElementById("img-box");
const imgboxUp = document.getElementById("img-box-update")
const liketext = document.getElementById("js-like-text");
const likebox = document.getElementById("like-box");
const handleAlerts = (type, text, color) => {
  alertBox.innerHTML = `<div role="alert">
    <div class="bg-${color}-500 text-white font-bold rounded-t px-4 py-2">
      ${type}
    </div>
    <div class="border border-t-0 border-${color}-400 rounded-b bg-${color}-100 px-4 py-3 text-${color}-700">
      <p>${text}</p>
    </div>
  </div>`;
};
var url = "";
var img_data = "";
var file = "";
let photos = document.getElementById("id_photo");
const fd = new FormData();
const updateForm = new FormData();
// TODO:Photo listener
photos.addEventListener("change", function (e) {
  e.preventDefault();
  img_data = photos.files[0];
  url = URL.createObjectURL(img_data);
  console.log(url);
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    function () {
      console.log(reader.result);
    },
    false
  );

  if (file) {
    reader.readAsDataURL(img_data);
  }
  imgbox.src = `${url}`;
  fd.append("photo", photos.files[0]);
});

// TODO:Update form photo listener

let UpPhotos = document.getElementById("id_update_photo")

UpPhotos.addEventListener("change", function (e) {
  e.preventDefault();
  img_data = UpPhotos.files[0];
  url = URL.createObjectURL(img_data);
  console.log(url);
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    function () {
      console.log(reader.result);
    },
    false
  );

  if (file) {
    reader.readAsDataURL(img_data);
  }
  imgboxUp.src = `${url}`;
  updateForm.append("photo", UpPhotos.files[0]);
  console.log("image url from photo listener:",UpPhotos.files[0])
});








$(document)
  .on("click", ".js-toggle-model", function (e) {
    e.preventDefault();
    console.log("I was clicked");
    $(".js-model").toggleClass("hidden");
  })
  // TODO:Upload
  .on("click", ".js-submit", function (e) {
    e.preventDefault();
    const text = $(".js-post-text").val().trim();
    const imgLength = $(".js-post-photo").val();
    const number_of_posts = $("#posts").text();
    const $btn = $(this);
    const $fvalue = $(".js-follower-text");
    console.log(imgLength.length);
    if (!imgLength.length) {
      handleAlerts("Danger", "Please upload any image", "red");
      return false;
    }
    if (!text.length) {
      handleAlerts("Danger", "Please fill the photo description", "red");
      return false;
    }

    fd.append("text", text);

    // TODO:Photo

    $btn.prop("disabled", true).text("Posting!");
    $.ajax({
      type: "POST",
      url: $(".js-post-text").data("post-url"),
      enctype: "multipart/form-data",
      data: fd,
      success: (dataHtml) => {
        $("#posts-container").prepend(dataHtml);
        $btn.prop("disabled", false).text("Create Post");
        // document.getElementById("posts").innerText = Number(number_of_posts) + 1;
        handleAlerts("success", "Succesfully saved", "green");
        setTimeout(() => {
          alertBox.innerHTML = "";
          $(".js-post-text").val("");
          photos.value = "";
          imgbox.innerHTML = "";
          imgbox.src = "";
          $(".js-model").addClass("hidden");
        }, 500);
      },
      error: (error) => {
        console.warn(error);
        $btn.prop("disabled", false).text("Error");
        handleAlerts("Danger", "Something went wrong", "red");
      },
      cache: false,
      contentType: false,
      processData: false,
    });
  })

  // TODO:Delete toggle 

.on("click",".delete-icon",function(e){
  e.preventDefault();
  console.log("delete toggle form loaded")
  const post_id = $(this).attr('id')
  const url = $(this).attr('href')
  console.log("postid:",post_id)
  console.log("url",url)
  var $this = $(this)

  $(".js-delete-model").toggleClass("hidden")
  document.getElementById("postIdDelete").value = post_id

  let delete_button = document.getElementById("js-delete-post")
  delete_button.addEventListener("click",function(e){
    e.preventDefault()
    const url = $(".js-delete-post").data("url")
    const post_id = document.getElementById("postIdDelete").value
    console.log("url:",url)
    console.log("post_id",post_id)
    $.ajax({
      type : 'POST',
      url : url,
      dataType : "json",
      data : {
        'csrfmiddlewaretoken' : $('input[name=csrfmiddlewaretoken]').val(),
        'post_id' : post_id,
      },
      success:function(response){
        if(response.message === 'success'){
          console.log("deleted successfully yooo")
          $this.parents('.post').fadeOut("slow",function(){
                $this.parents('.post').remove();
                  })
          $(".js-delete-model").addClass("hidden")
        }
        else{
          alert(response.message)
        }
      }
    })

  })


})

.on("click",".js-delete-cancel",function(e){
  e.preventDefault()
  $(".js-delete-model").addClass("hidden")
})

// TODO: Update photo listener




// TODO:Update
.on("click",".update-icon",function(e){
  e.preventDefault()
  $(".js-update-model").toggleClass("hidden")

  console.log("clicked update")
  const post_id = $(this).attr('id')
  const post_des = $(`.post-text${post_id}`).text()
  const trimmed_post_des = $.trim(post_des)
  const imgbox = document.getElementById("img-box-update");
  const post_img = document.getElementById(`postImg${post_id}`).src
  console.log(post_id)
  console.log(trimmed_post_des)
  console.log(post_img)
 
  document.getElementById("post-updateText").value = trimmed_post_des
  document.getElementById("postId").value = post_id
  imgbox.src = post_img

})
.on("click",".js-toggle-update",function(e){
  e.preventDefault()
  $(".js-update-model").addClass("hidden")
})
// TODO:Update Button
.on("click",".js-update-post",function(e){
  e.preventDefault();
  console.log("clicked");
  const post_id = document.getElementById("postId").value
  const imgbox = document.getElementById("img-box-update").src
  const post_des = document.getElementById("post-updateText").value
  const post_img = document.getElementById(`postImg${post_id}`).src
  const url = $(".js-post-textUpdate").data("url") 
  console.log("post_id value from update button:",post_id)
  console.log("post_img value from update button:",imgbox)
  updateForm.append("post_id",post_id)
  updateForm.append("post_des",post_des)
  console.log("post_text value from update button:",post_des)
  console.log("url:",url)
  var $this = $(this)
  $.ajax({
    type : 'POST',
    url : url,
    enctype: "multipart/form-data",
    dataType : "json",
    data : updateForm,
    success:function(response){
        console.log("message response",response.message)
        
        if(response.message === 'Success'){

          document.getElementById(`post-text${post_id}`).textContent =  post_des
           console.log("img src:","http://127.0.0.1:8000/media/"+response.photourl)
           
            document.getElementById(`postImg${post_id}`).src = "http://127.0.0.1:8000/media/"+response.photourl
          
          console.log("Updated successfully")
          setTimeout(() => {
            $("#post-updateText").val("")
            imgbox.value = ""
            imgbox.src = ""
            $(".js-update-model").addClass("hidden")

          }, 500);
         

        }
        else{
          alert(response.message)
        }
    },
    cache: false,
    contentType: false,
    processData: false,
  })

})

  // TODO:Follow Unfollow
  .on("click", ".js-follow", function (e) {
    e.preventDefault();
    console.log("Clicked");
    const action = $(this).attr("data-action");
    $.ajax({
      type: "POST",
      // url: $(this).data("follow-url"),
      url: $(this).data("url"),
      enctype: "multipart/form-data",
      data: {
        action: action,
        username: $(this).data("username"),
      },
      success: (data) => {
        $(".js-follow-text").text(data.wording);
        if (action == "follow") {
          $(this).attr("data-action", "unfollow");
        } else {
          // $("#follow-container").prepend(data)
          $(this).attr("data-action", "follow");
        }
      },
      error: (error) => {
        console.warn(error);
      },
    });
  })

  // TODO:Like
 $(".like-form").submit(function(e){
   e.preventDefault()
   console.log("Works")
   const post_id = $(this).attr('id')
   const like_text = $(`.like-button${post_id}`).text()
   const trimmed_text = $.trim(like_text)
   const url = $(this).attr('action')
   const like_img = document.getElementById(`like-box${post_id}`)
   console.log(url)
   let res;
   const like_count = $(`.like-count${post_id}`).text()
   const trim_count = parseInt(like_count)
   console.log(trim_count)
      $.ajax({
        type :  'POST',
        url : url,
        data : {
          'csrfmiddlewaretoken' : $('input[name=csrfmiddlewaretoken]').val(),
          'post_id':post_id,

        },
        success:function(response){
          if(trimmed_text ==='Dislike'){
              $(`.like-button${post_id}`).text('Like')
              like_img.innerHTML = '<i class="bx bx-like"></i>'
              
              res = trim_count - 1
          }
          else {
              $(`.like-button${post_id}`).text('Dislike')
              like_img.innerHTML = '<i class="bx bx-dislike text-blue-500"></i>'
              res = trim_count + 1
          }
          $(`.like-count${post_id}`).text(res)
        },
        error:function(response){
          console.log('error',response)
        },
       
      })

 })

 if(!!window.performance && window.performance.navigation.type === 2)
{
    console.log('Reloading');
    window.location.reload();
}
