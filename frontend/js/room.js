const roomName = JSON.parse(document.getElementById('room-name').textContent);
const chatLog = document.querySelector('#chat-log')

if (!chatLog.hasChildNodes()){
    const emptyText = document.createElement('h3')
    emptyText.id = 'emptyText'
    emptyText.innerText = 'No Messages'
    emptyText.className = 'emptyText'
    chatLog.appendChild(emptyText)
    console.log("No messages")
}

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const messageElement = document.createElement('div')
    const user_id = data['user_id']
    const logged_in_id = JSON.parse(document.getElementById('user_id').textContent)
    const user_avatar = JSON.parse(document.getElementById('user_avatar').textContent)
    var imgBox = document.getElementById("user_dp");
    // Getting current time
    var time = new Date()
    var hours = time.getHours()
    var minute = time.getMinutes()
    let AmPm = hours > 12 ? 'PM' : 'AM'
    hours = hours % 12 
    hours = hours ? hours : 12
    minute = minute.toString().padStart(2,'O')
    let strTime = hours + ':' + minute + '' + AmPm
 

    // messageElement.innerText = data.message
    console.log("logged_in_user_id:",logged_in_id)
    
    // console.log("user avatar:",user_avatar)
    if(user_id == logged_in_id){

        messageElement.classList.add('message','sender')
        messageElement.innerHTML = `
        <div class="flex items-end justify-end">
            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-1 order-1 items-end">
                    <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">${data.message}</span>
                    <span>
                    <small>
                       
                  
                        ${strTime}
                   
                   
                 
                    </small>
                 </span>
                    </div>
            </div>
                        
        </div>  
        ` + messageElement.innerHTML
        
    }else{
        messageElement.classList.add('message','receiver')
        messageElement.innerHTML = `
        <div class="flex items-end">
            <div class="flex space-y-2 text-xs max-w-xs mx-2 order-2 items-start items-center">
                <div><img src="${imgBox.src}" alt="received_user profile avatar" class="rounded-full avatar w-6 h-6 object-cover"></div>
                <div class="m-auto pl-1"><span class="px-2 py-2 rounded-lg inline-block bg-gray-300 text-gray-600 ">${data.message}</span></div>
            </div>
        </div>` + messageElement.innerHTML

    }
   
    chatLog.appendChild(messageElement)
    const el = document.getElementById('chat-log')
    el.scrollTop = el.scrollHeight
    if(document.querySelector('#emptyText')){
        document.querySelector('#emptyText').remove()
    }
    console.log("Data:",data)
   

};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};


document.querySelector('#chat-message-submit').onclick = function(e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;
    const room_id = JSON.parse(document.getElementById('room_id').textContent)
    console.log("room_id:",room_id)

   
    chatSocket.send(JSON.stringify({
        'message': message,
        'room_id':room_id,
        
        // 'room_id':room_id,
        
    }));
    messageInputDom.value = '';
    
};





$(document)
.on("click", "#id_image", function (e) {

  e.preventDefault();
  console.log("I was clicked");
  $(".js-sendphoto-model").toggleClass("hidden");
})
$(document)
  .on("click", ".js-toggle-photo-model-cancel", function (e) {
    e.preventDefault();
    console.log("I was clicked");
    $(".js-sendphoto-model").addClass("hidden");
  })
  



.on("change","#id_attachment", function(e){

    e.preventDefault();
    // Taking the image url path from input
    var img_data = document.querySelector('input[type=file]')['files'][0];
    
    url = URL.createObjectURL(img_data);
    var imgBox = document.getElementById("img-send-box");
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
    // displaying selected image in imagebox
    imgBox.src = `${url}`;
   

})

     // TODO:Upload
.on("click", ".js-send_image", function (e) {
    e.preventDefault();
    const fd = new FormData();
    const text = $(".js-message-text").val().trim();
    const imgLength = $(".js-send-photo").val();
    var imgBox = document.getElementById("img-send-box");
    let sender = JSON.parse(document.getElementById('sender_id').textContent)
    let receiver = JSON.parse(document.getElementById('received_user').textContent)
    let room_id = JSON.parse(document.getElementById('room_id').textContent)
    const chatLog = document.querySelector('#chat_list')
    var img_data = document.querySelector('input[type=file]')['files'][0];
    const $btn = $(this);
    console.log(imgLength.length);
    console.log("imgbox src:",img_data)
    fd.append("photo",img_data)
    if (!imgLength.length) {
      handleAlerts("Danger", "Please upload any image", "red");
      return false;
    }
    if (!text.length) {
      handleAlerts("Danger", "Please fill the photo description", "red");
      return false;
    }
    // Appending data items into form fd
    fd.append("text", text);
    fd.append("sender",sender)
    fd.append("receiver",receiver)
    fd.append("room_id",room_id)

    // TODO:Photo

    $btn.prop("disabled", true).text("Sending!");
    $.ajax({
      type: "POST",
      url: $(".js-message-text").data("message-url"),
      enctype: "multipart/form-data",
      data: fd,
      success: function(response){
        if(response.message == 'success'){

            $btn.prop("disabled", false).text("Send Message");
            // document.getElementById("posts").innerText = Number(number_of_posts) + 1;
            handleAlerts("success", "Successfully Sented", "green");

            const messageElement = document.createElement('div')
            // Displaying sent message in chatbox
              if(sender == response.current_sender){
    
                messageElement.classList.add('message','sender')
                messageElement.innerHTML = `
                <div class="flex items-end justify-end">
                    <div class="flex flex-col space-y-2 text-xs max-w-xs mx-7 order-1 items-end">
                            <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">${text}</span></div>
                            <img src='${document.getElementById("img-send-box").src}' class="w-22 h-16 md:w-48 md:h-32">
                    </div>
                                
                </div>  
                ` + messageElement.innerHTML
                
            }else{
                messageElement.classList.add('message','receiver')
                messageElement.innerHTML = `
                <div class="flex items-end">
                    <div class="flex space-y-2 text-xs max-w-xs  mx-7 order-2 items-start items-center">
                        <div><img src="${response.sender_avatar}" alt="received_user profile avatar" class="rounded-full avatar w-7 h-7 object-cover"></div>
                        <div class="m-auto"><span class="px-2 py-2 rounded-lg inline-block bg-gray-300 text-gray-600 ">${text}</span></div>
                        <img src='${document.getElementById("img-send-box").src}' class="w-22 h-16 md:w-48 md:h-32" mt-4>
                    </div>
                </div>` + messageElement.innerHTML
        
            }
           
            chatLog.appendChild(messageElement)
            const el = document.getElementById('chat-log')
            el.scrollTop = el.scrollHeight
            
            setTimeout(() => {
              alertBox.innerHTML = "";
              $(".js-message-text").val("");
              photos.value = "";
              imgBox.innerHTML = "";
              imgBox.src = "";
              $(".js-sendphoto-model").addClass("hidden");
            }, 500);
    
    
    
            
        }
        else{
            console.log(response.error)
            handleAlerts("Danger", "Something went wrong", "red");
            $btn.prop("disabled", false).text("Error");
        }   
      },
      cache: false,
      contentType: false,
      processData: false,
    });
  })