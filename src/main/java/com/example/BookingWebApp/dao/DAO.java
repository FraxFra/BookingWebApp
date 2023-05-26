package com.example.BookingWebApp.dao;

import com.example.BookingWebApp.dao.data.*;

import java.math.BigDecimal;
import java.sql.*;
import java.util.Arrays;

import com.mysql.jdbc.Driver;

public class DAO {

    private static final String url1 = "jdbc:mysql://localhost:3306/iumdb?useUnicode=yes&characterEncoding=UTF-8";
    private static final String user = "root";
    private static final String password = "";

    public static void registerDriver()
    {
        try
        {
            DriverManager.registerDriver(new Driver());
            System.out.println("Driver correttamente registrato");
        } catch (SQLException e)
        {
            System.out.println("Errore: " + e.getMessage());
        }
    }

    private static Connection getConnection() throws SQLException //stabilisce la connessione
    {
        return DriverManager.getConnection(url1, user, password);
    }

    private static PreparedStatement getPreparedStatement(Connection conn, String query, Object[] params) throws SQLException //prepara lo statement andando a inserire i parametri dello statement
    {
        PreparedStatement st = conn.prepareStatement(query);

        int i = 1;
        for (Object value : params)
        {
            if (value == null)
            {
                st.setNull(i++, Types.VARCHAR);
            }
            else
            {
                st.setObject(i++, value);
            }
        }

        return st;
    }

