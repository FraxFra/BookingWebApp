package com.example.BookingWebApp.dao.data;

import java.sql.Time;

public class Booking {
    public String BookingStatus;
    public String Teacher;
    public String Subject;
    public Time SlotStart;
    public Time SlotEnd;
    public String SlotDate;
    public int BookingId;
    public String UserId;

    public Booking(String bookingStatus, String teacher, String subject, Time slotStart, Time slotEnd, String slotDate, int bookingId, String userId) {
        BookingStatus = bookingStatus;
        Teacher = teacher;
        Subject = subject;
        SlotStart = slotStart;
        SlotEnd = slotEnd;
        SlotDate = slotDate;
        BookingId = bookingId;
        UserId  = userId;
    }
}

