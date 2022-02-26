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
// Forms For Store Datas
const fd = new FormData();
const updateForm = new FormData();
let story_form = new FormData(); 


// Photo Listener For Update Post Photo
let photos = "id_update_photo"
let imgbox = "img-box-update"
type = 'update_post'
PhotoListener(photos,imgbox,type)


$(document)
.on("click", ".js-model-icon", function (e) {
  e.preventDefault();
  console.log("I was clicked");
  $(".js-model").toggleClass("hidden");
  // Photo Listener For Photo Uploading
  let photos = "id_photo"
  let imgbox = "img-box"
  type = 'post'
  PhotoListener(photos,imgbox,type)
})
$(document)
  .on("click", ".js-toggle-model-cancel", function (e) {
    e.preventDefault();
    console.log("I was clicked");
    $(".js-model").addClass("hidden");
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

.on("js-testing","click",function(e){
  e.preventDefault()
  console.log("Clicked ")
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

 // TODO:Delete Comment toggle 

 .on("click",".delete-comment-icon",function(e){
  e.preventDefault();
  console.log("delete toggle form loaded")
  const comment_id = $(this).attr('id')
  const url = $(this).attr('href')
  const commented_user = document.getElementById(`comment_user${comment_id}`).value
  const commented_user_id = document.getElementById(`comment_user_id${comment_id}`).value
  console.log("comment_id:",comment_id)
  console.log("commented_user:",commented_user)
  console.log("commented_user_id:",commented_user_id)
  console.log("url",url)
  var $this = $(this)

  $(".js-delete-model").toggleClass("hidden")
  document.getElementById("postIdDelete").value = comment_id

  let delete_button = document.getElementById("js-delete-post")
  delete_button.addEventListener("click",function(e){
    e.preventDefault()

    $.ajax({
      type : 'POST',
      url : url,
      dataType : "json",
      data : {
        'csrfmiddlewaretoken' : $('input[name=csrfmiddlewaretoken]').val(),
        'comment_id' : comment_id,
        'commented_user' : commented_user,
        'commented_user_id' : commented_user_id,
      },
      success:function(response){
        if(response.message === 'success'){
          console.log("deleted successfully yooo")
          $this.parents(`.comment_list`).fadeOut("slow",function(){
                $this.parents(`.comment_list`).remove();
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
    // TODO:Update form photo listener
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
.on("click",".js-toggle-update-cancel",function(e){
  e.preventDefault()
  $(".js-update-model").addClass("hidden")

})

.on("click",".favorite-icon",function(e){
  e.preventDefault()
  console.log("clicked favorites")
  const post_id = $(this).attr('id')
  console.log("post_id:",post_id)
  const url = $(this).attr('href')
  const favIcon = document.getElementById(`favorite-icon${post_id}`)
  console.log("url:",url)
  $.ajax({
    type:'POST',
    url:url,
    dataType:'JSON',
    data:{
      'post_id':post_id
    },
    success:function(response){
      if(response.message == 'success'){
        if(response.choice == 'add'){
          console.log("Added to favorites successfully")
          favIcon.innerHTML = `<i class='bx bxs-star text-blue-500'></i>`
        }else if(response.choice == 'delete'){
          console.log("Deleted From Favorites SuccessFully")
          favIcon.innerHTML = `<i class='bx bx-star text-blue-500'></i>`
        }
      }
      else{
        console.log(response.message)
      }
    }

  })
})



// TODO:Update Comment
.on("click",".update-comment-icon",function(e){
  e.preventDefault()
   $(".js-update-comment-model").toggleClass("hidden")

  console.log("clicked update")
  const comment_id = $(this).attr('id')
  const url = $(this).attr('href')
  const commented_user = document.getElementById(`comment_user${comment_id}`).value
  const comment_content = document.getElementById(`comment_content${comment_id}`).value
  const comment_container = document.getElementById(`comment_container${comment_id}`)
  const commented_user_id = document.getElementById(`comment_user_id${comment_id}`).value
  const comment_input_box = document.getElementById(`comment_content${comment_id}`)
  console.log(comment_id)
  console.log(commented_user)
  console.log(comment_content)
  console.log(commented_user_id)
  console.log("url:",url)
  document.getElementById("post-updateText").value = commented_user
  document.getElementById("postId").value = commented_user_id
  const update_comment_button = document.getElementById('js-comment-update-post')
  comment_input_box.innerHTML = 'hi';
  // Adding lisner event for update button
  update_comment_button.addEventListener("click",function(e){
    e.preventDefault()
    $.ajax({
      type:'POST',
      url : url,
      dataType : "json",
      data : {
        'csrfmiddlewaretoken' : $('input[name=csrfmiddlewaretoken]').val(),
        'comment_id' : comment_id,
        'commented_user' : commented_user,
        'commented_user_id' : commented_user_id,
        'comment_content' : comment_content,
      },
      success:function(response){
        if(response.message === 'success'){
            comment_input_box.value = comment_content
            console.log("Comment Updated Successfully")
            location.reload();
            $(".js-update-comment-model").addClass("hidden") 
    
        }
        else{
          alert(response.message)
        }
      }
    })
  })
 


})



// TODO:Update
.on("click",".js-comment-update-cancel",function(e){
  e.preventDefault()
  $(".js-update-comment-model").toggleClass("hidden")


})

  // TODO:Comment
$(".comment-form").submit(function(e){
    e.preventDefault()
    console.log("clicked")
    const post_id = $(this).attr('id')
    const url = $(this).data('url')
    const profile_url = document.getElementById(`profile_img${post_id}`).value
    let comment_count = 0;
    const comment = document.getElementById(`comment-content${post_id}`).value
    try{
      comment_count= document.getElementById(`comment-count${post_id}`).value
    }
    catch(error){
      comment_count = 1
    }
    const comment_flag = document.getElementById(`comment_flag`).value

    // let commentUserPic = document.createElement('')
    let comment_input = document.getElementById(`comment-content${post_id}`)
    let commentBody = document.getElementById(`comment-container${post_id}`)
    console.log("post_id",post_id)
    console.log("url:",url)
    console.log("post comment:",comment)
    console.log("profile_url:",profile_url)
    console.log("comment flag:",comment_flag)
    console.log("comment count:",comment_count)
    var $this = $(this)
    $.ajax({
      type : "POST",
      url : url,
      encType : 'multipart/form-data',
      dataType : "json",
      data : {
        'csrfmiddlewaretoken' : $('input[name=csrfmiddlewaretoken]').val(),
         'post_id' : post_id,
         'content' : comment,
         
      },
      success:function(response){
          if(response.message === 'success'){
            
            console.log("Comment saved successfully")
            comment_input.value = ""
            console.log("Comment Count:",response.comment_count)
            document.getElementById(`comment_count_body${post_id}`).innerText = response.comment_count
            console.log(response.comment)
            console.log("user",response.user)
            if(comment_flag == 'True'){
                commentBody.innerHTML = `<div class="flex">
                  <a href="" ><img src='${profile_url}' class="rounded-full object-cover object-center w-7 h-7" ></a>
                  <p class="pl-1 md:pl-3 text-xs md:text-base self-center" >${response.comment}</p>
                  <span ></span> 
            </div>` + commentBody.innerHTML
            }else{
              commentBody.innerHTML = `<div class="flex">
            
              <p class="text-base md:text-lg font-bold  " >${response.user}</p>
              <p class="pl-1 md:pl-3 text-xs md:text-base self-center"  >${response.comment}</p>
              <span ></span>
            </div>` + commentBody.innerHTML
            }
            
            
  
          }

          else{
            console.log(response.message)
          }
      } 
    })
 
  })





// TODO:Update Button
$(document)
.on("click",".js-update-post",function(e){
  e.preventDefault();
  console.log("clicked");
  const post_id = document.getElementById("postId").value
  const imgbox = document.getElementById("img-box-update").src
  let post_des = document.getElementById("post-updateText").value
  console.log("post description:",post_des)
  let post_img = document.getElementById(`postImg${post_id}`)
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
           
           post_img.src = "http://127.0.0.1:8000/media/"+response.photourl
          
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
              like_img.innerHTML = '<i class="bx bx-heart"></i>'
              
              res = trim_count - 1
          }
          else {
              $(`.like-button${post_id}`).text('Dislike')
              like_img.innerHTML = '<i class="bx bxs-heart text-red-500"></i>'
              res = trim_count + 1
          }
          $(`.like-count${post_id}`).text(res+" Likes")
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

setTimeout(function(){
  $('#message').fadeOut('slow')
}, 1000)






$(document)
.on("click", ".js-story-icon", function (e) {
  e.preventDefault();
  console.log("I was clicked");
  $(".js-story-model").toggleClass("hidden");
  let image = "id_photos";
  const image_preview = "img-preview"; 
  type = "story"
  PhotoListener(image,image_preview,type)

})
$(document)
  .on("click", ".js-story-model-cancel", function (e) {
    e.preventDefault();
    console.log("I was clicked");
    $(".js-story-model").addClass("hidden");
  })



  // TODO:Add Story
.on("click", ".js-story-submit", function (e) {
  e.preventDefault();
  const text = $(".js-story-text").val().trim();
  const imgLength = $(".js-story-photo").val();
  let image_preview = document.getElementById('img-preview')
  const $btn = $(this);
  console.log(text);
  if (!imgLength.length) {
    handleAlerts("Danger", "Please upload any image", "red");
    return false;
  }
  if (!text.length) {
    handleAlerts("Danger", "Please fill the photo description", "red");
    return false;
  }

  story_form.append("text", text);

  // TODO:Photo

  $btn.prop("disabled", true).text("Posting!");
  $.ajax({
    type: "POST",
    url: $(".js-story-text").data("post-url"),
    enctype: "multipart/form-data",
    data: story_form,
    success:function(response){

      if(response.message === 'success'){

        console.log("success")
        $("#posts-container").prepend(response);
        $btn.prop("disabled", false).text("Create Post");
  
        handleAlerts("success", "Succesfully saved", "green");
        setTimeout(() => {
          alertBox.innerHTML = "";
          $(".js-story-text").val("");
          photos.value = "";
          image_preview.innerHTML = "";
          image_preview.src = "";
          $(".js-story-model").addClass("hidden");
        }, 500);
      }
      else {
      console.warn(error);
      $btn.prop("disabled", false).text("Error");
      handleAlerts("Danger", "Something went wrong", "red");
    }
  },
  cache: false,
  contentType: false,
  processData: false,
  });
})



// Showing Story in View
.on("click",".story-icon",function(e){
  e.preventDefault()
  $(".js-story-view-model").toggleClass("hidden")
  const story_id = $(this).attr('id')
  let story_author = document.getElementById(`story-author-name${story_id}`).value
  let story_author_image = document.getElementById(`story-author-img${story_id}`).value
  console.log("story author:",story_author)

  let story_image_view = document.getElementById('story-image')
  let story_caption_view = document.getElementById('story-caption')
  let story_user_view = document.getElementById('story-user')
  let url = $('#story-caption').data('story-seen-url')
  console.log("story id:",story_id)
  console.log("url:",url)
  console.log("clicked")

  $.ajax({
    type : 'POST',
    url:$("#story-caption").data('story-seen-url'),
    data:{
      'story_id':story_id,
      'story_author':story_author,

    },
    success:function(response){
      if(response.message === 'success'){
        console.log("success")
        // console.log(response.story)
        console.log(response.count)
        for(let i = 0; i < response.count; i ++){
        
          setTimeout(()=>{
            console.log(response.story[i])
            console.log(response.story[i].text)
            // Finding Time Difference

            timeDifference(response.story[i].created_time.slice(0,19))

            console.log("photo:",response.story[i].photo)
            story_image_view.src = 'media/'+response.story[i].photo
            story_user_view.src = story_author_image
            story_caption_view.textContent = response.story[i].text
          },5000 * i)
        }

      }
      else{
        console.log("not")
      }
    }
   
  })
})
.on("click","#story-view-cancel",function(e){
  e.preventDefault()
  $('.js-story-view-model').addClass('hidden')
})


// Function Used To Find the status time difference
function timeDifference(d){
  let date = new Date(d)
  let today = new Date()
  let story_time_view = document.getElementById('story-time')
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  var created_time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
  var diffHour = Math.abs(today.getHours() - date.getHours() ) 
  var diffMinute = Math.abs(today.getMinutes() - date.getMinutes())
  if(diffHour > 0){
    story_time_view.textContent = diffHour + 'h:' + diffMinute + 'm ago'
  }else{
    story_time_view.textContent =  diffMinute + ' ago'
  }
}


 // Function For Story Image Listener
function PhotoListener(image_id,image_preview_id,type){
 
var url = "";
var img_data = "";
var file = "";
let image = document.getElementById(image_id);
const image_preview = document.getElementById(image_preview_id);

// TODO:Photo listener
image.addEventListener("change", function (e) {
  e.preventDefault();
  img_data = image.files[0];
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
  image_preview.src = `${url}`;
  if(type === 'story')
    story_form.append("photo", image.files[0]);
  else if(type === 'post'){
    fd.append("photo", image.files[0]);
  }
  else if(type === 'update_post'){
    updateForm.append("photo", image.files[0]);
  }
});
}