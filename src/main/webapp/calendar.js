// function createCalendar(data,isHome){
//
//     const calendar = $("#calendar");
//
//     const subjectsColors = associateColors(data);
//
//     const myModal = new bootstrap.Modal(document.getElementById('calendarModal'));
//
//     let i=1;
//
//     const days = [
//         "Lunedi",
//         "Martedi",
//         "Mercoledi",
//         "Giovedi",
//         "Venerdi"
//     ];
//
//     const hours = [
//         "dalle 15 alle 16",
//         "dalle 16 alle 17",
//         "dalle 17 alle 18",
//         "dalle 18 alle 19",
//     ];
//
//     while(i!=21){
//         let slot = $("#slot-"+i,calendar);
//         const slotNr = i;
//
//         let slot_subjects = getSubjects(data,i);
//
//         if (slot_subjects.length > 0) {
//             let accessibility_badge = document.createElement("div");
//             accessibility_badge.className = "screenreader";
//             accessibility_badge.innerText = days[parseInt((i-1) / 4)] + ' ' + hours[(i - 1) % 4];
//             slot.append(accessibility_badge);
//         }
//
//         for(let subject of slot_subjects) {
//             let badge = document.createElement("div");
//             badge.style.backgroundColor = subjectsColors[subject];
//             // badge.style.cursor = "pointer";
//             badge.innerText = subject;
//             badge.className = "badge";
//             badge.onclick = function(){
//                 let cells = getTeacherList(data,slotNr,subject);
//                 console.log(isHome);
//
//                 $("#calendarModalTitle").text(subject + " il " + cells[0].WeekDate + " dalle " + getHours(cells[0].StartTime) + " alle " + getHours(cells[0].EndTime));
//
//                 $("#calendarModalList").empty();
//
//                 for (let cell of cells){
//                     let li = document.createElement("li");
//                     li.className = "list-group-item calendar-li";
//                     li.innerText = cell.TeacherName + " " + cell.TeacherSurname;
//
//                     let div=document.createElement("div");
//                     console.log(isHome);
//                     if(isHome) {
//                         let a = document.createElement("a");
//                         a.className = "btn btn-outline-primary";
//                         a.href = "#";
//                         a.innerText = "Prenota";
//                         // a.style.background = "#fc4a1a";
//                         // a.style.background = "-webkit-linear-gradient(to right, #f7b733, #fc4a1a)";
//                         // a.style.background = "linear-gradient(to right, #f7b733, #fc4a1a)";
//                         // a.style.color = "#fff";
//                         // a.style.border = "1px solid #eee";
//                         // a.style.borderRadius = "10px";
//
//                         a.setAttribute("v-if", "shared.page='home'")
//                         a.onclick = function () {
//                             $.ajax({
//                                 url: "SlotServlet",
//                                 data: {
//                                     operation: "newBooking",
//                                     SlotId: slotNr,
//                                     SubjectName: subject,
//                                     TeacherId: cell.TeacherId
//                                 },
//                                 method: "POST",
//                                 success: function (result) {
//                                     if (result.ok) {
//                                         myModal.toggle();
//                                         openError("Prenotato!",true);
//                                         refreshCalendar(isHome);
//                                     } else {
//                                         openError("Errore: " + result.error);
//                                     }
//                                 }
//                             });
//                         };
//                         div.appendChild(a);
//                     }else {
//
//                         let a = document.createElement("a");
//                         a.className = "btn btn-outline-primary";
//                         a.href = "#";
//                         a.innerText = "Disdici";
//                         a.style.borderColor = "#5D7772";
//                         a.style.color = "whitesmoke";
//                         a.style.marginRight="5px";
//                         a.onclick = function () {
//                             $.ajax({
//                                 url: "SlotServlet",
//                                 data: {
//                                     operation: "ownCancellation",
//                                     BookingId: cell.BookingId
//                                 },
//                                 method: "POST",
//                                 success: function (result) {
//                                     if (result.ok) {
//                                         myModal.toggle();
//                                         openError("Disdetta!", true);
//                                         refreshCalendar(isHome);
//                                     } else {
//                                         openError("Errore: " + result.error);
//                                     }
//                                 }
//                             });
//                         };
//                         div.appendChild(a);
//                         a = document.createElement("a");
//                         a.className = "btn btn-outline-primary";
//                         a.href = "#";
//                         a.innerText = "Completa";
//                         a.style.borderColor = "#5D7772";
//                         a.style.color = "whitesmoke";
//                         a.onclick = function () {
//                             $.ajax({
//                                 url: "SlotServlet",
//                                 data: {
//                                     operation: "ownCompletion",
//                                     BookingId: cell.BookingId
//                                 },
//                                 method: "POST",
//                                 success: function (result) {
//                                     if (result.ok) {
//                                         myModal.toggle();
//                                         openError("Completata!", true);
//                                         refreshCalendar(isHome);
//                                     } else {
//                                         openError("Errore: " + result.error);
//                                     }
//                                 }
//                             });
//                         };
//                         div.appendChild(a);
//                     }
//                     li.appendChild(div);
//                     $("#calendarModalList").append(li);
//                 }
//                 myModal.show();
//             };
//             slot.append(badge);
//             //slot.append("<div class='badge' style='background-color:"+ subjectsColors[subject] + "'>" + subject + "</div>" );
//         }
//         i++;
//     }
// }
//
// function refreshCalendarSlots(data,isHome){
//     $("#calendar td:not(:first-child)").empty();
//     createCalendar(data,isHome);
// }
//
// function associateColors(data){
//     var subjectsColors = [];
//     var subjects = getSubjects(data,null);
//
//     let i = 0;
//     for (let subject of subjects){
//         subjectsColors[subject] = colors[i % colors.length];
//         i++;
//     }
//     return subjectsColors;
// }
//
// function getSubjects(data,i){
//     var subjects = [];
//
//     for(let slot of data){
//         if(slot.SlotId === i || i == null){
//             let found = false;
//             for(let subject of subjects){
//                 if (subject === slot.SubjectName){
//                     found = true;
//                     break;
//                 }
//             }
//
//             if(!found){
//                 subjects.push(slot.SubjectName);
//             }
//         }
//     }
//
//     return subjects;
// }
//
// function getTeacherList(data,slot,subject){
//     return data.filter((cell)=>cell.SlotId == slot && cell.SubjectName == subject);
// }
//
// /*const colors = [
//     "#44988b",
//     "#e2bb63",
//     "#e56841",
//     "#7174c1",
//     "aqua",
//     "brown",
//     "cornflowerblue"
// ]*/
// const colors = [
//     // "#198754",
//     // "#0d6efd",
//     // "#dc3545",
//     // "#7174c1",
//     // "teal",
//     // "brown",
//     // "cornflowerblue"
//     // "#fef8ee",
//     "#feeed6",
    // "#fbd9ad",
    // "#f8be79",
    // "#f59e4d",
    // "#f17b1e",
    // "#e26114",
    // "#bc4912",
    // "#953a17",
    // "#783216"
// ];
//
// function getHours(dateString){
//     return parseInt(dateString.substr(0,2))+ 12;
// }