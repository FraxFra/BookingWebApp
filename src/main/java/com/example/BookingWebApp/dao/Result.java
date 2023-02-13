package com.example.BookingWebApp.dao;

import java.util.ArrayList;

public class Result<T> {
    public boolean ok;
    public String error;
    public ArrayList<T> data;

    public Result(boolean ok,String error,ArrayList<T> data){
        this.ok = ok;
        this.error = error;
        this.data = data;
    }

    public Result(){
        this.ok=true;
        error = "";
        data = new ArrayList<T>();
    }

    public void add(T value){
        data.add(value);
    }

    public void setError(String error){
        setError(error,true);
    }
    public void setError(String error, boolean clearData){
        this.ok = false;
        this.error = error;
        if (clearData)
            this.data.clear();
    }

}

