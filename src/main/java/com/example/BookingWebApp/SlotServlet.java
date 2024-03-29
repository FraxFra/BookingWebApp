package com.example.BookingWebApp;

import com.example.BookingWebApp.dao.DAO;
import com.example.BookingWebApp.dao.Result;
import com.example.BookingWebApp.permissions.PermissionManager;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "SlotServlet", value = "/SlotServlet")
public class SlotServlet extends HttpServlet
{
    public static final String ERROR_NOPERMISSION = "Non hai i permessi per svolgere questa azione";
    public static final String ERROR_NOBOOKING = "Impossibile trovare la prenotazione specificata";
    public static final String ERROR_ALREADYBOOKED = "È già stata prenotata una ripetizione in questo orario";

    public void init()
    {
        DAO.registerDriver();
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        response.setContentType("text/json;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF8");
        response.setContentType("application/json");
        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        String jsonResult = "";

        String operation = request.getParameter("operation");

        String subjectName;
        String teacherId ;
        String bookingId;

        switch (operation)
        {
            case "availableBookings": //carica tutte le prenotazioni disponibili
                subjectName = request.getParameter("SubjectName");
                teacherId = request.getParameter("TeacherId");

                if(subjectName == null)
                {
                    subjectName = "";
                }
                if(teacherId == null)
                {
                    teacherId = "";
                }

                System.out.println(subjectName);
                System.out.println(teacherId);
                jsonResult = gson.toJson(DAO.getBookings());
                System.out.println(jsonResult);
                break;

            case "newBooking": //prenota la ripetizione (se non già prenotata dallo stesso utente)
                if (PermissionManager.checkBoth(request))
                {
                    String SlotId = request.getParameter("SlotId");
                    String UserId = PermissionManager.getUser(request);

                    subjectName = request.getParameter("SubjectName");
                    teacherId = request.getParameter("TeacherId");

                    if (DAO.checkSlot(UserId, SlotId).data.get(0) == 0)
                    {
                        jsonResult = gson.toJson(DAO.newBooking(SlotId,UserId,subjectName,teacherId));
                    }
                    else
                    {
                        Result<Object> err = new Result<>();
                        err.setError(ERROR_ALREADYBOOKED);
                        jsonResult = gson.toJson(err);
                    }

                }
                else
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_NOPERMISSION);
                    jsonResult = gson.toJson(err);
                }
                break;

            case "teacherDDL":
                jsonResult = gson.toJson(DAO.getTeacherDDL());
                break;

            case "subjectDDL":
                jsonResult = gson.toJson(DAO.getSubjectDDL());
                break;

            case "ownCalendar":
                subjectName = request.getParameter("SubjectName");
                teacherId = request.getParameter("TeacherId");

                if(subjectName == null)
                {
                    subjectName = "";
                }
                if(teacherId == null)
                {
                    teacherId = "";
                }

                jsonResult = gson.toJson(DAO.getOwnBookings(PermissionManager.getUser(request),subjectName,teacherId));
                break;

            case "ownCancellation":
                bookingId = request.getParameter("BookingId");

                if (PermissionManager.checkBoth(request))
                {
                    Result<Long> resNum = DAO.checkBooking(PermissionManager.getUser(request), bookingId);

                    if (resNum.data.size() != 1 || resNum.data.get(0) != 1 )
                    {
                        Result<Object> err = new Result<>();
                        err.setError(ERROR_NOBOOKING);
                        jsonResult = gson.toJson(err);
                    }
                    else
                    {
                        jsonResult = gson.toJson(DAO.cancelBooking(bookingId));
                    }
                }
                else
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_NOPERMISSION);
                    jsonResult = gson.toJson(err);
                }
                break;

            case "ownCompletion":
                bookingId = request.getParameter("BookingId");

                if (PermissionManager.checkCustomer(request))
                {
                    Result<Long> resNum = DAO.checkBooking(PermissionManager.getUser(request), bookingId);

                    if (resNum.data.size() != 1 || resNum.data.get(0) != 1 )
                    {
                        Result<Object> err = new Result<>();
                        err.setError(ERROR_NOBOOKING);
                        jsonResult = gson.toJson(err);
                    }
                    else
                    {
                        jsonResult = gson.toJson(DAO.completeBooking(bookingId));
                    }
                }
                else
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_NOPERMISSION);
                    jsonResult = gson.toJson(err);
                }
                break;
        }
        out.println(jsonResult);
    }

    public void destroy()
    {

    }
}
