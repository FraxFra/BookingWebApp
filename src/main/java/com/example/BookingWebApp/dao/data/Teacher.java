package com.example.BookingWebApp.dao.data;

public class Teacher {
    public String Surname;
    public String Name;
    public int Id;

    public Teacher(int id, String name, String surname) {
        Id=id;
        Name = name;
        Surname = surname;
    }
}
