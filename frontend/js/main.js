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
var view_type = 'auto'
var index_value = 1
var flag_last = 0
var SeenTypeFinished = 0
let StatusSeenTimeout 
let myTimout_i = 0
var response_story
let story_id = 0
// Photo Listener For Update Post Photo
let photos = "id_update_photo"
let imgbox = "img-box-update"
let response_count = 0
var type = 'update_post'
var story_loading = 'true'
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
 .on("click",".like-button",function(e){

   e.preventDefault()
   console.log("Works")
   const post_id = $(this).attr('id')
   const url = $(this).data('like-url')
   let like_icon = document.getElementById(`like-icon${post_id}`)
  //  For adding Processing Time
   let like_div = document.getElementById(`like_div${post_id}`)

   like_div.classList.add('animate-spin')
   like_div.classList.add('w-5')
   like_div.classList.add('w-7')
  //  like_icon.innerHTML = ""
   console.log("url:",url)
   var like_count = $(`#like_count${post_id}`).val()
  let like_count_div = document.getElementById(`like-count${post_id}`)
   console.log("post_id:",post_id)
   console.log("like_count:",like_count)
      $.ajax({
        type :  'POST',
        url : url,
        data : {
  
          'post_id':post_id,

        },
        success:function(response) {
          if(response.message === 'success'){
            like_div.classList.remove('animate-spin')
            like_div.classList.remove('w-5')
            like_div.classList.remove('w-7')
            console.log("success")
            console.log("response:",response.status)
            if(response.status === 'Dislike'){
                // like_icon.innerHTML = `<i class='bx bx-heart '></i>`
                like_icon.classList.replace('bxs-heart','bx-heart')
                like_icon.classList.replace('text-red-500','text-blue-500')
                like_count = Math.abs(like_count,1)
                console.log("like count:",like_count)
                like_count_div.innerText = like_count
            }
            else if(response.status === 'Like'){
                // like_icon.innerHTML = `<i  class='bx bxs-heart text-red-500'></i>`
                like_icon.classList.replace('bx-heart','bxs-heart')
                like_icon.classList.replace('text-blue-500','text-red-500')
                like_count = parseInt(like_count) + 1
                console.log("like count:",like_count)
                like_count_div.innerText = like_count
            }
          }
          else{
            console.log(response.error)
          }
        },
      })
    })
// For Selecting the comment Input box
.on("click",".comment-button-icon",function (e) {
  e.preventDefault()
  const post_id = $(this).attr('id')
  console.log("post id from comment button icon:",post_id)
  let comment_input_box = document.getElementById(`comment-content${post_id}`)
  comment_input_box.focus()
  comment_input_box.select()
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
    console.log("I was clicked story cancel");

    // clearTimeout(myTimeOut)
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
        $btn.prop("disabled", false).text("Add Your Story");
  
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
  story_id = $(this).attr('id')
  let story_author = document.getElementById(`story-author-name${story_id}`).value
  let user = document.getElementById(`request-user-name`).value
  let status_counter_tile = document.getElementById('status-counter-tile')
  let story_author_image = document.getElementById(`story-author-img${story_id}`).value
  let story_image_button = document.getElementById('story-image')
  status_counter_tile.innerHTML = ""
  story_image_button.innerHTML = ""
  console.log("story author:",story_author)
  story_loading = 'true'
  let url = $('#story-caption').data('story-seen-url')
  let status_counter = document.getElementById('status-counter')

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
        console.log(response.story)
        console.log(response.count)
        var myMoveInterval 
      
        response_story  = jQuery.parseJSON(JSON.stringify(response));
        response_count = response.count
        index_value = document.getElementById('story-id').value

       // TODO:Creating Status tiles
        for (let i = response.count-1;i >=0; i --) {
        
          status_counter_tile.innerHTML = `<button id="status${i}" class="w-full bg-gray-700 border-2 border-black mt-2" onclick="StoryView('${response_story.story[i].photo}', '${story_author_image}', '${story_author}', '${response_story.story[i].text}',0,${i},'${response_story.story[i].created_time}','tile')">
                                          <div id="myBar${i}" class="h-1 bg-white w-full"></div></button>` + status_counter_tile.innerHTML
                                          // console.log("Story:",response.story.viewers.all)

        }
            // Fetching the first story
            JsonResponse_Story(0)      
        }
        else{
          console.log("not")
        }
      }
   
  })
})

// Listener for close button of story view
.on("click","#story-view-cancel",function(e){
  e.preventDefault()
  view_type  = "auto"
  story_loading = "false"
  // clearTimeout(myTimeOut)
  clearInterval(myMoveInterval);
  let story_seen_icon = document.getElementById("story-seen-icon")
  story_seen_icon.classList.replace("visible","hidden")
  $('.js-story-view-model').addClass('hidden')

})
// Story Seen Users View Cancel
.on("click","#js-story-seen-cancel",function(e){
  e.preventDefault()
  $(".js-story-seen-model").addClass("hidden")
  view_type="manual"
  clearTimeout(StatusSeenTimeout)

})



