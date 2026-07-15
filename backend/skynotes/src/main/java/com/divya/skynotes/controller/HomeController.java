package com.divya.skynotes.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
     @GetMapping("/")
    public String home() {
        return "Welcome to SkyNotes!";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello Divya!";
    }
}
