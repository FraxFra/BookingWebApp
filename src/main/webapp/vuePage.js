var vm= new Vue(
    {
        data: {
            page: "home",
            isLogged: role !== "null",
            // isLogged: this.username !== "",
            username: this.username,
            isAdmin: role === "null"
        },

        el:"#document-container",
        mounted()
        {
            document.cookie = "";
            this.username = document.cookie;
            console.log(document.cookie);

            if (this.username)
            {
                this.isLogged = true;
            }
            var x = window.location.hash, y = "";

            let params = x.split(",");

            if (x.length > 1)
            {
                x = params[0];
                y = params[1];
            }
            if(!x)
            {
                x = "home";
            }

            x = x.replaceAll("#", "");
            if (x !== "login")
            {
                this.refreshPage(x);
            }
            else
            {
                x = "home";
                $("#loginUsername").val(y);
                (new bootstrap.Modal(document.getElementById('exampleModalToggle'))).toggle();
            }
        },

        watch: {
            username: function (val)
            {
                this.username = val;
                if(this.username !== document.cookie)
                {
                    document.cookie = this.username;
                }
                // console.log("username   " + this.username+"\n islogged   " + this.isLogged);
                console.log("Valore " + document.cookie);
            }
        },

        methods: {
            refreshPage: function (page) //switch between pages by the anchor page and refresh the page selected
            {
                this.page = page;
                window.location.hash = page; //set anchor (#...)
                this.showAndHidePages(page);
                switch (page)
                {
                    case "home": refreshCalendar(true);
                    break;
                    case "myCalendar":refreshCalendar(false);
                    break;
                    case "bookingList": refreshList();
                    break;
                    case "teacher":refreshTeacher();
                    break;
                    case "subjects":refreshSubjects();
                    break;
                }
            },

            showAndHidePages: function(page) //hide every element except the page selected
            {
                switch (page)
                {
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

            filterChange: function(event) {
                if (this.page === "home" || this.page === "myCalendar")
                    refreshCalendar(this.page === "home");
                else if (this.page === "bookingList")
                    refreshList();

            },

            login() //login function
            {
                var Username = this.username;
                var Password = $("#loginPassword").val().trim();
                // console.log(Username);
                // console.log(Password);
                if (Username && Password)
                {
                    $.ajax({
                        url: "PageServlet",
                        data: {
                            operation: "login",
                            Username: Username,
                            Password: Password
                        },
                        method:"POST",
                        success: function(result)
                        {
                            // this.isLogged = true;
                            // console.log(this.isLogged);
                            // username = this.username;
                            // console.log(username);
                            if (result.ok)
                            {
                                this.role = result.data[0].role;
                                // document.getElementById("role").innerHTML = this.isLogged;
                                // console.log("Username" + document.getElementById("username").innerHTML);
                                window.location.hash = "";
                                window.location.href = "index.html";
                                // window.location.href = "index.html";
                            }
                            else
                            {
                                loginModal.hide();
                                openError(result.error);
                            }
                        }
                    });
                }
                else
                {
                    alert("Inserire tutti i campi!");
                }
            }


        }

    }
)
