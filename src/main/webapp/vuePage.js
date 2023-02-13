var vm= new Vue(
    {
        data: {
            page: "home",
            isLogged: role !== "null",
            username:username,
            isAdmin:role === "true"
        },
        el:"#document-container",
        mounted(){
            var x= window.location.hash, y = "";

            let params = x.split(",");

            if (x.length > 1){
                x = params[0];
                y = params[1];
            }
            if(!x){
                x="home";
            }
            x = x.replaceAll("#", "");
            if (x!== "login") {
                this.refreshPage(x);
            }else{
                x="home";
                $("#loginUsername").val(y);
                (new bootstrap.Modal(document.getElementById('exampleModalToggle'))).toggle();
            }
        },
        methods: {
            refreshPage:function (page) {
                this.page=page;
                window.location.hash=page;
                this.showAndHidePages(page);
                switch (page){
                    case "home": refreshCalendar(true); break;
                    case "myCalendar":refreshCalendar(false);break;
                    case "bookingList": refreshList();break;
                    case "teacher":refreshTeacher();break;
                    case "subjects":refreshSubjects();break;
                }
            },
            showAndHidePages: function(page){
                switch (page){
                    case "home":
                    case "myCalendar":
                        $(".pageContent:not(#pageCalendar,#pageContainer)").hide();
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

            }
        }

    }
)
