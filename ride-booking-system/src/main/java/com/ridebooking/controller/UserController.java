package com.ridebooking.controller;

import com.ridebooking.dto.request.UserLoginRequest;
import com.ridebooking.dto.request.UserRegistrationRequest;
import com.ridebooking.dto.response.UserResponse;
import com.ridebooking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public UserResponse registerUser(@RequestBody UserRegistrationRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public UserResponse loginUser(@RequestBody UserLoginRequest request) {
        return userService.loginUser(request);
    }

}
