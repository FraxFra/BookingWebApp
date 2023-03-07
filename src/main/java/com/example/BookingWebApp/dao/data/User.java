package com.example.BookingWebApp.dao.data;

public class User
{
    public String Username;
    public String Name;
    public String Surname;
    public boolean Role;

    public User(String username, String name, String surname, boolean role)
    {
        Username = username;
        Name = name;
        Surname = surname;
        Role = role;
    }
}
