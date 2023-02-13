<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no,maximum-scale=1.0,user-scalable=no">
    <link href="bootstrap-5.1.3-dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link href="page.css" rel="stylesheet">
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


<!--<div class="container-fluid" id="navbar-container">-->
<nav class="navbar navbar-expand-sm navbar-dark" style="background-color: #43616f" id="navbar">
    <div class="container-fluid">
        <div style="overflow: hidden">
            <a class="navbar-brand" href="#"    style="float: left; margin-left:5px;cursor: initial ">
                <img src="icon.svg"  width="30" height="30" alt="" />
            </a>

            <!--  <div class="collapse navbar-collapse" id="navbarScroll">
                  <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px; margin: 8px;">
                      <li class="nav-item" style="margin-right: 5px">
                          <a class="nav-link active" aria-current="page" href="#" v-on:click="refreshPage('home')">Home</a>
                      </li>
                      <li class="nav-item" style="margin-right: 5px">
                          <a v-if="isLogged" class="nav-link active" aria-current="page" href="#" v-on:click="refreshPage('myCalendar')">Il mio calendario</a>
                      </li>
                  </ul>
                  <div>

                  </div>

              </div>-->
            <aside   style=" float:left;background-color: #43616f" class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" >

                <div class="offcanvas-header">
                    <div></div>
                    <button  type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="navbar-nav justify-content-start flex-grow-1 pe-3">
                        <li class="nav-item" style="margin-right: 5px">
                            <a class="nav-link active" aria-current="page" href="#" v-on:click="refreshPage('home')">Home</a>
                        </li>
                        <li class="nav-item" style="margin-right: 5px">
                            <a v-if="isLogged" class="nav-link active" aria-current="page" href="#" v-on:click="refreshPage('myCalendar')">Il mio calendario</a>
                        </li>
                        <li>
                            <a v-if="isLogged" class="nav-link active" aria-current="page" href="#" v-on:click="refreshPage('bookingList')">Lista prenotazioni</a>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
        <div style="margin-right: 8px">
            <a v-if="!isLogged" class="btn btn-primary" data-bs-toggle="modal" href="#exampleModalToggle" role="button" style="border-color:#5D7772;background-color: #B6E2D3;color: black">Accedi/Registrati</a>
            <a v-if="isLogged" class="btn disabled"  role="button" id="userInfo" style="border-color:#5D7772 ;background-color: #B6E2D3;color: black"><i class="bi bi-person-circle"></i>&nbsp;{{username}} </a>
            <a v-if="isLogged" class="btn btn-primary"  role="button" id="btnLogout" style="border-color:#5D7772 ;background-color: #B6E2D3;color: black">Logout</a>

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
<!--</div>-->
<div class="pageContent row g-0" id="pageContainer">
    <div class="pageContent row g-0" id="pageList" style="display: none">
        <div class="col-lg-3">
            <select v-on:change="filterChange" id="subjectDDLList" class="form-select" aria-label="Default select example" style="color: whitesmoke;background-color:#2c2e2f ; width: 90%;display: block;margin: 0 auto">
            </select>
            <br>
            <select v-on:change="filterChange" id="teacherDDLList" class="form-select" aria-label="Default select example"
                    style="color: whitesmoke;background-color:#2c2e2f ;width: 90%;display: block;margin: 0 auto">

            </select>
            <br>
            <select v-on:change="filterChange" v-if="isAdmin" id="userDDLList" class="form-select" aria-label="Default select example" style="color: whitesmoke;background-color:#2c2e2f ; width: 90%;display: block;margin: 0 auto">

            </select>
        </div>
        <div class="col-lg-9">
            <table class="table table-dark table-striped" id ="tabList">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Giorno</th>
                    <th>Ora</th>
                    <th>Materia</th>
                    <th>Insegnante</th>
                    <th v-if="isAdmin">Utente</th>
                    <th>Stato</th>
                    <th></th>
                </tr>
                </thead>
                <tbody id = "tabListBody">

                </tbody>
            </table>
        </div>
    </div>



    <div class="pageContent row g-0" id="pageCalendar">
        <div class="col-lg-3">
            <select v-on:change="filterChange" id="subjectDDL" class="form-select" aria-label="Default select example" style="color: whitesmoke;background-color:#2c2e2f ; width: 90%;display: block;margin: 0 auto">

            </select>
            <br>
            <select v-on:change="filterChange" id="teacherDDL" class="form-select" aria-label="Default select example"
                    style="color: whitesmoke;background-color:#2c2e2f ;width: 90%;display: block;margin: 0 auto">

            </select>
        </div>
        <div class="col-lg-9">
            <table id="calendar" class="table">
                <tr style="border: none">
                    <th></th>
                    <th>
                        <span class="pc">LUNED&Igrave;</span>
                        <span class="mobile">LUN</span>
                    </th>
                    <th>
                        <span class="pc">MARTED&Igrave;</span>
                        <span class="mobile">MAR</span>
                    </th>
                    <th>
                        <span class="pc">MERCOLED&Igrave;</span>
                        <span class="mobile">MER</span>
                    </th>
                    <th>
                        <span class="pc">GIOVED&Igrave;</span>
                        <span class="mobile">GIO</span>
                    </th>
                    <th>
                        <span class="pc">VENERD&Igrave;</span>
                        <span class="mobile">VEN</span>
                    </th>
                </tr>
                <tr>
                    <td class="hour">15:00 - 16:00</td>
                    <td id="slot-1"></td>
                    <td id="slot-5"></td>
                    <td id="slot-9"></td>
                    <td id="slot-13"></td>
                    <td id="slot-17"></td>
                </tr>
                <tr>
                    <td class="hour">16:00 - 17:00</td>
                    <td id="slot-2"></td>
                    <td id="slot-6"></td>
                    <td id="slot-10"></td>
                    <td id="slot-14"></td>
                    <td id="slot-18"></td>
                </tr>
                <tr>
                    <td class="hour">17:00 - 18:00</td>
                    <td id="slot-3"></td>
                    <td id="slot-7"></td>
                    <td id="slot-11"></td>
                    <td id="slot-15"></td>
                    <td id="slot-19"></td>
                </tr>
                <tr>
                    <td class="hour">18:00 - 19:00</td>
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
        <div class="modal-content" style="background-color: #2c2e2f; color: whitesmoke">
            <div class="modal-header">
                <h5 class="modal-title" id="calendarModalTitle">Accedi</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <ul class="list-group" id="calendarModalList"></ul>

            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>


