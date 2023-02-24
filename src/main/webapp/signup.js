$("#signUP").on("click",function (){
    var Name= $("#inNome").val().trim();
    var Surname= $("#inCognome").val().trim();
    var Email=$("#inEmail").val().trim();
    var Domain=$("#inDomain").val().trim();
    var Username= $("#inUsername").val().trim();
    var Password= $("#inPassword").val().trim();
    var verify=$("#inRipetiPassword").val().trim();
    var BirthDate=$("#inDataNascita").val();
    var BirthTown=$("#inCittaNascita").val().trim();
    if(checkAllFields(Name,Email,Domain,Surname,Password,Username,verify,BirthDate,BirthTown)){
        signUpRequest(Username,Password,Name,Surname);
    }
});

// document.querySelector(window).scroll(function() {
//     if (document.querySelector(this).scrollTop > 400) {
//         document.querySelector( ".navbar" ).fadeIn();
//     } else {
//         console.log('there');
//         document.querySelector( ".navbar" ).fadeOut();
//     }
// });

function checkAllFields(Name,Email,Domain,Surname,Password,Username,verify, BirthDate,BirthTown){
    let r = true;
    r = checkName(Name) && r ;
    r = checkEmail(Email,Domain) && r;
    r = checkSurname(Surname) && r;
    r = checkPassword(Password,verify) && r;
    r = checkUsername(Username) && r;
    r = checkBirthDate(BirthDate) && r;
    r = checkBirthTown(BirthTown) && r;
    return r;
}
function errorField(msg,id,idSpanP = null) {

    let idSpan = idSpanP ? idSpanP : id + "Error";

    document.getElementById(idSpan).innerText = msg;
    if (id != null) {
        $("#" + id).addClass("inputError");
        $("#" + id).addClass("is-invalid");

        document.getElementById(id).addEventListener("keydown", resetFieldEventListener);
    }
}

function resetFieldEventListener(event){
    let id = event.target.id;

    resetField(id);

    document.getElementById(id).removeEventListener("keydown",resetFieldEventListener);
}

function resetField(id){
    let elem = document.getElementById(id);

    let idSpan = elem.dataset.errorspan ?? id + "Error";

    document.getElementById(idSpan).innerText = "";
    $(elem).removeClass("inputError");
    $(elem).removeClass("is-invalid");
}

function checkAlphabetic(string){
    let a = string.split("").filter((x)=>{
        return x.toUpperCase() === x.toLowerCase() && x!==" ";
    })
    return a.length===0;

}
function checkAlphanumericDot(string){
    let a = string.split("").filter((x)=>{
        return x.toUpperCase() === x.toLowerCase() && /\D/.test(x)&& x!==".";
    })
    return a.length===0;

}
function checkName(Name){
    if(!Name){
        errorField("Inserire il nome","inNome");
        return false;
    }
    if(!checkAlphabetic(Name)){
        errorField("Caratteri non validi nel nome","inNome");
        return false;
    }
    return true;
}
function checkSurname(Surname){
    if(!Surname){
        errorField("Inserire il cognome","inCognome");
        return false;
    }
    if(!checkAlphabetic(Surname)){
        errorField("Caratteri non validi nel cognome","inCognome");
        return false;
    }
    return true;
}
function checkUsername(Username){
    if(!Username){
        errorField("Inserire l'username","inUsername");
        return false;
    }
    if(!checkAlphanumericDot(Username)){
        errorField("Caratteri non validi nell'username","inUsername");
        return false;
    }
    return true;
}
function checkEmail(emailName,emailDomain){
    if(!emailName||!emailDomain){
        if(!emailName)
            errorField("Inserire l'email","inEmail","inEmailError");
        if(!emailDomain)
            errorField("Inserire l'email","inDomain","inEmailError");
        return false;
    }
    if(!checkAlphanumericDot(emailName)||!checkAlphanumericDot(emailDomain)){
        if(!checkAlphanumericDot(emailName))
            errorField("Caratteri non validi nella mail","inEmail","inEmailError");
        if(!checkAlphanumericDot(emailDomain))
            errorField("Caratteri non validi nella mail","inDomain","inEmailError");
        return false;
    }else{
        if(!emailDomain.includes(".")||emailDomain.lastIndexOf(".")===emailDomain.length-1){
            errorField("Dominio della mail non valido","inDomain","inEmailError");
        }
    }
    return true;
}
function checkPassword(Password,verify){
    if(!Password||!verify) {
        if (!verify) {
            errorField("Inserire la conferma della password", "inRipetiPassword","inPasswordError");
        }
        if (!Password) {
            errorField("Inserire la password", "inPassword","inPasswordError");
        }
        return false;
    }
    if(Password!==verify){
        errorField("Le password inserite non coincidono ","inRipetiPassword","inPasswordError");
        return false;
    }
    if(Password.length < 3){
        errorField("La password non è abbastanza lunga", "inPassword","inPasswordError");
    }
    return true;
}