    private static Result<DDLData> getDDLData(String query) //restituisce detarminate informazioni come le materie presenti su DB
    {
        Connection conn1 = null;
        Result<DDLData> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, query, new Object[]{}).executeQuery();
            while (rs.next())
            {
                DDLData p = new DDLData(rs.getString("Value"), rs.getString("Description"));
                out.add(p);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Integer> executeUpdQuery(String query, Object[] args)
    {
        Connection conn1 = null;
        Result<Integer> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            int rs = getPreparedStatement(conn1, query, args).executeUpdate();
            out.add(rs);

        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Slot> getBookings() //retriva tutte le prenotazioni disponibili dal DB
    {
        Connection conn1 = null;
        Result<Slot> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.getAvailableBookings, new Object[]{}).executeQuery();
            while (rs.next())
            {
                Slot p = new Slot(rs.getString("TeacherName"),
                        rs.getString("TeacherSurname"),
                        rs.getString("SubjectName"),
                        rs.getTime("StartTime"),
                        rs.getTime("EndTime"),
                        rs.getString("WeekDate"),
                        rs.getInt("TeacherId"),
                        rs.getInt("SlotId"),
                        (Integer) rs.getObject("BookingId"),
                        rs.getString("UserId")

                );

                System.out.println(rs.getString("WeekDate"));
                out.add(p);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Integer> newBooking(String slotId, String userId, String subjectId, String teacherId) //un utente specifico si registra per una specifica prenotazione
    {
        return executeUpdQuery(Query.newBooking,new Object[]{slotId, userId, teacherId, subjectId});
    }

    public static Result<Long> checkSlot(String userId,String slotId) //controlla nel DB se l'utente passato ha già prenotato un determinato slot
    {
        Connection conn1 = null;
        Result<Long> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.checkSlot, new Object[]{slotId, userId}).executeQuery();
            while (rs.next())
            {
                Long p = (Long) rs.getObject("num");
                out.add(p);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<User> login(String username, String password) //ritorna l'utente che sta effettuando il login
    {
        Connection conn1 = null;
        Result<User> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.login, new Object[] {username, password}).executeQuery();
            while (rs.next())
            {
                User p = new User(rs.getString("UserName"),
                        rs.getString("Name"),
                        rs.getString("Surname"),
                        rs.getBoolean("Role"));
                out.add(p);
            }
        }
        catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        }
        finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Long> checkUser(String username) //controlla che l'utente sia effettivamente registrato
    {
        Connection conn1 = null;
        Result<Long> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.checkUser, new Object[]{username}).executeQuery();
            while (rs.next())
            {
                Long p = (Long) rs.getObject("num");
                out.add(p);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Integer> signup(String username, String password, String name, String surname) //ritorna true o false in caso di utente registrato
    {
        return executeUpdQuery(Query.signup,new Object[]{username, password, name, surname});
    }

    public static Result<DDLData> getTeacherDDL() //ritorna la lista di professori
    {
        return getDDLData(Query.getTeacher);
    }

    public static Result<DDLData> getSubjectDDL() //ritorna la lista di materie
    {
        return getDDLData(Query.getSubject);
    }

    public static Result<DDLData> getUsers() //ritorna la lista degli utenti registrati
    {
        return getDDLData(Query.getUser);
    }

    public static Result<Slot> getOwnBookings(String userId,String subjectId,String teacherId) //ritorna la lista di slot delle proprie prenotazioni
    {
        Connection conn1 = null;
        Result<Slot> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.getOwnBookings, new Object[]{userId, userId, subjectId, subjectId, teacherId, teacherId}).executeQuery();
            while (rs.next())
            {
                Slot p = new Slot(rs.getString("TeacherName"),
                        rs.getString("TeacherSurname"),
                        rs.getString("SubjectName"),
                        rs.getTime("StartTime"),
                        rs.getTime("EndTime"),
                        rs.getString("WeekDate"),
                        rs.getInt("TeacherId"),
                        rs.getInt("SlotId"),
                        (Integer) rs.getObject("BookingId"),
                        rs.getString("UserId")
                );

                out.add(p);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Long> checkBooking(String userId,String bookingId) //controlla che l'utente in questione abbia effettivamente prenotato la prenotazione passata
    {
        Connection conn1 = null;
        Result<Long> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.checkBooking, new Object[]{userId, userId, bookingId}).executeQuery();
            while (rs.next())
            {
                Long p = (Long) rs.getObject("num");
                out.add(p);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Integer> cancelBooking(String bookingId) //cancella la prenotazione
    {
        return executeUpdQuery(Query.cancelBooking,new Object[]{bookingId});
    }

    public static Result<Integer> completeBooking(String bookingId) //conferma la prenotazione
    {
        return executeUpdQuery(Query.completeBooking,new Object[]{bookingId});
    }

    public static Result<Booking> getBookingList(String subjectName, String teacherId, String userId) //ritorna la lista delle proprie prenotazioni
    {
        Connection conn1 = null;
        Result<Booking> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.getBookingList, new Object[]{userId, userId, teacherId, teacherId, subjectName, subjectName}).executeQuery();
            while (rs.next())
            {
                Booking p = new Booking(rs.getString("BookingStatus"),
                        rs.getString("Teacher"),
                        rs.getString("Subject"),
                        rs.getTime("SlotStart"),
                        rs.getTime("SlotEnd"),
                        rs.getString("WeekDate"),
                        rs.getInt("BookingId"),
                        rs.getString("UserId")
                );

                out.add(p);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Teacher> getTeacherList() //ritorna la lista di docenti non disabilitati
    {
        Connection conn1 = null;
        Result<Teacher> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.getTeacherList, new Object[]{}).executeQuery();
            while (rs.next())
            {
                Teacher t = new Teacher(rs.getInt("Id"),
                        rs.getString("Name"),
                        rs.getString("Surname"));
                out.add(t);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Integer> deleteTeacher(String teacherId) //disabilita (rimuove logicamente) un docente
    {
        return executeUpdQuery(Query.deleteTeacher,new Object[]{teacherId});
    }

    public static Result<Integer> addTeacher(String teacherName,String teacherSurname) //aggiunge un docente
    {
        return executeUpdQuery(Query.addTeacher,new Object[]{teacherName,teacherSurname});
    }

    public static Result<Subject> getSubjectsList() //returna la lista di materie
    {
        Connection conn1 = null;
        Result<Subject> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }
            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.getSubject, new Object[]{}).executeQuery();
            while (rs.next())
            {
                Subject s = new Subject(rs.getString("Value"));
                out.add(s);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Integer> addSubject(String subjectName) //aggiunge una materia
    {
        return executeUpdQuery(Query.addSubject,new Object[]{subjectName});
    }

    public static Result<Integer> deleteSubject(String subjectName) //rimuove una materia
    {
        return executeUpdQuery(Query.deleteSubject,new Object[]{subjectName});
    }

    public static Result<Teaching> getTeachingList(String teacherId ,String subjectName) //ritorna la correlazione tra professore e corso dove i corsi e gli insegnanti non sono disabilitati
    {
        Connection conn1 = null;
        Result<Teaching> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.getTeachings, new Object[]{subjectName, subjectName, teacherId, teacherId}).executeQuery();
            while (rs.next())
            {
                Teaching t = new Teaching(rs.getInt("Id"),rs.getString("TeacherName"), rs.getString("SubjectId"), rs.getInt("TeacherId"));
                out.add(t);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Integer> addTeachings(String teacherId,String subjectId) //aggiunge un corso o insegnamento
    {
        return executeUpdQuery(Query.addTeachings,new Object[]{teacherId,subjectId});
    }

    public static Result<Integer> deleteTeaching(int id) //disabilita un corso
    {
        return executeUpdQuery(Query.deleteTeachings,new Object[]{id});
    }

    public static Result<Integer> enableTeaching(int teacherId, String subject) //abilita un corso
    {
        return executeUpdQuery(Query.enableTeaching,new Object[]{teacherId, subject});
    }

    public static Result<BigDecimal> checkTeaching(int teacherId,String subject) //controlla se il corso è disabilitato
    {
        Connection conn1 = null;
        Result<BigDecimal> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.checkTeaching, new Object[]{teacherId, subject}).executeQuery();
            while (rs.next())
            {
                BigDecimal p = (BigDecimal) rs.getObject("num");
                out.add(p);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<BigDecimal> checkSubject(String subjectName) //controlla se la materia è disabilitata
    {
        Connection conn1 = null;
        Result<BigDecimal> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.checkSubject, new Object[]{subjectName}).executeQuery();
            while (rs.next())
            {
                BigDecimal p = (BigDecimal) rs.getObject("num");
                out.add(p);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Integer> enableSubject(String subjectName) //abilita la materia
    {
        return executeUpdQuery(Query.enableSubject,new Object[]{subjectName});
    }

    public static Result<BigDecimal> checkTeacher(String teacherName, String teacherSurname) //controlla se l'insegnante è disabilitato
    {
        Connection conn1 = null;
        Result<BigDecimal> out = new Result<>();
        try
        {
            conn1 = getConnection();
            if (conn1 != null)
            {
                System.out.println("Connected to the database test");
            }

            assert conn1 != null;
            ResultSet rs = getPreparedStatement(conn1, Query.checkTeacher, new Object[]{teacherName, teacherSurname}).executeQuery();
            while (rs.next())
            {
                BigDecimal p = (BigDecimal) rs.getObject("num");
                out.add(p);
            }
        } catch (SQLException e)
        {
            System.out.println(e.getMessage());
            out.setError("Errore db: " + e.getMessage() + "<br>" + Arrays.toString(e.getStackTrace()));
        } finally
        {
            if (conn1 != null)
            {
                try
                {
                    conn1.close();
                } catch (SQLException e2)
                {
                    System.out.println(e2.getMessage());
                }
            }
        }
        return out;
    }

    public static Result<Integer> enableTeacher(String teacherName, String teacherSurname) //abilita un docente
    {
        return executeUpdQuery(Query.enableTeacher,new Object[]{teacherName, teacherSurname});
    }

}

