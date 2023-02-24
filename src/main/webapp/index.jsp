<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="it">
<head>
    <title>Servizio Ripetizioni</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no,maximum-scale=1.0,user-scalable=no">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link href="page.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link href="calendar.css" rel="stylesheet">
    <script>

        const username = "<%= session.getAttribute("username") %>" ;
        console.log(username);
        const role = "<%= session.getAttribute("role") %>" ;
        console.log(role);
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
    <script src="calendar.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="script.js"></script>

</head>

<body >

<main id="document-container" class="container-fluid p-0 m-0">
    <nav class="navbar navbar-expand-md navbar-dark" id="navbar">
        <div class="container-fluid">
            <div>
                <a class="navbar-brand bookIcon" href="#" >
                    <img src="bookmark.svg"  width="30" height="30" alt="" />
                </a>

                <aside   style=" float:left;" class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" >

                    <div class="offcanvas-header">
                        <div></div>
                        <button  type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <ul class="navbar-nav justify-content-start flex-grow-1 pe-3">
                            <li class="nav-item me-1">
                                <a class="nav-link active me-1" aria-current="page" href="#" v-on:click="refreshPage('home')" data-bs-dismiss="offcanvas" aria-hidden="true">Home</a>
                            </li>
<%--                            <li class="nav-item me-1">--%>
<%--                                <a v-if="isLogged" class="nav-link active me-1" aria-current="page" href="#myCalendar" v-on:click="refreshPage('myCalendar')"data-bs-dismiss="offcanvas">Calendario</a>--%>
<%--                            </li>--%>
                            <li>
                                <a v-if="isLogged" class="nav-link active me-1" aria-current="page" href="#" v-on:click="refreshPage('bookingList')"data-bs-dismiss="offcanvas">Prenotazioni</a>
                            </li>
                            <li>
                                <a v-if="isLogged && isAdmin"  class="nav-link active" aria-current="page" href="#" v-on:click="refreshPage('teacher')"data-bs-dismiss="offcanvas">Insegnanti</a>
                            </li>
                            <li>
                                <a v-if="isLogged && isAdmin"  class="nav-link active" aria-current="page" href="#" v-on:click="refreshPage('subjects')"data-bs-dismiss="offcanvas">Corsi</a>

                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
            <div>
                <a v-if="!isLogged" class="btn btn-primary btn-log" data-bs-toggle="modal" href="#exampleModalToggle" role="button" id="loginBtn">Accedi/Registrati</a>
                <a v-if="isLogged" class="btn disabled btn-log"  role="button" id="userInfo"><i class="bi bi-person-circle"></i>&nbsp;{{username}} </a>
                <a v-if="isLogged" class="btn btn-primary btn-log"  role="button" id="btnLogout" >Logout</a>

            </div>
            <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                <div class="burger">
                    <div class="lin1"></div>
                    <div class="lin2"></div>
                    <div class="lin3"></div>
                </div>
            </button>

        </div>
    </nav>

    <div class="pageContent row g-0" id="pageContainer">
        <div class="pageContent row g-0" id="pageList" style="display: none">
            <div class="col-lg-3">
                <select v-on:change="filterChange" id="subjectDDLList" class="form-select filter" aria-label="Default select example" >
                </select>
                <br>
                <select v-on:change="filterChange" id="teacherDDLList" class="form-select filter" aria-label="Default select example">

                </select>
                <br>
                <select v-on:change="filterChange" v-if="isAdmin" id="userDDLList" class="form-select filter" aria-label="Default select example">

                </select>
            </div>
            <div class="col-lg-6">
                <table class="table table-striped " id ="tabList">
                    <thead>
                    <tr aria-hidden="true">
                        <th>#</th>
                        <th>Giorno</th>
                        <th>Ora</th>
                        <th>Materia</th>
                        <th>Insegnante</th>
                        <th v-if="isAdmin">Utente</th>
                        <th style = "text-align: center;">Stato</th>
                        <th>Opzioni</th>
                    </tr>
                    </thead>
                    <tbody id = "tabListBody">

                    </tbody>
                </table>
            </div>
        </div>

        <div class="pageContent row g-0" id="pageSubjects" style="display: none">
            <div class="col-lg-3 p-1 ps-3 pe-3">
                <form>
                    <div class="form-group">
                        <label for="subjectName" style="color: whitesmoke">Materia</label>
                        <input type="text" class="form-control textInput" id="subjectName">
                    </div>
                    <br/>
                    <button id="newSubject" type="button" class="btn btn-primary textButton" >Inserisci</button>
                </form>
            </div>
            <div class= "col-lg-9">
                <table class="table table-dark table-striped table-hover" id ="tabSubjects">
                    <thead>
                    <tr>
                        <th style="width: 15%">#</th>
                        <th style="width: 70%">Corso</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody id = "tabSubjectsBody">

                    </tbody>
                </table>
            </div>
        </div>

        <div class="pageContent row g-0" id="pageTeacher" style="display: none">
            <div class="col-lg-3 p-1 ps-3 pe-3">
                <form>
                    <div class="form-group">
                        <label for="teacherName" style="color: whitesmoke">Nome</label>
                        <input type="text" class="form-control textInput" id="teacherName">
                    </div>
                    <br/>
                    <div class="form-group">
                        <label for="teacherSurname" style="color: whitesmoke">Cognome</label>
                        <input type="text" class="form-control textInput" id="teacherSurname">
                    </div>
                    <br/>
                    <button id="newTeacher" type="button" class="btn btn-primary textButton" >Inserisci</button>
                </form>
            </div>
            <div class= "col-lg-9">
                <table class="table table-dark table-striped table-hover" id ="tabTeacher">
                    <thead>
                    <tr>
                        <th style="width: 15%">#</th>
                        <th style="width: 35%">Nome</th>
                        <th style="width: 35%">Cognome</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody id = "tabTeacherBody">

                    </tbody>
                </table>
            </div>
        </div>



        <div class="pageContent row g-0" id="pageCalendar">
            <div class="col-lg-3">
                <select v-on:change="filterChange" id="subjectDDL" class="form-select filter" aria-label="Default select example" >

                </select>
                <br>
                <select v-on:change="filterChange" id="teacherDDL" class="form-select filter" aria-label="Default select example"
                >

                </select>
            </div>
            <div class="col-lg-6">
                <table id="calendar" class="table">
                    <tr style="border: none">
                        <th></th>
                        <th aria-hidden="true">
                            <span class="pc" id="dLun">LUNEDI'</span>
                            <span class="mobile">LUN</span>
                        </th>
                        <th aria-hidden="true">
                            <span class="pc">MARTEDI'</span>
                            <span class="mobile">MAR</span>
                        </th>
                        <th aria-hidden="true">
                            <span class="pc">MERCOLEDI'</span>
                            <span class="mobile">MER</span>
                        </th>
                        <th aria-hidden="true">
                            <span class="pc">GIOVEDI'</span>
                            <span class="mobile">GIO</span>
                        </th>
                        <th aria-hidden="true">
                            <span class="pc">VENERDI'</span>
                            <span class="mobile">VEN</span>
                        </th>
                    </tr>
                    <tr aria-label="Lunedì">
                        <td class="hour" aria-hidden="true">15:00 - 16:00 </td>
                        <td id="slot-1" aria-description="Lunedì"></td>
                        <td id="slot-5"></td>
                        <td id="slot-9"></td>
                        <td id="slot-13"></td>
                        <td id="slot-17"></td>
                    </tr>
                    <tr>
                        <td class="hour" aria-hidden="true">16:00 - 17:00</td>
                        <td id="slot-2"></td>
                        <td id="slot-6"></td>
                        <td id="slot-10"></td>
                        <td id="slot-14"></td>
                        <td id="slot-18"></td>
                    </tr>
                    <tr>
                        <td class="hour" aria-hidden="true">17:00 - 18:00</td>
                        <td id="slot-3"></td>
                        <td id="slot-7"></td>
                        <td id="slot-11"></td>
                        <td id="slot-15"></td>
                        <td id="slot-19"></td>
                    </tr>
                    <tr>
                        <td class="hour" aria-hidden="true">18:00 - 19:00</td>
                        <td id="slot-4"></td>
                        <td id="slot-8"></td>
                        <td id="slot-12"></td>
                        <td id="slot-16"></td>
                        <td id="slot-20"></td>
                    </tr>

                </table>
            </div>
        </div>
    </div>
    <div class="modal fade" id="calendarModal" aria-hidden="true" aria-labelledby="calendarModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-colors" >
                <div class="modal-header">
                    <h5 class="modal-title" id="calendarModalTitle">Accedi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul class="list-group" id="calendarModalList"></ul>

                </div>

            </div>
        </div>
    </div>


    <div  class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
        <div  class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-colors" >
                <div class="modal-header" >
                    <h5   class="modal-title" id="exampleModalToggleLabel">Accedi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3 row">
                        <label for="loginUsername" class="col-sm-2 col-form-label">Username</label>
                        <div class="col-sm-10">
                            <input required type="text" id="loginUsername" class="form-control"  >
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="loginPassword"  class="col-sm-2 col-form-label">Password</label>
                        <div class="col-sm-10">
                            <input required type="password" class="form-control textInput" id="loginPassword">
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary textButton" id='loginButton' name="Login" type="submit">Login</button>
                    <a class="btn btn-primary textButton" id='signUP' href="signup.html" >Registrati</a>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-colors" >
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalToggleLabel2">Registrazione</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form class="row g-3 needs-validation" novalidate>
                        <div class="col-md-4">
                            <label for="signUpName" class="form-label">Nome</label>
                            <input type="text" class="form-control textInput" id="signUpName" value="Mark" required>

                        </div>
                        <div class="col-md-4">
                            <label for="signUpFN" class="form-label">Cognome</label>
                            <input type="text" class="form-control textInput" id="signUpFN" value="Otto" required>

                        </div>
                        <div class="col-md-4">
                            <label for="signUPUsername" class="form-label">Username</label>
                            <div class="input-group has-validation">
                                <input type="text" class="form-control textInput" id="signUPUsername" aria-describedby="inputGroupPrepend" required>

                            </div>
                        </div>
                        <div class="col-md-6">
                            <label for="signUpPsw" class="form-label">Password</label>
                            <input type="password" class="form-control textInput" id="signUpPsw" required>

                        </div>
                        <div class="col-md-6">
                            <label for="vsignUpPsw" class="form-label">Ripeti Password</label>
                            <input type="password" class="form-control textInput" id="vsignUpPsw" required>
                        </div>
                    </form>

                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary textButton" id="signUPButton" name="action" type="submit" >Registrati</button>
                    <button class="btn btn-primary textButton" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" >Torna al login</button>
                </div>
            </div>
        </div>
    </div>


    <br/>

    <div class="modal fade" id="confirmModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-colors" >
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmModalLabel">Conferma</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <span id="confirmText"></span>
                </div>
                <div class="modal-footer">
                    <button  class="btn btn-primary textButton" id="ConfirmButton" data-bs-dismiss="modal" name="action" type="submit">Conferma</button>
                    <button class="btn btn-primary textButton" data-bs-target="#confirmModal" data-bs-toggle="modal" >Annulla</button>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="errorModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-colors">
                <div class="modal-header">
                    <h5 class="modal-title" id="errorModalLabel">Errore</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <span id="errorText"></span>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary textButton" data-bs-target="#errorModal" data-bs-toggle="modal" >Ok</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="TeachingModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-colors" >
                <div class="modal-header">
                    <h5 class="modal-title" id="teachingModalLabel">Conferma</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul class="list-group">
                        <li class="list-li list-group-item ">
                            <select id="subjectTeachingDDL" class="form-select" aria-label="Default select example" style="color: whitesmoke;background-color:#2c2e2f ; width: 60%;display: block;margin: 0">

                            </select>
                            <select id="teacherTeachingDDL" class="form-select" aria-label="Default select example" style="color: whitesmoke;background-color:#2c2e2f ; width: 60%;display: block;margin: 0">

                            </select>
                            <button id="newTeaching" class="btn btn-outline-primary" style="border-color: rgb(93, 119, 114); color: whitesmoke;">
                                Inserisci
                            </button>
                        </li>
                    </ul>
                    <hr class="teachingHRline">
                    <ul class="list-group" id="teachingModalList">

                    </ul>
                </div>
            </div>
        </div>
    </div>
</main>



<script src="vuePage.js"></script>
</body>
</html>