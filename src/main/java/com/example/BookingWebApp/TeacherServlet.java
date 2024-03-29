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
import java.math.BigDecimal;

@WebServlet(name = "TeacherServlet", value = "/TeacherServlet")
public class TeacherServlet extends HttpServlet
{
    public static final String ERROR_NOPERMISSION = "Non hai i permessi per svolgere questa azione";
    public static final String ERROR_EMPTY_SURNAME= "Inserire cognome";
    public static final String ERROR_EMPTY_NAME= "Inserire nome";
    public static final String ERROR_ALREADY_EXISTS = "Il docente è già stato inserito";

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


        switch (operation)
        {
            case "getTeacherList":
                if (PermissionManager.checkAdmin(request))
                {
                    jsonResult = gson.toJson(DAO.getTeacherList());
                    System.out.println(jsonResult);
                }
                else
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_NOPERMISSION);
                    jsonResult = gson.toJson(err);
                }
                break;

            case "deleteTeacher":
                String teacherId = request.getParameter("Id");

                if (PermissionManager.checkAdmin(request))
                {
                    System.out.println(teacherId);
                    jsonResult = gson.toJson(DAO.deleteTeacher(teacherId));
                    System.out.println(jsonResult);
                }
                else
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_NOPERMISSION);
                    jsonResult = gson.toJson(err);
                }
                break;

            case "addTeacher": //aggiunge l'insegnante se non esiste o lo abilita se già esiste ed è disabilitato
                String teacherName = request.getParameter("name");
                String teacherSurname = request.getParameter("surname");

                if(teacherName == null || teacherName.equals(""))
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_EMPTY_NAME);
                    jsonResult = gson.toJson(err);
                    break;
                }

                if(teacherSurname == null || teacherSurname.equals(""))
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_EMPTY_SURNAME);
                    jsonResult = gson.toJson(err);
                    break;
                }

                if (PermissionManager.checkAdmin(request))
                {
                    Result<BigDecimal> ri = DAO.checkTeacher(teacherName, teacherSurname);
                    System.out.println("T: " + ri.data.size());

                    if (ri.data.size() == 0 || ri.data.get(0) == null) //l'insegnante non esiste
                    {
                        jsonResult = gson.toJson(DAO.addTeacher(teacherName, teacherSurname));
                        System.out.println(jsonResult);
                    }
                    else
                    {
                        switch (ri.data.get(0).intValue())
                        {
                            case 0: //l'insegnante esiste e non è disabilitato
                                Result<Object> err = new Result<>();
                                err.setError(ERROR_ALREADY_EXISTS);
                                jsonResult = gson.toJson(err);
                                break;

                            case 1: //l'insegnante esiste ed è disabilitato
                                jsonResult = gson.toJson(DAO.enableTeacher(teacherName, teacherSurname));
                                System.out.println(jsonResult);
                                break;
                        }
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
