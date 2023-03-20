var vm = new Vue({
    data: {
        page: "home",
        isLogged: role !== "null",
        // isLogged: this.username !== "",
        username: this.username,
        isAdmin: role === "null",
        confirmModal: null,
        errorModal: null,
        loginModal: null,
        teachingModal: null,
        myModal: null,
        materie: [],
        professori: [],
        selectedSubjects: [],
        selectedProfessors: [],

    },
    el: "#document-container",
    mounted() {
        document.getElementById('exampleModalToggle').addEventListener('shown.bs.modal', function () {
            document.getElementById("loginUsername").focus()
        });
        this.myModal = new bootstrap.Modal(document.getElementById('calendarModal'));
        this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        this.errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        this.loginModal = new bootstrap.Modal(document.getElementById('exampleModalToggle'));
        this.teachingModal = new bootstrap.Modal(document.getElementById('TeachingModal'));
        // this.setCookie("username", "")
        // document.cookie = "username=";
        // console.log("COOKIES: " + document.getElementById("cookies"));
        // this.username = document.cookie;
        this.username = this.getCookie("username");
        this.role = false;
        // console.log("IsLogged: " + this.isLogged);
        // if (this.isLogged == false)
        // {
        //     this.username = "";
        // }
        // this.username = "";
        console.log("Username: " + this.username);
        if (this.username) {
            this.isLogged = true;
        } else {
            this.isLogged = false;
        }
        console.log("IS logged: " + this.isLogged);

        $("#loginPassword").on("keypress", function(event) {
            if (event.which == 13) {
                vm.login();
            }
        });
        this.loadSubjects();
        this.loadProfessors();

        this.reloadAllSubjectTeacher();
        var x = window.location.hash,
            y = "";

        let params = x.split(",");

        if (x.length > 1) {
            x = params[0];
            y = params[1];
        }
        if (!x) {
            x = "home";
        }

        x = x.replaceAll("#", "");
        if (x !== "login") {
            this.refreshPage(x);
        } else {
            x = "home";
            $("#loginUsername").val(y);
            (new bootstrap.Modal(document.getElementById('exampleModalToggle'))).toggle();
        }
    },

    watch: {
        username: function(val) {
            this.username = val;
            if (this.username !== document.cookie) {
                this.setCookie("username", this.username);
                // document.cookie = "username=" + this.username;
            }
            // console.log("username   " + this.username+"\n islogged   " + this.isLogged);
            // console.log("Valore " + document.cookie + "   " + this.username);
            // console.log("COOKIES: " + document.getElementById("cookies"));

        }
    },

    methods: {
        refreshPage: function(page) //switch between pages by the anchor page and refresh the page selected
        {
            this.page = page;
            window.location.hash = page; //set anchor (#...)
            this.showAndHidePages(page);
            switch (page) {
                case "home":
                    this.refreshCalendar(true);
                    break;
                case "myCalendar":
                    this.refreshCalendar(false);
                    break;
                case "bookingList":
                    this.refreshList();
                    break;
                case "teacher":
                    this.refreshTeacher();
                    break;
                case "subjects":
                    this.refreshSubjects();
                    break;
            }
        },

        showAndHidePages: function(page) //hide every element except the page selected
        {
            switch (page) {
                case "home":
                case "myCalendar":
                    $(".pageContent:not(#pageCalendar,#pageContainer)").hide(); //JQuery function used to hide element
                    $("#pageCalendar").show();
                    break;
                case "bookingList":
                    $(".pageContent:not(#pageList,#pageContainer)").hide();
                    $("#pageList").show();
                    break;
                case "teacher":
                    $(".pageContent:not(#pageTeacher,#pageContainer)").hide();
                    $("#pageTeacher").show();
                    break;
                case "subjects":
                    $(".pageContent:not(#pageSubjects,#pageContainer)").hide();
                    $("#pageSubjects").show();
                    break;
            }
            var myOffcanvas = document.getElementById('offcanvasNavbar');
            var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
            bsOffcanvas.hide();
        },

        filterChange() {
            if (this.page === "home" || this.page === "myCalendar")
                this.refreshCalendar(this.page === "home");
            else if (this.page === "bookingList")
                this.refreshList();

        },
        logout() {
            $.ajax({
                url: "PageServlet",
                data: {
                    operation: "logout"
                },
                method: "POST",
                success: function(result) {
                    // this.username = "";
                    vm.setCookie("username", "");
                    // console.log("TEST" + JSON.stringify(result));
                    // this.setCookie(this.username);
                    // document.cookie = "";
                    // this.isLogged = false;
                    // console.log(document.cookie + " username " + this.username);
                    // document.cookie = "";
                    // this.isLogged = false;
                    // document.cookie = "username=";
                    // console.log("COOKIES: " + document.getElementById("cookies"));
                    if (result.ok) {
                        window.location.hash = "";
                        window.location.href = "index.html";
                        // window.location.href = "index.jsp";
                        $("#weather-temp").html("<strong>" + "Sloggato " + JSON.stringify(result) + "</strong>");
                    } else {
                        $("#weather-temp").html("Errore: " + result.error);
                    }
                }
            });
        },
        setCookie(cname, cvalue /*, exdays*/ ) {
            /*const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = "expires="+d.toUTCString();*/
            document.cookie = cname + "=" + cvalue /*+ ";" + expires + ";path=/"*/ ;
        },
        getCookie(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        refreshCalendar(isHome) {
            // var subject = $("#subjectDDL").val().trim();
            let subject = document.getElementById("#subjectDDL");
            // var teacher = $("#teacherDDL").val().trim();
            let teacher = document.getElementById("#teacherDDL");
            // console.log(subject);
            if (subject == "") {
                subject = null;
            }
            if (teacher == "") {
                teacher = null;
            }
            $.ajax({

                url: "SlotServlet",
                data: {
                    SubjectName: subject,
                    TeacherId: teacher,
                    operation: isHome ? "availableBookings" : "ownCalendar"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        vm.refreshCalendarSlots(result.data, isHome);
                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        },
        myCalendar() {
            $.ajax({
                url: "SlotServlet",
                data: {
                    operation: "ownCalendar"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        vm.refreshCalendarSlots(result.data);
                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        },
        loadSubjects() {
            $.ajax({
                url: "SlotServlet",
                data: {
                    operation: "subjectDDL"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        vm.materie = result.data.map(name => {
                            return{
                                name:name.description
                            }
                        });
                    } else {
                        // vm.openError(result.error);
                    }
                }
            });
        },
        loadProfessors() {
            $.ajax({
                url: "SlotServlet",
                data: {
                    operation: "teacherDDL"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        vm.professori = result.data.map(name => {
                            return{
                                name:name.description
                            }
                        });
                    } else {
                        // vm.openError(result.error);
                    }
                }
            });
        },
        /*changeSubjects(index) {
            this.filterChange();
        },
        changeProfessors(index) {
            this.$delete(this.professori, index);
            this.filterChange();
        },*/

        loadUsers() {
            $.ajax({
                url: "BookingServlet",
                data: {
                    operation: "userDDLList"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        $("#userDDLList").empty();
                        let option = document.createElement("option");
                        option.value = "";
                        option.innerText = "Selezionare utente";
                        $("#userDDLList").append(option);
                        for (let subject of result.data) {
                            let option = document.createElement("option");
                            option.value = subject.value;
                            option.innerText = subject.description;
                            $("#userDDLList").append(option);
                            // option.style.color="whitesmoke";
                            // option.style.backgroundColor="#2c2e2f";
                        }

                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        },
        refreshList() {
            var subject = $("#subjectDDLList").val();
            var teacher = $("#teacherDDLList").val();
            var user = $("#userDDLList").val();

            if (subject == "") {
                subject = null;
            }
            if (teacher == "") {
                teacher = null;
            }
            if (user == "") {
                user = null;
            }

            $.ajax({
                url: "BookingServlet",
                data: {
                    SubjectName: subject,
                    TeacherId: teacher,
                    UserId: user,
                    operation: "bookingList"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        console.log(result.data);
                        let i = 1;

                        let tbody = document.getElementById("tabListBody");
                        tbody.innerHTML = "";
                        for (let booking of result.data) {
                            let tr = document.createElement("tr");

                            tr.appendChild(vm.createTd(i.toString()));
                            tr.appendChild(vm.createTd(booking.SlotDate));
                            tr.appendChild(vm.createTd(vm.getHours(booking.SlotStart) + ' - ' + vm.getHours(booking.SlotEnd)));
                            tr.appendChild(vm.createTd(booking.Subject));
                            tr.appendChild(vm.createTd(booking.Teacher));
                            /*if (role == "true") */tr.appendChild(vm.createTd(booking.UserId));
                            tr.appendChild(vm.createTdStatus(booking.BookingStatus));
                            // tr.appendChild(createTd(booking.BookingStatus));
                            let td = document.createElement("td");
                            if (booking.BookingStatus === "Attiva") {
                                td.appendChild(vm.createDeleteButton(function() {
                                    $.ajax({
                                        url: "SlotServlet",
                                        data: {
                                            operation: "ownCancellation",
                                            BookingId: booking.BookingId
                                        },
                                        method: "POST",
                                        success: function(result) {
                                            if (result.ok) {
                                                vm.openError("Disdetta!", true);
                                                vm.refreshList();
                                            } else {
                                                vm.openError("Errore: " + result.error);
                                            }
                                        }
                                    });
                                }));
                            }
                            if (booking.BookingStatus === "Attiva" /*&& role === "false"*/) {
                                let button = document.createElement("button");
                                button.className = "btn btn-primary btn-custom";

                                let i = document.createElement("i");
                                i.className = "bi bi-check-circle icon-custom";

                                button.onclick = function() {
                                    $.ajax({
                                        url: "SlotServlet",
                                        data: {
                                            operation: "ownCompletion",
                                            BookingId: booking.BookingId
                                        },
                                        method: "POST",
                                        success: function(result) {
                                            if (result.ok) {
                                                vm.openError("Completata!", true);
                                                vm.refreshList();
                                            } else {
                                                vm.openError("Errore: " + result.error);
                                            }
                                        }
                                    });
                                };
                                button.appendChild(i);
                                td.appendChild(button);
                            }
                            tr.appendChild(td);
                            tbody.appendChild(tr);

                            i++;
                        }
                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        },
        reloadAllSubjectTeacher(){
            this.loadSubjects("#subjectDDL");
            this.loadSubjects("#subjectDDLList");
            this.loadSubjects("#subjectTeachingDDL");
            this.loadProfessors("#teacherDDL");
            this.loadProfessors("#teacherDDLList");
            this.loadProfessors("#teacherTeachingDDL");
            this.loadUsers();
        },
        refreshTeacher(){
            $.ajax(
            {
                url: "TeacherServlet",
                data: {
                    operation: "getTeacherList"
                },
                method: "POST",
                success: function (result) {
                    if (result.ok) {
                        let tbody = document.getElementById("tabTeacherBody");
                        let i= 1;
                        tbody.innerHTML = "";
                        for(let teacher of result.data){
                            let tr = document.createElement("tr");
                            let editButton=document.createElement("button");
                            let editI=document.createElement("i");
                            tr.appendChild(vm.createTd(i.toString()));
                            tr.appendChild(vm.createTd(teacher.Name));
                            tr.appendChild(vm.createTd(teacher.Surname));

                            editButton.className="btn btn-primary btn-custom";

                            editI.className = "bi bi-pencil-square icon-custom";

                            editButton.appendChild(editI);
                            editButton.onclick=function () {
                                vm.refreshTeaching(teacher.Id,null,teacher.Name+ " "+teacher.Surname);
                            };

                            let td=document.createElement("td");
                            td.appendChild(editButton);
                            td.appendChild(vm.createDeleteButton(function () {
                                vm.openConfirm("Vuoi davvero eliminare il docente "+teacher.Name+" "+teacher.Surname+ " ?",
                                    function (){
                                        $.ajax(
                                            {
                                                url: "TeacherServlet",
                                                data: {
                                                    Id: teacher.Id,
                                                    operation: "deleteTeacher"
                                                },
                                                method: "POST",
                                                success: function (result) {
                                                    if (result.ok) {
                                                        vm.confirmModal.hide();
                                                        vm.refreshTeacher();
                                                        vm.reloadAllSubjectTeacher();
                                                    }else{
                                                        vm.openError(result.error);
                                                    }
                                                }
                                            });
                                    })
                            }));
                            tr.appendChild(td);
                            tbody.appendChild(tr);
                            i++;
                        }
                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        },
        refreshSubjects(){
            $.ajax(
            {
                url: "SubjectsServlet",
                data: {
                    operation: "getSubjectsList"
                },
                method: "POST",
                success: function (result) {
                    if (result.ok) {
                        let tbody = document.getElementById("tabSubjectsBody");
                        let i= 1;
                        tbody.innerHTML = "";
                        for(let subject of result.data){
                            let tr = document.createElement("tr");
                            let detailButton=document.createElement("button");
                            let detailI=document.createElement("i");
                            tr.appendChild(vm.createTd(i.toString()));
                            tr.appendChild(vm.createTd(subject.Name));

                            detailButton.className="btn btn-primary btn-custom";

                            detailI.className = "bi bi-info-square icon-custom";

                            detailButton.appendChild(detailI);
                            detailButton.onclick=function () {
                                vm.refreshTeaching(null,subject.Name);
                            };

                            let td=document.createElement("td");
                            td.appendChild(detailButton);
                            td.appendChild(vm.createDeleteButton(function () {
                                vm.openConfirm("Vuoi davvero eliminare il corso "+ subject.Name + "  ?", deleteSubject,subject)
                            }));
                            tr.appendChild(td);
                            tbody.appendChild(tr);
                            i++;
                        }
                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        },
        refreshTeaching(teacherId,subject,teacherName=null){
            $.ajax(
            {
                url: "TeachingServlet",
                data: {
                    operation: "getTeachingList",
                    teacher:teacherId,
                    subject:subject
                },
                method: "POST",
                success: function (result) {
                    if (result.ok) {
                        let ul = document.getElementById("teachingModalList");
                        ul.innerHTML = "";

                        $("#subjectTeachingDDL option").show();
                        $("#teacherTeachingDDL option").show();

                        if(teacherId != null) {
                            document.getElementById("subjectTeachingDDL").style.display = "block";
                            document.getElementById("teacherTeachingDDL").style.display = "none";
                            document.getElementById("newTeaching").onclick= function(){
                                vm.newTeaching(teacherId,$("#subjectTeachingDDL").val(),false,teacherName);
                            };

                        }else{
                            document.getElementById("subjectTeachingDDL").style.display="none";
                            document.getElementById("teacherTeachingDDL").style.display="block";
                            document.getElementById("newTeaching").onclick= function(){
                                vm.newTeaching($("#teacherTeachingDDL").val(),subject,true);
                            };
                        }

                        for(let teaching of result.data){
                            let li = document.createElement("li");
                            li.className = "list-group-item list-li";
                            li.innerText = teacherId==null? teaching.teacherName :teaching.subjectName;

                            let a = document.createElement("a");
                            a.className = "btn btn-outline-primary";
                            a.href = "#";
                            a.innerText = "Elimina";
                            a.style.borderColor = "#5D7772";
                            a.style.color = "whitesmoke";

                            a.onclick = function () {
                                vm.openConfirm("Si conferma di voler eliminare " + teaching.subjectName + " dai corsi di " + teaching.teacherName + "?",
                                    vm.deleteTeaching, teaching, teacherId, subject);
                            }

                            li.appendChild(a);
                            ul.appendChild(li);

                            if(teacherId != null){

                                $("#subjectTeachingDDL option[value='"+teaching.subjectName+"'  ]").hide();
                            }else{

                                $("#teacherTeachingDDL option[value="+teaching.TeacherId+"]").hide();
                            }
                        }
                        $("#teachingModalLabel").text(teacherId==null? "Docenti di "+ subject:"Corsi di "+ teacherName);
                        if(!$('#TeachingModal').is(':visible')) {
                            vm.teachingModal.toggle();
                        }
                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        },
        createTd(innerText) {
            let td = document.createElement("td");
            td.innerText = innerText;
            return td;
        },
        openConfirm(text,fn,...args){
            $("#confirmText").text(text);
            document.getElementById("ConfirmButton").onclick=function(){
                console.log(args);
                fn.apply(this,args);
            };
            vm.confirmModal.toggle();
        },
        openError(text, isInfo = false){
            $("#errorText").text(text);
            $("#errorModalLabel").text(isInfo? "Operazione completata" : "Errore");
            vm.errorModal.toggle();
        },
        createTdStatus(innerText)
        {
            let status = document.createElement("td");
            let statusIcon = document.createElement("img");
            if (innerText == "Attiva")
            {
                statusIcon.src = "book-open.svg";
                statusIcon.title = "Attiva";
            }
            else if(innerText == "Disdetta")
            {
                statusIcon.src = "x.svg";
                statusIcon.title = "Disdetta";
            }
            else
            {
                statusIcon.src = "check-circle.svg";
                statusIcon.title = "Effettuata";
            }
            // status.align = "center";
            status.appendChild(statusIcon);
            return status;
        },
        createDeleteButton(fn){
            let deleteButton=document.createElement("button");
            let deleteI=document.createElement("i");
            deleteButton.className="btn btn-primary btn-custom";

            deleteI.className="bi bi-trash3 icon-custom";

            deleteButton.appendChild(deleteI);

            deleteButton.onclick= fn;
            return deleteButton;
        },
        associateColors(data){
            var colors = [
                "#f59e4d",
                "#f17b1e",
                "#e26114",
                "#bc4912",
                "#953a17",
                "#783216"
            ]
            return colors;
            var subjectsColors = [];
            var subjects = this.getSubjects(data,null);
            // var subjects = this.selectedSubjects;

            let i = 0;
            for (let subject of subjects){
                subjectsColors[subject] = colors[i % colors.length];
                i++;
            }
            return subjectsColors;
        },
        createCalendar(data,isHome){
            const calendar = $("#calendar");

            const subjectsColors = this.associateColors(data);

            const myModal = new bootstrap.Modal(document.getElementById('calendarModal'));

            let i=1;

            const days = [
                "Lunedi",
                "Martedi",
                "Mercoledi",
                "Giovedi",
                "Venerdi"
            ];

            const hours = [
                "dalle 15 alle 16",
                "dalle 16 alle 17",
                "dalle 17 alle 18",
                "dalle 18 alle 19",
            ];

            while(i!=21){
                let slot = $("#slot-"+i,calendar);
                const slotNr = i;
                //let slot_subjects = this.getSubjects(data,i);
                let slot_subjects = this.getSubjects(data, i);

                if (slot_subjects.length > 0) {
                    let accessibility_badge = document.createElement("div");
                    accessibility_badge.className = "screenreader";
                    accessibility_badge.innerText = days[parseInt((i-1) / 4)] + ' ' + hours[(i - 1) % 4];
                    slot.append(accessibility_badge);
                }

                // for(let subject of slot_subjects) {
                for(let subject = 0; subject < slot_subjects.length; subject++) {
                    let badge = document.createElement("div");
                    badge.style.backgroundColor = subjectsColors[subject];
                    // badge.style.cursor = "pointer";
                    //badge.innerText = subject;
                    badge.innerText = slot_subjects[subject];
                    badge.className = "badge";
                    badge.onclick = function(){
                        // let cells = vm.getTeacherList(data,slotNr,subject);
                        let cells = vm.getTeacherList(data,slotNr,slot_subjects[subject]);

                        $("#calendarModalTitle").text(subject + " il " + cells[0].WeekDate + " dalle " + vm.getHours(cells[0].StartTime) + " alle " + vm.getHours(cells[0].EndTime));

                        $("#calendarModalList").empty();

                        for (let cell of cells){
                            let li = document.createElement("li");
                            li.className = "list-group-item calendar-li";
                            li.innerText = cell.TeacherName + " " + cell.TeacherSurname;

                            let div=document.createElement("div");
                            if(isHome) {
                                let a = document.createElement("a");
                                a.className = "btn btn-outline-primary";
                                a.href = "#";
                                a.innerText = "Prenota";
                                // a.style.background = "#fc4a1a";
                                // a.style.background = "-webkit-linear-gradient(to right, #f7b733, #fc4a1a)";
                                // a.style.background = "linear-gradient(to right, #f7b733, #fc4a1a)";
                                // a.style.color = "#fff";
                                // a.style.border = "1px solid #eee";
                                // a.style.borderRadius = "10px";

                                a.setAttribute("v-if", "shared.page='home'")
                                a.onclick = function () {
                                    $.ajax({
                                        url: "SlotServlet",
                                        data: {
                                            operation: "newBooking",
                                            SlotId: slotNr,
                                            SubjectName: subject,
                                            TeacherId: cell.TeacherId
                                        },
                                        method: "POST",
                                        success: function (result) {
                                            if (result.ok) {
                                                myModal.toggle();
                                                vm.openError("Prenotato!",true);
                                                vm.refreshCalendar(isHome);
                                            } else {
                                                vm.openError("Errore: " + result.error);
                                            }
                                        }
                                    });
                                };
                                div.appendChild(a);
                            }else {

                                let a = document.createElement("a");
                                a.className = "btn btn-outline-primary";
                                a.href = "#";
                                a.innerText = "Disdici";
                                a.style.borderColor = "#5D7772";
                                a.style.color = "whitesmoke";
                                a.style.marginRight="5px";
                                a.onclick = function () {
                                    $.ajax({
                                        url: "SlotServlet",
                                        data: {
                                            operation: "ownCancellation",
                                            BookingId: cell.BookingId
                                        },
                                        method: "POST",
                                        success: function (result) {
                                            if (result.ok) {
                                                myModal.toggle();
                                                vm.openError("Disdetta!", true);
                                                vm.refreshCalendar(isHome);
                                            } else {
                                                vm.openError("Errore: " + result.error);
                                            }
                                        }
                                    });
                                };
                                div.appendChild(a);
                                a = document.createElement("a");
                                a.className = "btn btn-outline-primary";
                                a.href = "#";
                                a.innerText = "Completa";
                                a.style.borderColor = "#5D7772";
                                a.style.color = "whitesmoke";
                                a.onclick = function () {
                                    $.ajax({
                                        url: "SlotServlet",
                                        data: {
                                            operation: "ownCompletion",
                                            BookingId: cell.BookingId
                                        },
                                        method: "POST",
                                        success: function (result) {
                                            if (result.ok) {
                                                myModal.toggle();
                                                vm.openError("Completata!", true);
                                                vm.refreshCalendar(isHome);
                                            } else {
                                                vm.openError("Errore: " + result.error);
                                            }
                                        }
                                    });
                                };
                                div.appendChild(a);
                            }
                            li.appendChild(div);
                            $("#calendarModalList").append(li);
                        }
                        vm.myModal.show();
                    };
                    slot.append(badge);
                    //slot.append("<div class='badge' style='background-color:"+ subjectsColors[subject] + "'>" + subject + "</div>" );
                }
                i++;
            }
        },
        refreshCalendarSlots(data,isHome){
            $("#calendar td:not(:first-child)").empty();
            this.createCalendar(data,isHome);
        },
        getSubjects(data,i){
            var subjects = [];

            /*for(let slot of data){
                if(slot.SlotId === i || i == null){
                    let found = false;
                    for(let subject of subjects){
                        if (subject === slot.SubjectName){
                            found = true;
                            break;
                        }
                    }
                    if (this.selectedSubjects.indexOf(slot.SubjectName)) {
                        subjects.push(slot.SubjectName);
                    }

                    if(!found){
                        subjects.push(slot.SubjectName);
                    }
                }
            }*/


            for(let k = 0; k < this.selectedSubjects.length; k++)
            {
                for(let slot of data) {

                    if (slot.SlotId == i && slot.SubjectName == this.selectedSubjects[k] && !subjects.includes(this.selectedSubjects[k])) {
                        subjects.push(this.selectedSubjects[k]);
                        console.log(slot.SlotId + "  Materia: " + slot.SubjectName + "  "+JSON.stringify(subjects));
                        break;
                    }
                }
            }

            // for(let slot of data)
            // {
            // if (this.selectedSubjects.length > 0) {
            //     for(let sub = 0; sub < this.selectedSubjects.length; sub++) {
            //         for (let slot of data) {
            //             console.log(slot.SlotId + "materia " + slot.SubjectName);
            //             if (slot.SlotId == i && slot.SubjectName == this.selectedSubjects[sub]) {
            //                 subjects.push(this.selectedSubjects[sub]);
            //                 break;
            //             }
            //         }
            //     }
            // }
            return subjects;
        },
        getTeacherList(data,slot,subject){
            return data.filter((cell)=>cell.SlotId == slot && cell.SubjectName == subject);
        },
        getHours(dateString){
            return parseInt(dateString.substr(0,2))+ 12;
        },
        deleteTeaching (teaching, teacherId, subject) {
            $.ajax({
                url: "TeachingServlet",
                data: {
                    operation: "deleteTeaching",
                    Id: teaching.Id
                },
                method: "POST",
                success: function (result) {
                    if (result.ok) {
                        vm.teachingModal.toggle();
                        vm.refreshTeaching(teacherId,subject);
                    } else {
                        vm.openError("Errore: " + result.error);
                    }
                }
            });
        },
        newTeaching(teacherID,subjectName, isNullTeacher,teacherName){
            $.ajax({
                url: "TeachingServlet",
                data: {
                    operation: "addTeaching",
                    teacher: teacherID,
                    subject: subjectName
                },
                method: "POST",
                success: function (result) {
                    if (result.ok) {
                        //teachingModal.toggle();
                        $("#subjectTeachingDDL").val("");
                        $("#teacherTeachingDDL").val("");
                        if(isNullTeacher) {
                            vm.refreshTeaching(null, subjectName);
                        }else{
                            vm.refreshTeaching(teacherID, null,teacherName);
                        }
                    } else {
                        vm.openError("Errore: " + result.error);
                    }
                }
            });
        },
        login() //login function
        {
            var Username = this.username;
            var Password = $("#loginPassword").val().trim();
            // console.log(Username);
            // console.log(Password);
            if (Username && Password) {
                $.ajax({
                    url: "PageServlet",
                    data: {
                        operation: "login",
                        Username: Username,
                        Password: Password
                    },
                    method: "POST",
                    success: function(result) {
                        // this.setCookie("username", this.username);
                        // this.isLogged = true;
                        // console.log(this.isLogged);
                        // username = this.username;
                        // console.log(username);
                        if (result.ok) {
                            // this.role = result.data[0].role;
                            // document.getElementById("role").innerHTML = this.isLogged;
                            // console.log("Username" + document.getElementById("username").innerHTML);
                            window.location.hash = "";
                            window.location.href = "index.html";
                            // window.location.href = "index.html";
                        } else {
                            this.loginModal.hide();
                            vm.openError(result.error);
                        }
                    }
                });
            } else {
                alert("Inserire tutti i campi!");
            }
        }
    }
});