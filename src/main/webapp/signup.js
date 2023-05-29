$("#signUP").on("click",function (){
    var Name= $("#inNome").val().trim();
    var Surname= $("#inCognome").val().trim();
    var Email=$("#inEmail").val().trim();
    var Domain=$("#inEmail").val().trim();
    var Username= $("#inUsername").val().trim();
    var Password= $("#inPassword").val().trim();
    var verify=$("#inRipetiPassword").val().trim();
    var BirthDate=$("#inDataNascita").val();
    if(checkAllFields(Name,Email,Domain,Surname,Password,Username,verify,BirthDate)){
        signUpRequest(Username,Password,Name,Surname);
    }
});

function checkAllFields(Name,Email,Domain,Surname,Password,Username,verify, BirthDate){
    let r = true;
    r = checkName(Name) && r ;
    r = checkEmail(Email,Domain) && r;
    r = checkSurname(Surname) && r;
    r = checkPassword(Password,verify) && r;
    r = checkUsername(Username) && r;
    r = checkBirthDate(BirthDate) && r;
    return r;
}

function errorField(msg,id,idSpanP = null) {
    let idSpan = idSpanP ? idSpanP : id + "Error";

    document.getElementById(idSpan).innerText = msg;
    if (id != null) {
        $("#" + id).addClass("inputError");
        $("#" + id).addClass("is-invalid");
    }
}

function resetField(id){
    let elem = document.getElementById(id);
    let idSpan = elem.dataset.errorspan ?? id + "Error";

    document.getElementById(idSpan).innerText = "";
    $(elem).removeClass("inputError");
    $(elem).removeClass("is-invalid");
}

function checkAlphabetic(string){ //se non esiste una forma maiuscola allora ciò che si sta analizzando non è un carattere
    let a = string.split("").filter((x)=>{
        return x.toUpperCase() === x.toLowerCase() && x!==" ";
    })
    return a.length===0;
}

function checkAlphanumericDot(string){ // controlla come checkAlpabetic ma include il punto
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

function checkEmail(emailName,emailDomain)
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailName))
    {
        return true;
    }
    errorField("Indirizzo email non valido","inDomain","inEmailError");
    return false;
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

function startLoader(){ //imposta il css
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
                window.location.href = "index.html";
            } else {
                if (result.data.length === 0) {
                    errorField(result.error, null, "requestError");
                } else {
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

document.getElementById("btnLogin").addEventListener("click", function(event){
    window.location.href = "index.html#login" + errorUsername;
})