// Fetching and displaying the story from ajax success part
function JsonResponse_Story(i){
    // var myMoveInterval 
    let user = document.getElementById(`request-user-name`).value
    let story_author = document.getElementById(`story-author-name${story_id}`).value
    console.log("user:",user)
    console.log("story_author:",story_author)
    let story_author_image = document.getElementById(`story-author-img${story_id}`).value
    if(story_author == user){

      let story_seen_icon = document.getElementById("story-seen-icon")
      console.log("author and user is same")
     story_seen_icon.classList.replace("hidden","visible")
      
      story_seen_icon.innerHTML = ""
      story_seen_icon.innerHTML = `<button onclick="Story_SeenBy('${story_author}','${story_author_image}','${response_story.story[i].text}','${i}')"><i id="story-id${index_value + 1}" class="bi bi-eye text-white"></i></button>`
    }
    
    console.log("story_author_image:",story_author_image)
    console.log("SeenType:",SeenTypeFinished)
    console.log("View Type:",view_type)
    console.log("i:",i)


    index_value = document.getElementById('story-id').value

    // story_seen_icon.innerHTML = `<button class="story_tile" onclick="Story_SeenBy('${response_story.username}','${response_story.story[i].photo}','${response_story.story[i].text}','${index_value}')"><i id="story-id${index_value + 1}" class="bi bi-eye text-white"></i></button>`
    // Finding Time Difference
    time = timeDifference(response_story.story[i].created_time.slice(0,19))
    console.log("time:",time)
 
    if(view_type=='auto'){
      
      
        StoryView(response_story.story[i].photo, story_author_image, story_author, response_story.story[i].text,time,i,'0/0/000','auto')
        console.log("i value:",i)
        if(i === response_story.count-1){
          flag_last = 1
          console.log("FLag Last")
        }
   
    } 
    else{
     
      StoryView(response_story.story[i].photo, story_author_image,story_author, response_story.story[i].text,time,i,'0/0/000','manual')
      // StatusSeenTimeout = setTimeout(()=>{
       
      //    SeenTypeFinished  = 1
      //   console.log("SeenTimeOut Finished")
      //   console.log("SeenType:",SeenTypeFinished)
      //   console.log("View Type:",view_type)
      //   console.log("i:",i)
        
      // },1000000)
    }

    $.ajax({
      type:'POST',
      url:$("#story-seen-add").data('story-seen-add-url'),
      data:{
        'story_id':i,
        'story_text':response_story.story[i].text
        
  
      },
      success:function (response) {
        if(response.message === 'success'){
          // console.log("Story Seen Id:",response.story_id)
          console.log("Success Story Seen")
        }else{
          console.log(response.error)
        }
      }

    })

  


  }


