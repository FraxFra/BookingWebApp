    // var confirmModal= null;
    // var errorModal = null;
    // var loginModal= null;
    // var teachingModal=null;
    // $(document).ready(function () {


        /*$("#loginButton").on("click",function () {
            login();
        });*/
        // $("#loginPassword").on("keypress",function(event){
        //     if(event.which==13){
        //         login();
        //     }
        // })
       /* $("#btnLogout").on("click",function(){
            $.ajax({
                url: "PageServlet",
                data: {
                    operation:"logout"
                },
                method:"POST",
                success: function( result ) {
                    if (result.ok) {
                        window.location.hash = "";
                        window.location.href = "index.html";
                        // window.location.href = "index.jsp";
                        $("#weather-temp").html("<strong>" + "Sloggato " + JSON.stringify(result) + "</strong>");
                    }else{
                        $("#weather-temp").html("Errore: " + result.error);
                    }
                }
            });
        });*/

    //     $("#newTeacher").on("click",function(){
    //         $.ajax({
    //             url:"TeacherServlet",
    //             data:{
    //                 operation:"addTeacher",
    //                 name: $("#teacherName").val().trim(),
    //                 surname:$("#teacherSurname").val().trim()
    //             },
    //             method:"POST",
    //             success: function (result){
    //                 if(result.ok){
    //                     refreshTeacher();
    //                     reloadAllSubjectTeacher();
    //                 }else{
    //                     openError(result.error);
    //                 }
    //             }
    //         })
    //     });
    //
    //     $("#newSubject").on("click", function(){
    //         $.ajax({
    //             url:"SubjectsServlet",
    //             data: {
    //                 operation: "addSubject",
    //                 name: $("#subjectName").val().trim()
    //             },
    //             method:"POST",
    //             success: function (result){
    //                 if(result.ok){
    //                     refreshSubjects();
    //                     reloadAllSubjectTeacher();
    //                 }else{
    //                     openError(result.error);
    //                 }
    //             }
    //         });
    //     });
    //
    //     $.ajax({
    //         url: "SlotServlet",
    //         data: {
    //             operation:"availableBookings"
    //         },
    //         method:"POST",
    //         success: function( result ) {
    //             if (result.ok) {
    //                 createCalendar(result.data,true);
    //             }else{
    //                 openError(result.error);
    //             }
    //
    //         }
    //     });
    //
    //     $("#signUPButton").on("click",function (){
    //         var Name= $("#signUpName").val().trim();
    //         var Surname= $("#signUpFN").val().trim();
    //         var Username= $("#signUPUsername").val().trim();
    //         var Password= $("#signUpPsw").val().trim();
    //         var verify=$("#vsignUpPsw").val().trim();
    //         console.log(Name);
    //         console.log(Surname);
    //         // console.log(Username);
    //         // console.log(Password);
    //         console.log(verify);
    //         if(Password&&verify&&Password==verify){
    //             $.ajax({
    //                 url:"PageServlet",
    //                 data:{
    //                     operation:"signup",
    //                     Username:Username,
    //                     Password:Password,
    //                     Name:Name,
    //                     Surname:Surname
    //                 },
    //                 method:"POST",
    //                 success: function (result){
    //                     if(result.ok){
    //                         $("#weather-temp").html("Registrato correttamente ");
    //                         window.location.reload();
    //                         //TO DO: è possibile da qui richiamare il login scritto sopra?
    //                     }else{
    //                         $("#weather-temp").html("Errore: " + result.error);
    //                     }
    //                 }
    //             });
    //         }else{
    //             alert("Inserire tutti i campi!") ;
    //         }
    //
    //     })
    //
    // });

    // $(document).ready(function(){
    //     confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    //     errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    //     loginModal = new bootstrap.Modal(document.getElementById('exampleModalToggle'));
    //     teachingModal = new bootstrap.Modal(document.getElementById('TeachingModal'));
    //     reloadAllSubjectTeacher();
    //
    //     document.getElementById('exampleModalToggle').addEventListener('shown.bs.modal', function () {
    //         document.getElementById("loginUsername").focus()
    //     })
    //
    // });

    /*function login(){
        var Username= $("#loginUsername").val().trim();
        var Password= $("#loginPassword").val().trim();
        // console.log(Username);
        // console.log(Password);
        if (Username && Password){
            $.ajax({
                url: "PageServlet",
                data: {
                    operation:"login",
                    Username:Username,
                    Password:Password
                },
                method:"POST",
                success: function( result ) {
                    if (result.ok) {
                        window.location.hash = "";
                        window.location.href = "index.html";
                        // window.location.href = "index.html";
                    }else{
                        loginModal.hide();
                        openError(result.error);
                    }
                }
            });
        }else{
            alert("Inserire tutti i campi!");
        }
    }*/
    /*
    function refreshCalendar(isHome){
        var subject=$("#subjectDDL").val().trim();
        var teacher=$("#teacherDDL").val().trim();
        if(subject==""){
            subject=null;
        }
        if(teacher==""){
            teacher=null;
        }
        $.ajax({

            url: "SlotServlet",
            data: {
                SubjectName: subject,
                TeacherId: teacher,
                operation: isHome ? "availableBookings": "ownCalendar"
            },
            method:"POST",
            success: function( result ) {
                if (result.ok) {
                    refreshCalendarSlots(result.data,isHome);
                }else{
                    openError(result.error);
                }
            }
        });
    }*/
    // function myCalendar(){
    //     $.ajax({
    //         url: "SlotServlet",
    //         data: {
    //             operation:"ownCalendar"
    //         },
    //         method:"POST",
    //         success: function( result ) {
    //             if (result.ok) {
    //                 refreshCalendarSlots(result.data);
    //             }else{
    //                 openError(result.error);
    //             }
    //         }
    //     });
    // }
    // function loadSubjects(id){
    //     $.ajax(
    //         {
    //             url:"SlotServlet",
    //             data:{
    //                 operation: "subjectDDL"
    //             },
    //             method:"POST",
    //             success:function(result){
    //                 if(result.ok){
    //                     $(id).empty();
    //                     let option=document.createElement("option");
    //                     option.value="";
    //                     option.innerText="Selezionare Materia";
    //                     $(id).append(option);
    //                     for(let subject of result.data){
    //                         let option=document.createElement("option");
    //                         option.value=subject.value;
    //                         option.innerText=subject.description;
    //                         // option.style.color="whitesmoke";
    //                         // option.style.backgroundColor="#2c2e2f";
    //                         $(id).append(option);
    //                     }
    //
    //                 }else{
    //                     openError(result.error);
    //                 }
    //             }
    //         }
    //
    //     )
    // }

    // function loadTeachers(id){
    //     $.ajax(
    //         {
    //             url:"SlotServlet",
    //             data:{
    //                 operation: "teacherDDL"
    //             },
    //             method:"POST",
    //             success:function(result){
    //                 if(result.ok){
    //                     $(id).empty();
    //                     let option=document.createElement("option");
    //                     option.value="";
    //                     option.innerText="Selezionare Insegnante";
    //                     $(id).append(option);
    //                     for(let subject of result.data){
    //                         let option=document.createElement("option");
    //                         option.value=subject.value;
    //                         option.innerText=subject.description;
    //                         $(id).append(option);
    //                         // option.style.color="whitesmoke";
    //                         // option.style.backgroundColor="#2c2e2f";
    //                     }
    //
    //                 }else{
    //                     openError(result.error);
    //                 }
    //             }
    //         }
    //
    //     )
    // }
    // function loadUsers(){
    //     $.ajax({
    //         url:"BookingServlet",
    //         data:{
    //             operation:"userDDLList"
    //         },
    //         method:"POST",
    //         success:function (result){
    //             if(result.ok){
    //                 $("#userDDLList").empty();
    //                 let option=document.createElement("option");
    //                 option.value="";
    //                 option.innerText="Selezionare utente";
    //                 $("#userDDLList").append(option);
    //                 for(let subject of result.data){
    //                     let option=document.createElement("option");
    //                     option.value=subject.value;
    //                     option.innerText=subject.description;
    //                     $("#userDDLList").append(option);
    //                     // option.style.color="whitesmoke";
    //                     // option.style.backgroundColor="#2c2e2f";
    //                 }
    //
    //             }else{
    //                 openError(result.error);
    //             }
    //         }
    //     })
    // }

    // function refreshList(){
    //     var subject=$("#subjectDDLList").val();
    //     var teacher=$("#teacherDDLList").val();
    //     var user = $("#userDDLList").val();
    //
    //     if(subject==""){
    //         subject=null;
    //     }
    //     if(teacher==""){
    //         teacher=null;
    //     }
    //     if(user==""){
    //         user = null;
    //     }
    //
    //     $.ajax({
    //
    //         url: "BookingServlet",
    //         data: {
    //             SubjectName: subject,
    //             TeacherId: teacher,
    //             UserId: user,
    //             operation: "bookingList"
    //         },
    //         method:"POST",
    //         success: function( result ) {
    //             if (result.ok) {
    //                 console.log(result.data);
    //                 let i=1;
    //
    //                 let tbody = document.getElementById("tabListBody");
    //                 tbody.innerHTML = "";
    //                 for(let booking of result.data){
    //                     let tr = document.createElement("tr");
    //
    //                     tr.appendChild(createTd(i.toString()));
    //                     tr.appendChild(createTd(booking.SlotDate));
    //                     tr.appendChild(createTd(getHours(booking.SlotStart) + ' - ' + getHours(booking.SlotEnd)));
    //                     tr.appendChild(createTd(booking.Subject));
    //                     tr.appendChild(createTd(booking.Teacher));
    //                     if(role == "true") tr.appendChild(createTd(booking.UserId));
    //                     tr.appendChild(createTdStatus(booking.BookingStatus));
    //                     // tr.appendChild(createTd(booking.BookingStatus));
    //                     let td=document.createElement("td");
    //                     if(booking.BookingStatus ==="Attiva") {
    //                         td.appendChild(createDeleteButton(function () {
    //                             $.ajax({
    //                                 url: "SlotServlet",
    //                                 data: {
    //                                     operation: "ownCancellation",
    //                                     BookingId: booking.BookingId
    //                                 },
    //                                 method: "POST",
    //                                 success: function (result) {
    //                                     if (result.ok) {
    //                                         openError("Disdetta!",true);
    //                                         refreshList();
    //                                     } else {
    //                                         openError("Errore: " + result.error);
    //                                     }
    //                                 }
    //                             });
    //                         }));
    //                     }
    //                     if(booking.BookingStatus ==="Attiva" && role==="false"){
    //                         let button=document.createElement("button");
    //                         button.className="btn btn-primary btn-custom";
    //
    //                         let i=document.createElement("i");
    //                         i.className="bi bi-check-circle icon-custom";
    //
    //                         button.onclick=function(){
    //                             $.ajax({
    //                                 url: "SlotServlet",
    //                                 data: {
    //                                     operation: "ownCompletion",
    //                                     BookingId: booking.BookingId
    //                                 },
    //                                 method: "POST",
    //                                 success: function (result) {
    //                                     if (result.ok) {
    //                                         openError("Completata!", true);
    //                                         refreshList();
    //                                     } else {
    //                                         openError("Errore: " + result.error);
    //                                     }
    //                                 }
    //                             });
    //                         };
    //                         button.appendChild(i);
    //                         td.appendChild(button);
    //                     }
    //                     tr.appendChild(td);
    //                     tbody.appendChild(tr);
    //
    //                     i++;
    //                 }
    //             }else{
    //                 openError(result.error);
    //             }
    //         }
    //     });
    // }
    // function refreshTeacher(){
    //     $.ajax(
    //         {
    //             url: "TeacherServlet",
    //             data: {
    //                 operation: "getTeacherList"
    //             },
    //             method: "POST",
    //             success: function (result) {
    //                 if (result.ok) {
    //                     let tbody = document.getElementById("tabTeacherBody");
    //                     let i= 1;
    //                     tbody.innerHTML = "";
    //                     for(let teacher of result.data){
    //                         let tr = document.createElement("tr");
    //                         let editButton=document.createElement("button");
    //                         let editI=document.createElement("i");
    //                         tr.appendChild(createTd(i.toString()));
    //                         tr.appendChild(createTd(teacher.Name));
    //                         tr.appendChild(createTd(teacher.Surname));
    //
    //                         editButton.className="btn btn-primary btn-custom";
    //
    //                         editI.className = "bi bi-pencil-square icon-custom";
    //
    //                         editButton.appendChild(editI);
    //                         editButton.onclick=function () {
    //                             refreshTeaching(teacher.Id,null,teacher.Name+ " "+teacher.Surname);
    //                         };
    //
    //                         let td=document.createElement("td");
    //                         td.appendChild(editButton);
    //                         td.appendChild(createDeleteButton(function () {
    //                             openConfirm("Vuoi davvero eliminare il docente "+teacher.Name+" "+teacher.Surname+ " ?",
    //                                 function (){
    //                                     $.ajax(
    //                                         {
    //                                             url: "TeacherServlet",
    //                                             data: {
    //                                                 Id: teacher.Id,
    //                                                 operation: "deleteTeacher"
    //                                             },
    //                                             method: "POST",
    //                                             success: function (result) {
    //                                                 if (result.ok) {
    //                                                     confirmModal.hide();
    //                                                     refreshTeacher();
    //                                                     reloadAllSubjectTeacher();
    //                                                 }else{
    //                                                     openError(result.error);
    //                                                 }
    //                                             }
    //                                         });
    //                                 })
    //                         }));
    //                         tr.appendChild(td);
    //                         tbody.appendChild(tr);
    //                         i++;
    //                     }
    //                 } else {
    //                     openError(result.error);
    //                 }
    //             }
    //         });
    // }

    // function deleteSubject ( subject){
    //     $.ajax(
    //         {
    //             url: "SubjectsServlet",
    //             data: {
    //                 Name: subject.Name,
    //                 operation: "deleteSubject"
    //             },
    //             method: "POST",
    //             success: function (result) {
    //                 if (result.ok) {
    //                     confirmModal.hide();
    //                     refreshSubjects();
    //                     reloadAllSubjectTeacher();
    //                 }else{
    //                     openError(result.error);
    //                 }
    //             }
    //         });
    // }

    // function refreshSubjects(){
    //     $.ajax(
    //         {
    //             url: "SubjectsServlet",
    //             data: {
    //                 operation: "getSubjectsList"
    //             },
    //             method: "POST",
    //             success: function (result) {
    //                 if (result.ok) {
    //                     let tbody = document.getElementById("tabSubjectsBody");
    //                     let i= 1;
    //                     tbody.innerHTML = "";
    //                     for(let subject of result.data){
    //                         let tr = document.createElement("tr");
    //                         let detailButton=document.createElement("button");
    //                         let detailI=document.createElement("i");
    //                         tr.appendChild(createTd(i.toString()));
    //                         tr.appendChild(createTd(subject.Name));
    //
    //                         detailButton.className="btn btn-primary btn-custom";
    //
    //                         detailI.className = "bi bi-info-square icon-custom";
    //
    //                         detailButton.appendChild(detailI);
    //                         detailButton.onclick=function () {
    //                             refreshTeaching(null,subject.Name);
    //                         };
    //
    //                         let td=document.createElement("td");
    //                         td.appendChild(detailButton);
    //                         td.appendChild(createDeleteButton(function () {
    //                             openConfirm("Vuoi davvero eliminare il corso "+ subject.Name + "  ?", deleteSubject,subject)
    //                         }));
    //                         tr.appendChild(td);
    //                         tbody.appendChild(tr);
    //                         i++;
    //                     }
    //                 } else {
    //                     openError(result.error);
    //                 }
    //             }
    //         });
    // }
    // function refreshTeaching(teacherId,subject,teacherName=null){
    //     $.ajax(
    //         {
    //             url: "TeachingServlet",
    //             data: {
    //                 operation: "getTeachingList",
    //                 teacher:teacherId,
    //                 subject:subject
    //             },
    //             method: "POST",
    //             success: function (result) {
    //                 if (result.ok) {
    //                     let ul = document.getElementById("teachingModalList");
    //                     ul.innerHTML = "";
    //
    //                     $("#subjectTeachingDDL option").show();
    //                     $("#teacherTeachingDDL option").show();
    //
    //                     if(teacherId != null) {
    //                         document.getElementById("subjectTeachingDDL").style.display = "block";
    //                         document.getElementById("teacherTeachingDDL").style.display = "none";
    //                         document.getElementById("newTeaching").onclick= function(){
    //                             newTeaching(teacherId,$("#subjectTeachingDDL").val(),false,teacherName);
    //                         };
    //
    //                     }else{
    //                         document.getElementById("subjectTeachingDDL").style.display="none";
    //                         document.getElementById("teacherTeachingDDL").style.display="block";
    //                         document.getElementById("newTeaching").onclick= function(){
    //                             newTeaching($("#teacherTeachingDDL").val(),subject,true);
    //                         };
    //                     }
    //
    //                     for(let teaching of result.data){
    //                         let li = document.createElement("li");
    //                         li.className = "list-group-item list-li";
    //                         li.innerText = teacherId==null? teaching.teacherName :teaching.subjectName;
    //
    //                         let a = document.createElement("a");
    //                         a.className = "btn btn-outline-primary";
    //                         a.href = "#";
    //                         a.innerText = "Elimina";
    //                         a.style.borderColor = "#5D7772";
    //                         a.style.color = "whitesmoke";
    //
    //                         a.onclick = function () {
    //                             openConfirm("Si conferma di voler eliminare " + teaching.subjectName + " dai corsi di " + teaching.teacherName + "?",
    //                                 deleteTeaching, teaching, teacherId, subject);
    //                         }
    //
    //                         li.appendChild(a);
    //                         ul.appendChild(li);
    //
    //                         if(teacherId != null){
    //
    //                             $("#subjectTeachingDDL option[value='"+teaching.subjectName+"'  ]").hide();
    //                         }else{
    //
    //                             $("#teacherTeachingDDL option[value="+teaching.TeacherId+"]").hide();
    //                         }
    //                     }
    //                     $("#teachingModalLabel").text(teacherId==null? "Docenti di "+ subject:"Corsi di "+ teacherName);
    //                     if(!$('#TeachingModal').is(':visible')) {
    //                         teachingModal.toggle();
    //                     }
    //                 } else {
    //                     openError(result.error);
    //                 }
    //             }
    //         });
    // }

    // function deleteTeaching (teaching, teacherId, subject) {
    //     $.ajax({
    //         url: "TeachingServlet",
    //         data: {
    //             operation: "deleteTeaching",
    //             Id: teaching.Id
    //         },
    //         method: "POST",
    //         success: function (result) {
    //             if (result.ok) {
    //                 teachingModal.toggle();
    //                 refreshTeaching(teacherId,subject);
    //             } else {
    //                 openError("Errore: " + result.error);
    //             }
    //         }
    //     });
    // }
    // function newTeaching(teacherID,subjectName, isNullTeacher,teacherName){
    //     $.ajax({
    //         url: "TeachingServlet",
    //         data: {
    //             operation: "addTeaching",
    //             teacher: teacherID,
    //             subject: subjectName
    //         },
    //         method: "POST",
    //         success: function (result) {
    //             if (result.ok) {
    //                 //teachingModal.toggle();
    //                 $("#subjectTeachingDDL").val("");
    //                 $("#teacherTeachingDDL").val("");
    //                 if(isNullTeacher) {
    //                     refreshTeaching(null, subjectName);
    //                 }else{
    //                     refreshTeaching(teacherID, null,teacherName);
    //                 }
    //             } else {
    //                 openError("Errore: " + result.error);
    //             }
    //         }
    //     });
    // }
    // function createTd(innerText) {
    //     let td = document.createElement("td");
    //     td.innerText = innerText;
    //     return td;
    // }


    // function openConfirm(text,fn,...args){
    //     $("#confirmText").text(text);
    //     document.getElementById("ConfirmButton").onclick=function(){
    //         console.log(args);
    //         fn.apply(this,args);
    //     };
    //     confirmModal.toggle();
    // }

    // function openError(text, isInfo = false){
    //     $("#errorText").text(text);
    //     $("#errorModalLabel").text(isInfo? "Operazione completata" : "Errore");
    //     errorModal.toggle();
    // }


    // function createTdStatus(innerText)
    // {
    //     let status = document.createElement("td");
    //     let statusIcon = document.createElement("img");
    //     if (innerText == "Attiva")
    //     {
    //         statusIcon.src = "book-open.svg";
    //         statusIcon.title = "Attiva";
    //     }
    //     else if(innerText == "Disdetta")
    //     {
    //         statusIcon.src = "x.svg";
    //         statusIcon.title = "Disdetta";
    //     }
    //     else
    //     {
    //         statusIcon.src = "check-circle.svg";
    //         statusIcon.title = "Effettuata";
    //     }
    //     status.align = "center";
    //     status.appendChild(statusIcon);
    //     return status;
    // }

    // function createDeleteButton(fn){
    //     let deleteButton=document.createElement("button");
    //     let deleteI=document.createElement("i");
    //     deleteButton.className="btn btn-primary btn-custom";
    //
    //     deleteI.className="bi bi-trash3 icon-custom";
    //
    //     deleteButton.appendChild(deleteI);
    //
    //     deleteButton.onclick= fn;
    //     return deleteButton;
    // }
    // function reloadAllSubjectTeacher(){
    //     loadSubjects("#subjectDDL");
    //     loadSubjects("#subjectDDLList");
    //     loadSubjects("#subjectTeachingDDL");
    //     loadTeachers("#teacherDDL");
    //     loadTeachers("#teacherDDLList");
    //     loadTeachers("#teacherTeachingDDL");
    //     loadUsers();
    // }
