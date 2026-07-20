package com.divya.skynotes.controller;

import com.divya.skynotes.model.User;
import com.divya.skynotes.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.divya.skynotes.service.UserService;
import com.divya.skynotes.model.User;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }
}