function Story_SeenBy(username,story_img,story_caption,index){
  view_type="seen"
  console.log("Flag Last Value:",flag_last)
  $(".js-story-seen-model").toggleClass("hidden")
  console.log("Story-index ",index)
  console.log("username:",username)
  
  clearInterval(myMoveInterval);
      
      // document.getElementById("story_caption_text").value = document.getElementById('story-captions').value
      // document.getElementById("story_id").value = document.getElementById('story-id').value
      var view_count_div = document.getElementById('story_view_count')
      var story_seen_view = document.getElementById('user-row')
      story_seen_view.innerHTML=""


      $.ajax({
        type:'POST',
        url:$('#story-seen-icon').data('story-seen-eye-icon-url'),
        data:{
          'story_id':document.getElementById('story-id').value,
          'story_caption':document.getElementById('story-captions').value
        },
        success:function(response){
          if(response.message==='success'){
            console.log("Story seen eye icon success")
              console.log("view_user",response.view_username)
              console.log("view_user_dp:",response.view_user_dp)
              console.log("viewers count:",response.viewers_count)
              // .innerText = `Viewed By ${response.viewers_count}`
              view_count_div.innerText = "Viewed By " + response.viewers_count + " Users"
              for(let k = 0;k<response.viewers_count;k++){

                story_seen_view.innerHTML = ` <div class="user-seen-view flex flex-col items-center
                                                          w-full border-b-4 text-center  sm:text-left  border  backdrop-opacity-50 backdrop-invert border backdrop-filter backdrop-blur-lg shadow-lg shadow-lg rounded-lg">
                                        
                                                    <div class="flex avatar-content mb-2.5 sm:mb-0 sm:mr-2.5 p-0.5 self-start">
                                                    <div class="rounded-full p-0.5  bg-gradient-to-b from-blue-400 via-green-500 to-indigo-700 ">
                                                    <div class="rounded-full bg-white wrapper overflow-hidden h-8 w-8">
                                                      <button>
                                                        <a class="story-icon">
                              
                                                          <img id="story-user" width="auto" height="auto"
                                                              class="rounded-full object-scale-down "src="${response.view_user_dp[k]}">
                                                          
                                                        </a>
                                                      
                                                      </button>
                                                    </div>
                                                    
                                                  </div>
                                                      
                                                    
                                                      <a class="title font-medium no-underline text-white self-center px-2 text-sm md:text-base">${response.view_username[k]}</a>
                                                   
                                                  </div>
                                              </div>` + story_seen_view.innerHTML
                                            
              }

          }
          else{
            console.log(response.error)
          }
        }

      })
   
    // view_type = "seen_by_user"

  }
  // Function is used for to identify the current status seen duration
  function move(value,index) {

    tile_id = document.getElementById(`status${index}`).textContent
    var tile = document.getElementById(`status${index}`)
    var elem = document.getElementById(`myBar${index}`);
    var tile_width = document.getElementById(`status${index}`).clientWidth
    var elem_width = document.getElementById(`myBar${index}`).clientWidth
  
   
    console.log("story id:",index)
    console.log("tile id:",tile_id)
      if (value == 0) {
        value = 1;
        
        var width = 0;
        myMoveInterval = setInterval(frame, 30);
        function frame() {
          if (width == 100) {
            console.log("full width")
            console.log("index",index)
            clearInterval(myMoveInterval);
            if(index<response_count-1){
              JsonResponse_Story(index+1)
            }else{
              // It WIll Automatically close when it will reach at the last story
              // $('.js-story-view-model').addClass('hidden')
            }
            tile.classList.add("bg-gray-700")
            width=0
            value = 0;
          } else {
          
            width++;
            elem_width = document.getElementById(`status${index}`).clientWidth
            tile_width = document.getElementById(`myBar${index}`).clientWidth
            if(elem_width == tile_width-1){
              console.log("Width are same")
            }
            tile.classList.add("bg-blue-700")
            elem.style.width = width + "%";
            elem.style.backgroundColor = "blue"
          }
        }
      }
  }
  

function next_story() {
  clearInterval(myMoveInterval)
  let story_id = document.getElementById('story-id').value
  console.log("story_id:",parseInt(story_id)+1)
  var tile_width = document.getElementById(`status${parseInt(story_id)}`)
  tile_width.style.width = 100 + "%"
  let next_story = parseInt(story_id)+1
  if(response_count-1<next_story){
    $(".js-story-view-model").addClass("hidden")
  }
  else{
    console.log("width from next_story:",tile_width)
    JsonResponse_Story(parseInt(story_id)+1)
  }

}


function ViewStatus(response){
  // console.log("Clicked:",index)
  console.log("response:",response)
}
// Function StoryView 
function StoryView(photo, author_image, username, story_caption, story_time, index,created_time,type){
  let story_image_view = document.getElementById('story-image')
  let story_username = document.getElementById('story-username')
  let story_caption_view = document.getElementById('story-caption')
  let story_user_view = document.getElementById('story-user')
  let story_id = document.getElementById('story-id')
  story_username.innerText = username
  console.log("Username Story author:",username)
  // document.getElementById("story-username").value = username
  document.getElementById("story-captions").value = story_caption
  document.getElementById("story-img").value = photo
  story_id.value = index
  view_type = type
  console.log("View Type From StoryView:",type)
  if(view_type==='tile'){
    clearInterval(myMoveInterval);
  }

 
  move(0,index)
  let story_time_view = document.getElementById('story-time')
  story_image_view.src = 'media/'+photo
  story_user_view.src = author_image
  story_username.textContent = username
  story_caption_view.textContent = story_caption
  story_time_view.textContent = story_time
  
  if(story_time==0){
    story_time = timeDifference(created_time.slice(0,19))
  }
  story_time_view.textContent = story_time
  console.log("index number:",index)
  
    // story_seen_icon.innerHTML = `<button onclick="Story_SeenBy('${response.username}','${response.story[i].text}','${i}')"><i id="story-id${i}" class="bi bi-eye text-white"></i></button>`

  console.log("view type:",view_type)

  
}




// Function Used To Find the status time difference
function timeDifference(d){
  let date = new Date(d)
  let today = new Date()
  
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  var created_time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
  var diffHour = Math.abs(today.getHours() - date.getHours() ) 
  var diffMinute = Math.abs(today.getMinutes() - date.getMinutes())
  if(diffHour > 0){
    time = diffHour + 'h:' + diffMinute + 'm ago'
  }else{
    time =  diffMinute + ' m ago'
  }
 
  return time 
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

