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

@WebServlet(name = "SubjectsServlet", value = "/SubjectsServlet")
public class SubjectsServlet extends HttpServlet
{
    public static final String ERROR_NOPERMISSION = "Non hai i permessi per svolgere questa azione";
    public static final String ERROR_EMPTY_NAME= "Inserire nome";
    public static final String ERROR_ALREADY_EXISTS = "La materia è già stata inserita";

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
            case "getSubjectsList":
                if (PermissionManager.checkAdmin(request))
                {
                    jsonResult = gson.toJson(DAO.getSubjectsList());
                    System.out.println(jsonResult);
                }
                else
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_NOPERMISSION);
                    jsonResult = gson.toJson(err);
                }
                break;

            case "deleteSubject":
                String subjectId = request.getParameter("Name");
                if (PermissionManager.checkAdmin(request))
                {
                    System.out.println(subjectId);
                    jsonResult = gson.toJson(DAO.deleteSubject(subjectId));
                    System.out.println(jsonResult);
                }
                else
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_NOPERMISSION);
                    jsonResult = gson.toJson(err);
                }
                break;

            case "addSubject":
                String subjectName = request.getParameter("name");

                if(subjectName == null || subjectName.equals(""))
                {
                    Result<Object> err = new Result<>();
                    err.setError(ERROR_EMPTY_NAME);
                    jsonResult = gson.toJson(err);
                    break;
                }

                if (PermissionManager.checkAdmin(request))
                {

                    Result<BigDecimal> ri = DAO.checkSubject(subjectName);

                    if (ri.data.size() == 0 || ri.data.get(0) == null) //la materia non esite nel DB
                    {
                        jsonResult = gson.toJson(DAO.addSubject(subjectName));
                        System.out.println(jsonResult);
                    }
                    else //la materia esiste
                    {
                        System.out.println(ri.data.get(0));

                        switch (ri.data.get(0).intValue())
                        {
                            case 0: //la materia esiste ed è abilitata
                                Result<Object> err = new Result<>();
                                err.setError(ERROR_ALREADY_EXISTS);
                                jsonResult = gson.toJson(err);
                                break;

                            case 1: //la materia esiste ed è disabilitata
                                jsonResult = gson.toJson(DAO.enableSubject(subjectName));
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



