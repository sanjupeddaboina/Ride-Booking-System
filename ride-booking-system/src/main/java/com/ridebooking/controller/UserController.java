package com.ridebooking.controller;

import com.ridebooking.dto.request.UserLoginRequest;
import com.ridebooking.dto.request.UserRegistrationRequest;
import com.ridebooking.dto.response.RideResponse;
import com.ridebooking.dto.response.UserResponse;
import com.ridebooking.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@Valid @RequestBody UserLoginRequest request) {
        UserResponse response = userService.loginUser(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getByUserId(@PathVariable Long userId) {
        UserResponse response = userService.getByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/current/{userId}")
    public ResponseEntity<RideResponse> getCurrentRide(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getCurrentRide(userId));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<RideResponse>> getRideHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getRideHistory(userId));
    }
}
