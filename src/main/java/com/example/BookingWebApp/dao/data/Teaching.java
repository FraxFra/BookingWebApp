package com.example.BookingWebApp.dao.data;

public class Teaching
{
    public String teacherName;
    public String subjectName;
    public int TeacherId;
    public int Id;

    public Teaching(int id, String teacherName, String subjectName, int teacherId)
    {
        this.Id = id;
        this.teacherName = teacherName;
        this.subjectName = subjectName;
        this.TeacherId = teacherId;
    }
}