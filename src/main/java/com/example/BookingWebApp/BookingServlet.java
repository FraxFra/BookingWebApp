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

@WebServlet(name = "BookingServlet", value = "/BookingServlet")
public class BookingServlet extends HttpServlet
{
    public static final String ERROR_NOPERMISSION = "Non hai i permessi per svolgere questa azione";

    public void init()
    {
        DAO.registerDriver();
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        response.setContentType("text/json;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");

        Gson gson = new Gson();
        PrintWriter out = response.getWriter();
        String jsonResult = "";

        String operation = request.getParameter("operation");

        String subjectName;
        String teacherId ;
        String userId;

        switch(operation)
        {
            case "bookingList": //carica la lista delle ripetizioni appartenente all'utente memorizzato nella sessione
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

                if (PermissionManager.checkCustomer(request))
                {
                    userId = PermissionManager.getUser(request);
                    System.out.println(userId);
                    jsonResult = gson.toJson(DAO.getBookingList(subjectName,teacherId,userId));

                }
                else if(PermissionManager.checkAdmin(request))
                {
                    userId = request.getParameter("UserId");
                    if(userId == null)
                    {
                        userId = "";
                    }

                    jsonResult = gson.toJson(DAO.getBookingList(subjectName,teacherId,userId));
                }
                else
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_NOPERMISSION);
                    jsonResult = gson.toJson(err);

                }
                break;

            case "userDDLList": //carica tutti gli utenti
                jsonResult = gson.toJson(DAO.getUsers());
                break;

        }
        System.out.println(jsonResult);
        out.println(jsonResult);
    }

}
