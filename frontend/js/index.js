document.querySelector('#room-name-input').focus();
document.querySelector('#room-name-input').onkeyup = function(e) {
   var text = document.querySelector("#room-name-input").value
   const url = document.querySelector('#room_url').value
   var search_room = document.querySelector('#search_room')
    console.log("room_url:",url)
    console.log("text:",text)
    $.ajax({
        type:'POST',
        url:url,
        dataType:'JSON',
        data:{
            'search_keyword':text
        },
        success:function(response){
            if(response.message == 'success'){
                console.log("Success")
                if(response.room_users){
                    console.log("room exist")
                }
                for(let i=0;i<response.room_users.length;i++){
                    console.log(response.room_users[i])
                    console.log("id:",response.room_users[i].id)
                    console.log("image:",response.room_users[i].image)
                    console.log("name:",response.username[i].username)
                    search_room.innerHTML = `<div class="flex flex-col  bg-white shadow-md hover:shadow-lg  w-full h-full p-0  border bg-gray-100 shadow-lg rounded-lg overflow-hidden my-0.5 md:my-1 mx-0.5 md:mx-2">
                    <div class="flex items-center justify-between mx-auto">
                        <div class="flex items-center mx-0 md:mx-3">
                            <div class=" mx-auto w-auto h-16 md:w-20 md:h-12 rounded-full overflow-hidden">
                                <a href="{% url 'feed:detail' favorite.post.id %}">
                                <img class="object-cover h-full rounded-full w-auto"
                                    src="media/${response.room_users[i].image}"  />

                                </a>
                            </div>
                            <div class="flex flex-col w-40 md:w-32 lg:w-52 my-3 ml-0 md:ml-2">
                              
                                    <a href="chat/${response.username[i].username}/" class="stretched-link text-decoration-none">
                                        <div class="font-medium  text-base  md:text-lg   overflow-hidden text-gray-700">${response.username[i].username}</div>
                                    </a>
                                
                              
                               
                                    
                            </div>                
                        
                        </div>
                    </div>
                </div>` 
                    // console.log("name:",response.room_users[i].user.username)
                }

                // for(let i=0;i<response.username.length;i++){
                //     console.log(response.username[i])
                // }
                if(text==""){
                    search_room.innerHTML=""
                }
                if(response.username){
                    console.log("username exists")
                    console.log(response.username)
                }
                // console.log(response.room_users)

            }else{
                console.log(response.message)
            }
        }
    })
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#room-name-submit').click();
    }
};

document.querySelector('#room-name-submit').onclick = function(e) {
    var roomName = document.querySelector('#room-name-input').value;
    window.location.pathname = '/chat/' + roomName + '/';
};