function checkBirthDate(BirthDate){
    let dtBirthDate = new Date(BirthDate);
    let toDate = new Date();
    toDate.setFullYear(toDate.getFullYear()-18);

    let fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear()-100);

    if (!BirthDate){
        errorField("Inserire la data di nascita", "inDataNascita");
        return false;
    }

    if (dtBirthDate.valueOf() > toDate.valueOf()){
        errorField("Devi essere maggiorenne per poter usare questo sito", "inDataNascita");
        return false;
    }

    if (dtBirthDate.valueOf() < fromDate.valueOf()){
        errorField("Controlla di aver inserito la data corretta", "inDataNascita");
        return false;
    }

    return true;
}

function checkBirthTown(BirthTown){
    if(!BirthTown){
        errorField("Inserire la città","inCittaNascita");
        return false;
    }
    if(!checkAlphabetic(BirthTown)){
        errorField("Caratteri non validi nel nome della città","inCittaNascita");
        return false;
    }
    return true;
}

function startLoader(){
    $("#signUP span").removeClass("d-none");
    $(".signup-container").css({opacity: "50%"});
    $("#signUP").css({opacity: "100%"});
    $(".signup-container input").prop("disabled",true);
}

function cleanLoader(){
    $("#signUP span").addClass("d-none");
    $(".signup-container").css({opacity: "100%"});
    $("#signUP").css({opacity: "100%"});
    $(".signup-container input").prop("disabled",false);
}
var errorUsername = "";

function signUpRequest(Username,Password,Name,Surname){
    window.location.href = "signup-completed.html";

    startLoader();
    $.ajax({
        url:"PageServlet",
        data:{
            operation:"signup",
            Username:Username,
            Password:Password,
            Name:Name,
            Surname:Surname
        },
        method:"POST",
        timeout: 5000,
        success: function (result){
            if(result.ok){
                window.location.href = "index.jsp";
                // window.location.href = "index.html";
                //TO DO: è possibile da qui richiamare il login scritto sopra?
            }else{
                if (result.data.length == 0) {
                    errorField(result.error, null, "requestError");
                }else{
                    errorField(result.error,"inUsername");
                    errorUsername = "," + result.data[0].Username;
                }
            }
        },
        error: function (xhr, message, thrownError){
            let error = "";
            if (xhr.status === 500){
                error = "Errore del server";
            }else if (xhr.status === 0 || message === "timeout"){
                error = "La richiesta è andata in timeout";
            }else {
                error = "Errore " + xhr.status + " : " + thrownError;
            }

            errorField(error, null, "requestError");
        },
        complete: function(jqXHR, textStatus){
            cleanLoader();
        }
    });
}

document.getElementById("inEmail").addEventListener("keydown",function(event){
    if (event.key === "@"){
        $("#inDomain").focus();
        event.preventDefault();
        return false;
    }
})

document.getElementById("btnLogin").addEventListener("click", function(event){
    window.location.href = "index.jsp#login" + errorUsername;
    // window.location.href = "index.html#login" + errorUsername;
})