package com.example.BookingWebApp.dao;

public class Query {
    public static final String getAvailableBookings = "SELECT *\n" +
            "  FROM AvailableBooking\n" +
            " WHERE (SubjectName = ? or ? ='')\n" +
            "   AND (TeacherId = ? or ? ='')";

    public static final String newBooking = "INSERT INTO Booking(SlotId,TeachingId,UserId,BookingStatus)\n" +
            "SELECT ?,\n" +
            "       T.Id,\n" +
            "       ?,\n" +
            "       'Booked'\n" +
            "FROM Teaching T\n" +
            "WHERE T.TeacherId = ?\n" +
            "  AND T.SubjectId = ? ;";

    public static final String checkSlot = "SELECT count(*) as num" +
            " FROM Booking B " +
            "WHERE B.SlotId = ?" +
            "  AND B.UserId = ?" +
            "  AND B.BookingStatus = 'Booked'";


    public static final String login = "SELECT Username,\n" +
            "       Name,\n" +
            "       Surname,\n" +
            "       Role\n" +
            "  FROM Users\n" +
            " WHERE Username = ?\n" +
            "     AND Password = PASSWORD(?);";
    public static final String signup = "INSERT INTO Users(Username,Password,Name,Surname,Role)\n" +
            "SELECT ?,\n" +
            "       PASSWORD(?),\n" +
            "       ?,\n" +
            "       ?,\n" +
            "       FALSE;";

    public static final String checkUser = "SELECT count(*) AS num \n" +
            "              FROM Users U\n " +
            "             WHERE U.Username = ?;";

    public static final String getTeacher = "SELECT Id as Value,\n" +
            "       CONCAT(Name,' ',Surname) as Description\n" +
            "  FROM Teacher\n" +
            " WHERE Disabled = false;";
    public static final String getSubject = "SELECT Name as Value,\n" +
            "       Name as Description\n" +
            "  FROM Subject" +
            " WHERE Disabled = false;";

    public static final String getOwnBookings = "SELECT D.Name  AS TeacherName,\n" +
            "       D.Surname AS TeacherSurname,\n" +
            "       S.Name AS SubjectName,\n" +
            "       T.StartTime AS StartTime,\n" +
            "       T.EndTime AS EndTime,\n" +
            "       CASE WHEN T.WeekDate = 0 THEN 'Lunedì'\n" +
            "            WHEN T.WeekDate = 1 THEN 'Martedì'\n" +
            "            WHEN T.WeekDate = 2 THEN 'Mercoledì'\n" +
            "            WHEN T.WeekDate = 3 THEN 'Giovedì'\n" +
            "            WHEN T.WeekDate = 4 THEN 'Venerdì'\n" +
            "            ELSE 'Errore'\n" +
            "           END AS WeekDate,\n" +
            "       D.Id AS TeacherId,\n" +
            "       T.Id AS SlotId,\n" +
            "       B.Id                         AS BookingId,\n" +
            "       B.UserId              \n"+
            "  FROM Slot T\n" +
            " CROSS JOIN Teaching M\n" +
            "       JOIN Teacher D ON M.TeacherId = D.Id\n" +
            "       JOIN Subject S ON M.SubjectId = S.Name\n" +
            "       JOIN Booking B ON B.SlotId = T.Id\n" +
            "                     AND B.TeachingId = M.Id\n" +
            "  WHERE (B.UserId = ? or EXISTS(SELECT * FROM Users WHERE Username = ? AND Role = true))\n" +
            "    AND B.BookingStatus = 'Booked'\n" +
            "    AND M.Disabled = false\n" +
            "    AND D.Disabled = false\n" +
            "    AND (S.Name= ? or ?='')\n" +
            "    AND (D.Id= ? or ?='');";

