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

@WebServlet(name = "TeachingServlet", value = "/TeachingServlet")
public class TeachingServlet extends HttpServlet
{
    public static final String ERROR_NOPERMISSION = "Non hai i permessi per svolgere questa azione";
    public static final String ERROR_EMPTY_SUBJECT= "Inserire corso";
    public static final String ERROR_EMPTY_TEACHER= "Inserire docente";
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
            case "getTeachingList":
                if (PermissionManager.checkAdmin(request))
                {
                    String teachingTeacherT = request.getParameter("teacher");
                    String teachingSubject = request.getParameter("subject");

                    if(teachingTeacherT == null || teachingTeacherT.equals(""))
                    {
                        teachingTeacherT = "";
                    }
                    if(teachingSubject == null || teachingSubject.equals(""))
                    {
                        teachingSubject = "";
                    }

                    jsonResult = gson.toJson(DAO.getTeachingList(teachingTeacherT,teachingSubject));
                    System.out.println(jsonResult);

                }
                else
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_NOPERMISSION);
                    jsonResult = gson.toJson(err);
                }
                break;

            case "deleteTeaching":
                String teachingId = request.getParameter("Id");
                if (PermissionManager.checkAdmin(request))
                {
                    System.out.println(teachingId);
                    jsonResult = gson.toJson(DAO.deleteTeaching(Integer.parseInt(teachingId)));
                    System.out.println(jsonResult);
                }
                else
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_NOPERMISSION);
                    jsonResult = gson.toJson(err);
                }
                break;

            case "addTeaching":
                String teachingTeacherT=request.getParameter("teacher");
                String teachingSubject=request.getParameter("subject");

                if(teachingTeacherT == null || teachingTeacherT.equals(""))
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_EMPTY_TEACHER);
                    jsonResult = gson.toJson(err);
                    break;
                }

                if(teachingSubject == null || teachingSubject.equals(""))
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_EMPTY_SUBJECT);
                    jsonResult = gson.toJson(err);
                    break;
                }

                if (PermissionManager.checkAdmin(request))
                {
                    int teachingTeacher= Integer.parseInt(teachingTeacherT);
                    Result<BigDecimal> ri = DAO.checkTeaching(teachingTeacher, teachingSubject);
                    System.out.println("T: " + ri.data.size());

                    if (ri.data.size() == 0 || ri.data.get(0) == null) //l'insegnamento non esiste
                    {
                        jsonResult = gson.toJson(DAO.addTeachings(teachingTeacherT, teachingSubject));
                        System.out.println(jsonResult);
                    }
                    else
                    {

                        switch (ri.data.get(0).intValue())
                        {
                            case 0: //l'insegnamento esiste ed è abilitato
                                Result<Object> err = new Result<>();
                                err.setError(ERROR_ALREADY_EXISTS);
                                jsonResult = gson.toJson(err);
                                break;

                            case 1: //l'insegnamento esiste ed è disabilitato
                                jsonResult = gson.toJson(DAO.enableTeaching(teachingTeacher, teachingSubject));
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


