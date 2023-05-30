var vm = new Vue({
    data: {
        page: "home",
        isLogged: false,
        username: this.username,
        isAdmin: false,
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
    mounted() { //inizializzazione della pagina (retrive dai cookies e setup dei modal ovvero dei mesaggi / finestre pop up)
        document.getElementById('exampleModalToggle').addEventListener('shown.bs.modal', function() {
            document.getElementById("loginUsername").focus()
        });
        this.myModal = new bootstrap.Modal(document.getElementById('calendarModal'));
        this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        this.errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        this.loginModal = new bootstrap.Modal(document.getElementById('exampleModalToggle'));
        this.teachingModal = new bootstrap.Modal(document.getElementById('TeachingModal'));
        this.username = this.getCookie("username");
        this.isAdmin = this.getCookie("isAdmin") === "true";

        console.log("Username: " + this.username);
        if (this.username) {
            this.isLogged = true;
        } else {
            this.isLogged = false;
        }

        $("#loginPassword").on("keypress", function(event) {
            if (event.which === 13) { //quando si preme invio
                vm.login();
            }
        });

        $("#loginUsername").on("keypress", function(event) {
            if (event.which === 13) { //quando si preme invio
                vm.login();
            }
        });

        $("#teacherName").on("keypress", function(event) {
            if (event.which === 13) {
                vm.newTeacher();
            }
        });

        $("#teacherSurname").on("keypress", function(event) {
            if (event.which === 13) {
                vm.newTeacher();
            }
        });

        $("#subjectName").on("keypress", function(event) {
            if (event.which === 13) {
                vm.newSubject();
            }
        });

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

        this.loadSubjects();
        this.loadProfessors();

        this.reloadAllSubjectTeacher();

        if (x !== "login") {
            this.refreshPage(x);
        } else {
            x = "home";
            $("#loginUsername").val(y);
            (new bootstrap.Modal(document.getElementById('exampleModalToggle'))).toggle();
        }

        console.log("username: " + this.username + " isLogged" + this.isLogged + " isAdmin" + this.isAdmin);
    },

    watch: {
        username: function(val) { //metodo automatico per memorizzare il nuovo username nei cookies
            this.username = val;
            if (this.username !== document.cookie) {
                this.setCookie("username", this.username);
            }
        }
    },

    methods: {
        refreshPage: function(page) //switch tra le pagine dell'index
        {
            this.page = page;
            window.location.hash = page; //set anchor (#...)
            this.loadSubjects();
            this.loadProfessors();
            this.reloadAllSubjectTeacher();
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

        showAndHidePages: function(page) //nasconde gli elementi di altre pagine ad eccezione della pagina selezionata
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
                    vm.setCookie("username", "");
                    vm.isAdmin = false;
                    vm.isLogged = false;
                    vm.setCookie("isAdmin", false);

                    if (result.ok) {
                        window.location.hash = "";
                        window.location.href = "index.html";
                        $("#weather-temp").html("<strong>" + "Sloggato " + JSON.stringify(result) + "</strong>");
                    } else {
                        $("#weather-temp").html("Errore: " + result.error);
                    }
                }
            });
        },

        login() //login function
        {
            var Username = this.username;
            var Password = $("#loginPassword").val().trim();
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
                        if (result.ok) {
                            if(result.data[0].Role) {
                                vm.isAdmin = true;
                                vm.setCookie("isAdmin", true);
                            } else {
                                vm.isAdmin = false;
                                vm.setCookie("isAdmin", false);
                            }
                            vm.isLogged = true;
                            window.location.hash = "";
                            window.location.href = "index.html";
                        } else {
                            vm.username = "";
                            $("#loginPassword").val("");
                            vm.loginModal.hide();
                            vm.openError(result.error);
                        }
                    }
                });
            } else {
                alert("Inserire tutti i campi!");
            }
        },

        setCookie(cname, cvalue) {
            document.cookie = cname + "=" + cvalue;
        },

        getCookie(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },

        refreshCalendar(isHome) { //refresh del calendario in base ai filtri della materia
            let subject = document.getElementById("#subjectDDL");
            let teacher = document.getElementById("#teacherDDL");

            if (subject === "") {
                subject = null;
            }
            if (teacher === "") {
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
                            return {
                                name: name.description
                            }
                        });
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
                            return {
                                id: name.value,
                                name: name.description
                            }
                        });
                    }
                }
            });
        },

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
                        }
                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        },

        refreshList() { //esegue un refresh sulla lista delle proprie ripetizioni prenotate e crea funzionalmente i cottoni per confermarle o disdirle
            let subject = this.selectedSubjects;
            let teacher = this.selectedProfessors;
            let user = this.username;

            $.ajax({
                url: "BookingServlet",
                data: {
                    SubjectName: vm.materie,
                    TeacherId: vm.professori,
                    UserId: user,
                    operation: "bookingList"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        // console.log(result.data);
                        let i = 1;
                        let idx = 1;

                        let tbody = document.getElementById("tabListBody");
                        tbody.innerHTML = "";
                        for (let booking of result.data) {
                            if (booking.UserId === vm.username) {
                                if (teacher.includes(booking.Teacher) || subject.includes(booking.Subject)) {

                                    let tr = document.createElement("tr");

                                    tr.appendChild(vm.createTd(idx.toString()));
                                    tr.appendChild(vm.createTd(booking.SlotDate));
                                    tr.appendChild(vm.createTd(vm.getHours(booking.SlotStart) + ' - ' + vm.getHours(booking.SlotEnd)));
                                    tr.appendChild(vm.createTd(booking.Subject));
                                    tr.appendChild(vm.createTd(booking.Teacher));
                                    tr.appendChild(vm.createTd(booking.UserId));
                                    tr.appendChild(vm.createTdStatus(booking.BookingStatus));
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
                                    idx++;
                                    if (booking.BookingStatus === "Attiva") {
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
                                }
                            }
                            i++;
                        }
                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        },

        reloadAllSubjectTeacher() {
            this.loadSubjects("#subjectDDL");
            this.loadSubjects("#subjectDDLList");
            this.loadSubjects("#subjectTeachingDDL");
            this.loadProfessors("#teacherDDL");
            this.loadProfessors("#teacherDDLList");
            this.loadProfessors("#teacherTeachingDDL");
            this.loadUsers();
        },

        refreshTeacher() { //esegue un refresh sulla lista dei docenti e crea un bottone per eliminarli
            $.ajax({
                url: "TeacherServlet",
                data: {
                    operation: "getTeacherList"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        let tbody = document.getElementById("tabTeacherBody");
                        let i = 1;
                        tbody.innerHTML = "";
                        for (let teacher of result.data) {
                            let tr = document.createElement("tr");
                            let editButton = document.createElement("button");
                            let editI = document.createElement("i");
                            tr.appendChild(vm.createTd(i.toString()));
                            tr.appendChild(vm.createTd(teacher.Name));
                            tr.appendChild(vm.createTd(teacher.Surname));

                            editButton.className = "btn btn-primary btn-custom";
                            editI.className = "bi bi-pencil-square icon-custom";

                            editButton.appendChild(editI);
                            editButton.onclick = function() {
                                vm.refreshTeaching(teacher.Id, null, teacher.Name + " " + teacher.Surname);
                            };

                            let td = document.createElement("td");
                            td.appendChild(editButton);
                            td.appendChild(vm.createDeleteButton(function() {
                                vm.openConfirm("Vuoi davvero eliminare il docente " + teacher.Name + " " + teacher.Surname + " ?",
                                    function() {
                                        $.ajax({
                                            url: "TeacherServlet",
                                            data: {
                                                Id: teacher.Id,
                                                operation: "deleteTeacher"
                                            },
                                            method: "POST",
                                            success: function(result) {
                                                if (result.ok) {
                                                    vm.confirmModal.hide();
                                                    vm.refreshTeacher();
                                                    vm.reloadAllSubjectTeacher();
                                                } else {
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

        refreshSubjects() { //crea la lista di materie e crea un bottone per disabilitarle
            $.ajax({
                url: "SubjectsServlet",
                data: {
                    operation: "getSubjectsList"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        let tbody = document.getElementById("tabSubjectsBody");
                        let i = 1;
                        tbody.innerHTML = "";
                        for (let subject of result.data) {
                            let tr = document.createElement("tr");
                            let detailButton = document.createElement("button");
                            let detailI = document.createElement("i");
                            tr.appendChild(vm.createTd(i.toString()));
                            tr.appendChild(vm.createTd(subject.Name));

                            detailButton.className = "btn btn-primary btn-custom";

                            detailI.className = "bi bi-info-square icon-custom";

                            detailButton.appendChild(detailI);
                            detailButton.onclick = function() {
                                vm.refreshTeaching(null, subject.Name);
                            };

                            let td = document.createElement("td");
                            td.appendChild(detailButton);
                            td.appendChild(vm.createDeleteButton(function() {
                                vm.openConfirm("Vuoi davvero eliminare il corso " + subject.Name + "  ?", vm.deleteSubject, subject)
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

        refreshTeaching(teacherId, subject, teacherName = null) { //carica la lista di insegnamenti (correlazione tra insegnante e corso) e crea un tasto per disabilitarli
            $.ajax({
                url: "TeachingServlet",
                data: {
                    operation: "getTeachingList",
                    teacher: teacherId,
                    subject: subject
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        let ul = document.getElementById("teachingModalList");
                        ul.innerHTML = "";

                        $("#subjectTeachingDDL option").show();
                        $("#teacherTeachingDDL option").show();

                        console.log(JSON.stringify(vm.professori));

                        if (teacherId != null) {
                            document.getElementById("teacherChoose").style.display = "none";
                            document.getElementById("newTeaching").onclick = function() {
                                vm.newTeaching(teacherId, $("#subjectChoose").val(), false, teacherName);
                            };

                        } else {
                            document.getElementById("teacherChoose").style.display = "block";
                            document.getElementById("subjectChoose").style.display = "none";
                            document.getElementById("newTeaching").onclick = function() {
                                vm.newTeaching(vm.professori[vm.professori.findIndex(n => n.name === $("#teacherChoose").val())].id, subject, true);
                            };
                        }

                        for (let teaching of result.data) {
                            let li = document.createElement("li");
                            li.className = "list-group-item list-li";
                            li.innerText = teacherId == null ? teaching.teacherName : teaching.subjectName;

                            let a = document.createElement("a");
                            a.className = "btn btn-outline-primary";
                            a.href = "#";
                            a.innerText = "Elimina";

                            a.onclick = function() {
                                vm.openConfirm("Si conferma di voler eliminare " + teaching.subjectName + " dai corsi di " + teaching.teacherName + "?",
                                    vm.deleteTeaching, teaching, teacherId, subject);
                            }

                            li.appendChild(a);
                            ul.appendChild(li);

                            if (teacherId != null) {
                                $("#subjectChoose option[value='" + teaching.subjectName + "'  ]").hide();
                            } else {
                                $("#teacherChoose option[value=" + teaching.TeacherId + "]").hide();
                            }
                        }
                        $("#teachingModalLabel").text(teacherId == null ? "Docenti di " + subject : "Corsi di " + teacherName);
                        if (!$('#TeachingModal').is(':visible')) {
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

        openConfirm(text, fn, ...args) {
            $("#confirmText").text(text);
            document.getElementById("ConfirmButton").onclick = function() {
                console.log(args);
                fn.apply(this, args);
            };
            vm.confirmModal.toggle();
        },

        openError(text, isInfo = false) {
            $("#errorText").text(text);
            $("#errorModalLabel").text(isInfo ? "Operazione completata" : "Errore");
            vm.errorModal.toggle();
        },

        createTdStatus(innerText) {
            let status = document.createElement("td");
            let statusIcon = document.createElement("img");
            if (innerText === "Attiva") {
                statusIcon.src = "images/book-open.svg";
                statusIcon.title = "Attiva";
            } else if (innerText === "Disdetta") {
                statusIcon.src = "images/x.svg";
                statusIcon.title = "Disdetta";
            } else {
                statusIcon.src = "images/check-circle.svg";
                statusIcon.title = "Effettuata";
            }
            status.appendChild(statusIcon);
            return status;
        },

        createDeleteButton(fn) {
            let deleteButton = document.createElement("button");
            let deleteI = document.createElement("i");
            deleteButton.className = "btn btn-primary btn-custom";

            deleteI.className = "bi bi-trash3 icon-custom";

            deleteButton.appendChild(deleteI);

            deleteButton.onclick = fn;
            return deleteButton;
        },

        associateColors(data) {
            var colors = [
                "#f59e4d",
                "#f17b1e",
                "#e26114",
                "#bc4912",
                "#953a17",
                "#783216",
                "#ff9c49",
                "#f57a19",
                "#e35d0e",
                "#ad4310",
                "#9f3912"
            ]
            return colors;
            var subjectsColors = [];
            var subjects = this.getSubjects(data, null);

            let i = 0;
            for (let subject of subjects) {
                subjectsColors[subject] = colors[i % colors.length];
                i++;
            }
            return subjectsColors;
        },

        createCalendar(data, isHome) {
            const calendar = $("#calendar");

            const subjectsColors = this.associateColors(data);

            const myModal = new bootstrap.Modal(document.getElementById('calendarModal'));

            let i = 1;

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

            while (i !== 21) {
                let slot = $("#slot-" + i, calendar);
                const slotNr = i;
                let slot_subjects = this.getSubjects(data, i);

                if (slot_subjects.length > 0) {
                    let accessibility_badge = document.createElement("div");
                    accessibility_badge.className = "screenreader";
                    accessibility_badge.innerText = days[parseInt((i - 1) / 4)] + ' ' + hours[(i - 1) % 4];
                    slot.append(accessibility_badge);
                }

                for (let subject = 0; subject < slot_subjects.length; subject++) {
                    let badge = document.createElement("div");
                    badge.style.backgroundColor = subjectsColors[subject];
                    badge.innerText = slot_subjects[subject];
                    badge.className = "badge";
                    badge.onclick = function() {
                        let cells = vm.getTeacherList(data, slotNr, slot_subjects[subject]);

                        $("#calendarModalTitle").text(slot_subjects[subject] + " il " + cells[0].WeekDate + " dalle " + vm.getHours(cells[0].StartTime) + " alle " + vm.getHours(cells[0].EndTime));

                        $("#calendarModalList").empty();

                        for (let cell of cells) {
                            let li = document.createElement("li");
                            li.className = "list-group-item calendar-li";
                            li.innerText = cell.TeacherName + " " + cell.TeacherSurname;

                            let div = document.createElement("div");
                            if (isHome) {
                                let a = document.createElement("a");
                                a.className = "btn btn-outline-primary";
                                a.href = "#";
                                a.innerText = "Prenota";

                                a.setAttribute("v-if", "shared.page='home'")
                                a.onclick = function() {
                                    $.ajax({
                                        url: "SlotServlet",
                                        data: {
                                            operation: "newBooking",
                                            SlotId: slotNr,
                                            SubjectName: slot_subjects[subject],
                                            TeacherId: cell.TeacherId
                                        },
                                        method: "POST",
                                        success: function(result) {
                                            if (result.ok) {
                                                vm.myModal.toggle();
                                                vm.openError("Prenotato!", true);
                                                vm.refreshCalendar(isHome);
                                            } else {
                                                vm.openError("Errore: " + result.error);
                                            }
                                        }
                                    });
                                };
                                div.appendChild(a);
                            } else {

                                let a = document.createElement("a");
                                a.className = "btn btn-outline-primary";
                                a.href = "#";
                                a.innerText = "Disdici";
                                a.style.borderColor = "#5D7772";
                                a.style.color = "whitesmoke";
                                a.style.marginRight = "5px";
                                a.onclick = function() {
                                    $.ajax({
                                        url: "SlotServlet",
                                        data: {
                                            operation: "ownCancellation",
                                            BookingId: cell.BookingId
                                        },
                                        method: "POST",
                                        success: function(result) {
                                            if (result.ok) {
                                                vm.myModal.toggle();
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
                                a.onclick = function() {
                                    $.ajax({
                                        url: "SlotServlet",
                                        data: {
                                            operation: "ownCompletion",
                                            BookingId: cell.BookingId
                                        },
                                        method: "POST",
                                        success: function(result) {
                                            if (result.ok) {
                                                vm.myModal.toggle();
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
                }
                i++;
            }
        },

        refreshCalendarSlots(data, isHome) {
            $("#calendar td:not(:first-child)").empty();
            this.createCalendar(data, isHome);
        },

        getSubjects(data, i) {
            var subjects = [];

            for (let k = 0; k < this.selectedSubjects.length; k++) {
                for (let slot of data) {

                    if (slot.SlotId === i && slot.SubjectName === this.selectedSubjects[k] && !subjects.includes(this.selectedSubjects[k])) {
                        subjects.push(this.selectedSubjects[k]);
                        console.log(slot.SlotId + "  Materia: " + slot.SubjectName + "  " + JSON.stringify(subjects));
                        break;
                    }
                }
            }
            return subjects;
        },

        getTeacherList(data, slot, subject) {
            return data.filter((cell) => cell.SlotId === slot && cell.SubjectName === subject);
        },

        getHours(dateString) {
            return parseInt(dateString.substr(0, 2)) + 12;
        },

        deleteTeaching(teaching, teacherId, subject) {
            $.ajax({
                url: "TeachingServlet",
                data: {
                    operation: "deleteTeaching",
                    Id: teaching.Id
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        vm.teachingModal.toggle();
                        vm.refreshTeaching(teacherId, subject);
                    } else {
                        vm.openError("Errore: " + result.error);
                    }
                }
            });
        },

        newTeaching(teacherID, subjectName, isNullTeacher, teacherName) {
            console.log(teacherID + "  " + subjectName + "   " + isNullTeacher + "   " + teacherName);
            $.ajax({
                url: "TeachingServlet",
                data: {
                    operation: "addTeaching",
                    teacher: teacherID,
                    subject: subjectName
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        $("#subjectChoose").val("");
                        $("#teacherChoose").val("");
                        if (isNullTeacher) {
                            vm.refreshTeaching(null, subjectName);
                        } else {
                            vm.refreshTeaching(teacherID, null, teacherName);
                        }
                    } else {
                        vm.openError("Errore: " + result.error);
                    }
                    vm.refreshPage("teacher");
                }
            });
        },

        newTeacher() {
            $.ajax({
                url: "TeacherServlet",
                data: {
                    operation: "addTeacher",
                    name: $("#teacherName").val().trim(),
                    surname: $("#teacherSurname").val().trim()
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        vm.refreshTeacher();
                        vm.reloadAllSubjectTeacher();
                    } else {
                        vm.openError(result.error);
                    }
                }
            })
        },

        newSubject() {
            $.ajax({
                url: "SubjectsServlet",
                data: {
                    operation: "addSubject",
                    name: $("#subjectName").val().trim()
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        vm.refreshSubjects();
                        vm.reloadAllSubjectTeacher();
                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        },

        deleteSubject(subject) {
            $.ajax({
                url: "SubjectsServlet",
                data: {
                    Name: subject.Name,
                    operation: "deleteSubject"
                },
                method: "POST",
                success: function(result) {
                    if (result.ok) {
                        vm.confirmModal.hide();
                        vm.refreshSubjects();
                        vm.reloadAllSubjectTeacher();
                    } else {
                        vm.openError(result.error);
                    }
                }
            });
        }
    }
});