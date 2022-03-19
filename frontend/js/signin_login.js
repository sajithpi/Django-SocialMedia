
$(document)
// TODO:SIgn In
.on("click","#passwordShowlogin1",function(e){
    e.preventDefault()
    console.log("Clicked")
    if('password' == $('#pasword_id').attr('type') ){
        $('#pasword_id').prop('type','text')
        $('.passwordShowicon').removeClass('bi-eye')
        $('.passwordShowicon').addClass('bi-eye-slash')
    }else{
        $('#pasword_id').prop('type','password')
        $('.passwordShowicon').addClass('bi-eye')
        $('.passwordShowicon').removeClass('bi-eye-slash')
    }
  })

// TODO:Signup Password1
  .on("click","#passwordShowSignIn1",function(e){
    e.preventDefault()
    console.log("Clicked")
    if('password' == $('#id_password1').attr('type') ){
        $('#id_password1').prop('type','text')
        $('.passwordShowS1').removeClass('bi-eye')
        $('.passwordShowS1').addClass('bi-eye-slash')
    }else{
        $('#id_password1').prop('type','password')
        $('.passwordShowS1').addClass('bi-eye')
        $('.passwordShowS1').removeClass('bi-eye-slash')
    }
  })
// TODO:Signup Password2
  .on("click","#passwordShowSignIn2",function(e){
    e.preventDefault()
    console.log("Clicked")
    if('password' == $('#id_password2').attr('type') ){
        $('#id_password2').prop('type','text')
        $('.passwordShowS2').removeClass('bi-eye')
        $('.passwordShowS2').addClass('bi-eye-slash')
    }else{
        $('#id_password2').prop('type','password')
        $('.passwordShowS2').addClass('bi-eye')
        $('.passwordShowS2').removeClass('bi-eye-slash')
    }
  })