<div  class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
    <div  class="modal-dialog ">
        <div class="modal-content" style="background-color: #2c2e2f; color: whitesmoke">
            <div class="modal-header" >
                <h5   class="modal-title" id="exampleModalToggleLabel">Accedi</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3 row">
                    <label for="loginUsername" class="col-sm-2 col-form-label">Username</label>
                    <div class="col-sm-10">
                        <input type="text"  style="color: black; background-color:grey;" id="loginUsername" class="form-control"  >
                    </div>
                </div>
                <div class="mb-3 row">
                    <label for="loginPassword"  class="col-sm-2 col-form-label">Password</label>
                    <div class="col-sm-10">
                        <input type="password" style="color: black; background-color:grey" class="form-control" id="loginPassword">
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" id='loginButton' name="Login" type="submit" style="border-color:#5D7772;background-color: #B6E2D3;color: black">Login</button>
                <button class="btn btn-primary" id='signUP' data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" style="border-color:#5D7772;background-color: #B6E2D3;color: black">Registrati</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background-color: #2c2e2f; color: whitesmoke">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalToggleLabel2">Registrazione</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="row g-3 needs-validation" novalidate>
                    <div class="col-md-4">
                        <label for="signUpName" class="form-label">Nome</label>
                        <input style="color: black; background-color:grey" type="text" class="form-control" id="signUpName" value="Mark" required>

                    </div>
                    <div class="col-md-4">
                        <label for="signUpFN" class="form-label">Cognome</label>
                        <input style="color: black; background-color:grey" type="text" class="form-control" id="signUpFN" value="Otto" required>

                    </div>
                    <div class="col-md-4">
                        <label for="signUPUsername" class="form-label">Username</label>
                        <div class="input-group has-validation">
                            <input style="color: black; background-color:grey" type="text" class="form-control" id="signUPUsername" aria-describedby="inputGroupPrepend" required>

                        </div>
                    </div>
                    <div class="col-md-6">
                        <label for="signUpPsw" class="form-label">Password</label>
                        <input style="color: black; background-color:grey" type="password" class="form-control" id="signUpPsw" required>

                    </div>
                    <div class="col-md-6">
                        <label for="vsignUpPsw" class="form-label">Ripeti Password</label>
                        <input style="color: black; background-color:grey" type="password" class="form-control" id="vsignUpPsw" required>
                    </div>
                </form>

            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" id="signUPButton" name="action" type="submit" style="background-color: #B6E2D3;color: black">Registrati</button>
                <button class="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" style="background-color: #B6E2D3;color: black">Torna al login</button>
            </div>
        </div>
    </div>
</div>


<br/>





<form action="SlotServlet" method="get" style="display: none">
    <input type="text" name="operation" value="availableBookings"/>
    <p><input type="submit" name="submit" value="click me"/> </p>
</form>

<form action="SlotServlet" method="get" style="display: none">
    <input type="text" name="operation" value="availableBookings"/>
    <p><input type="submit" name="submit" value="click me"/> </p>
</form>




<script src="vuePage.js"></script>
</body>
</html>