    public static final String checkBooking = "SELECT count(*) AS num\n" +
            "  FROM Booking B\n" +
            " WHERE (B.UserId = ? or EXISTS(SELECT * FROM Users WHERE Username = ? AND Role = true))\n" +
            "   AND B.Id = ?;";
    public static final String cancelBooking = "UPDATE Booking\n" +
            "SET BookingStatus = 'Canceled'\n" +
            "WHERE Id = ?";
    public static final String completeBooking = "UPDATE Booking\n" +
            "SET BookingStatus = 'Done'\n" +
            "WHERE Id = ?";
    public static final String getBookingList = "SELECT CASE WHEN B.BookingStatus = 'Booked' THEN 'Attiva'\n" +
            "            WHEN B.BookingStatus = 'Done' THEN 'Effettuata'\n" +
            "            WHEN B.BookingStatus = 'Canceled' THEN 'Disdetta'\n" +
            "            ELSE '' END AS BookingStatus,\n" +
            "       CONCAT(T.Name,' ',T.Surname) AS Teacher,\n" +
            "       G.SubjectId    AS Subject,\n" +
            "       S.StartTime AS SlotStart,\n" +
            "       S.EndTime AS SlotEnd,\n" +
            "       CASE WHEN S.WeekDate = 0 THEN 'Lunedì'\n" +
            "            WHEN S.WeekDate = 1 THEN 'Martedì'\n" +
            "            WHEN S.WeekDate = 2 THEN 'Mercoledì'\n" +
            "            WHEN S.WeekDate = 3 THEN 'Giovedì'\n" +
            "            WHEN S.WeekDate = 4 THEN 'Venerdì'\n" +
            "            ELSE 'Errore'\n" +
            "           END AS WeekDate,\n" +
            "       B.Id AS BookingId,\n" +
            "       B.UserId AS UserId\n" +
            "FROM Booking B\n" +
            "         JOIN Teaching G ON B.TeachingId = G.Id\n" +
            "         JOIN Teacher T ON G.TeacherId = T.Id\n" +
            "         JOIN Slot S ON B.SlotId = S.Id\n" +
            "WHERE (B.UserId = ? or ? ='')\n" +
            "  AND (T.Id = ? or ? ='')\n" +
            "  AND (G.SubjectId = ? or ? ='')\n" +
            "ORDER BY CASE WHEN B.BookingStatus = 'Booked' THEN 0\n" +
            "              ELSE 1 END asc";

    public static final String getUser = "SELECT Username as Value,\n" +
            "       Username as Description\n" +
            "  FROM users;";

    public static final String getTeacherList = "SELECT id, Name, Surname FROM teacher WHERE Disabled = false;";
    public static final String deleteTeacher= "Update Teacher set Disabled= 1 WHERE id= ? ";
    public static final String addTeacher = "Insert into Teacher (Name,Surname)values(?,?)";
    public static final String checkTeacher = "SELECT sum(Disabled) as num FROM Teacher WHERE Name = ? and Surname = ?; ";
    public static final String enableTeacher = "UPDATE Teacher set Disabled = 0 WHERE Name = ? and Surname = ?";

    public static final String addSubject = "Insert into Subject(Name)values(?)";
    public static final String deleteSubject= "Update Subject set Disabled=1 WHERE Name= ? ";
    public static final String checkSubject = "SELECT sum(Disabled) as num FROM `Subject` WHERE Name = ? ";
    public static final String enableSubject = "Update Subject set Disabled=0 WHERE Name= ? ";

    public static final String getTeachings= "SELECT SubjectId, t.Id, concat(a.Name,' ',a.Surname)as TeacherName, a.Id as TeacherId  \n" +
            "from teaching t \n" +
            "join teacher a on t.TeacherId = a.Id \n" +
            "join subject s on t.SubjectId = s.Name\n" +
            "WHERE t.Disabled = 0 and a.Disabled=0 and s.Disabled=0 and (s.Name= ? or ?='') and (a.Id= ? or ?='');  ";
    public static final String addTeachings= "Insert into Teaching(TeacherId,SubjectId)values(?,?);";
    public static final String deleteTeachings= "Update Teaching set Disabled= 1 WHERE id= ?";
    public static final String enableTeaching= "Update Teaching set Disabled=0 where TeacherId=? and SubjectId=?;";
    public static final String checkTeaching="SELECT sum(Disabled) as num FROM `Teaching` WHERE  TeacherId=? and SubjectId=?";
}

