package com.example.stockproject.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class exController {

    @GetMapping("/test")
    public String test(){
        return "test";
    }
}
