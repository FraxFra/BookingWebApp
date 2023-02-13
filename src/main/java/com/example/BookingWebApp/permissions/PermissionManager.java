package com.example.BookingWebApp.permissions;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class PermissionManager {
    public static boolean checkPermission(HttpServletRequest req, boolean permissionLevel){
        try{
            HttpSession session = req.getSession();

            Boolean role = (Boolean)session.getAttribute("role");

            if (role == null)
                return false;

            return  role == permissionLevel;

        }catch (Exception e){
            return false;
        }
    }

    public static boolean checkCustomer(HttpServletRequest req){
        return checkPermission(req,false);
    }

    public static boolean checkAdmin(HttpServletRequest req){
        return checkPermission(req,true);
    }

    public static boolean checkBoth(HttpServletRequest req){
        return checkPermission(req,true) || checkPermission(req,false);
    }

    public static String getUser(HttpServletRequest req){
        HttpSession session = req.getSession();

        String userId = (String)session.getAttribute("username");

        return userId;
    }

}
