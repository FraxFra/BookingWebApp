package com.example.BookingWebApp;

import java.io.*;
import java.util.Enumeration;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

import com.example.BookingWebApp.dao.DAO;
import com.example.BookingWebApp.dao.Result;
import com.example.BookingWebApp.dao.data.User;
import com.example.BookingWebApp.permissions.PermissionManager;
import com.google.gson.Gson;

@WebServlet(name = "pageServlet", value = "/PageServlet")
public class PageServlet extends HttpServlet
{
    public static final String ERROR_ALREADYLOGGED = "Sei già loggato nel sito";
    public static final String ERROR_WRONGLOGIN = "Username o password sbagliati";
    public static final String ERROR_NOLOGGED = "Non sei loggato";
    public static final String ERROR_ALREADYREGISTERED = "Questo username è già utilizzato. Se sei tu, puoi fare il login";


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

        Result<User> result;
        Result<Integer> tempResult;

        String operation = (String) request.getParameter("operation");

        String username;
        String password;
        Enumeration<String> e = request.getParameterNames();
        /*while(e.hasMoreElements())
        {
            System.out.println(e.nextElement());
        }*/
        switch (operation)
        {
            case "login":
                username = request.getParameter("Username");
                password = request.getParameter("Password");

                if (PermissionManager.checkBoth(request))
                {
                    result = new Result<>();
                    result.setError(ERROR_ALREADYLOGGED);
                }
                else
                {
                    result = DAO.login(username, password);
                    loginUser(result, request);
                }
                jsonResult = gson.toJson(result);
                out.println(jsonResult);
                break;

            case "signup":
                username = request.getParameter("Username");
                password = request.getParameter("Password");
                String name = request.getParameter("Name");
                String surname = request.getParameter("Surname");

                if (PermissionManager.checkBoth(request)) {
                    result = new Result<>();

                    result.setError(ERROR_ALREADYLOGGED);
                } else {
                    if (DAO.checkUser(username).data.get(0) == 0) {

                        tempResult = DAO.signup(username, password, name, surname);

                        if (tempResult.ok) {
                            result = DAO.login(username, password);

                            loginUser(result, request);
                        } else {
                            result = new Result<>();

                            result.setError("Errore generico", true);
                        }

                    }else {
                        result = new Result<User>();
                        result.add(new User(username,name,surname,false));

                        result.setError(ERROR_ALREADYREGISTERED, false);
                    }
                }
                jsonResult = gson.toJson(result);
                out.println(jsonResult);

                break;
            case "logout":
                if (PermissionManager.checkBoth(request)) {
                    logoutUser(request);
                    tempResult = new Result<>();
                }else{
                    tempResult = new Result<>();

                    tempResult.setError(ERROR_NOLOGGED);
                }
                jsonResult = gson.toJson(tempResult);
                out.println(jsonResult);
                break;
            case "testSession":
                Result<Integer> result1 = new Result<>();
                if (PermissionManager.checkBoth(request)){
                    result1.add(1);
                }else{
                    result1.add(-1);
                }

                jsonResult = gson.toJson(result1);
                out.println(jsonResult);

        }
    }

    private void loginUser(Result<User> result, HttpServletRequest request) {
        if (result.ok && result.data.size() == 1) {
            HttpSession session = request.getSession();

            session.setAttribute("username", result.data.get(0).Username);
            session.setAttribute("role", result.data.get(0).Role);
            session.setAttribute("name", result.data.get(0).Name);
            session.setAttribute("surname", result.data.get(0).Surname);

        } else {
            result.setError(ERROR_WRONGLOGIN, true);
        }
    }

    private void logoutUser(HttpServletRequest request){
        //HttpSession session = request.getSession();
        //session.invalidate();
    }

    public void destroy() {
    }
}
