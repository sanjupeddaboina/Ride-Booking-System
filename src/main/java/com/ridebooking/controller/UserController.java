package com.ridebooking.controller;

import com.ridebooking.dto.request.user.UserLoginRequest;
import com.ridebooking.dto.request.user.UserRegistrationRequest;
import com.ridebooking.dto.response.ride.RideResponse;
import com.ridebooking.dto.response.user.UserResponse;
import com.ridebooking.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse userResponse = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@Valid @RequestBody UserLoginRequest request) {
        UserResponse userResponse = userService.loginUser(request);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getByUserId(@PathVariable Long userId) {
        UserResponse userResponse = userService.getByUserId(userId);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping ("/{userId}/rides")
    public ResponseEntity <RideResponse> bookRide(@PathVariable Long userId, @Valid @RequestBody RideResponse rideRequest) {
        // Implement the logic to book a ride for the user
        // For now, returning a placeholder response
        RideResponse rideResponse = new RideResponse(); // Replace with actual booking logic
        return ResponseEntity.status(HttpStatus.CREATED).body(rideResponse);
    }

    @GetMapping("/{userId}/current")
    public ResponseEntity<RideResponse> getCurrentRide(@PathVariable Long userId) {
        RideResponse rideResponse = userService.getCurrentRide(userId);
        return ResponseEntity.ok(rideResponse);
    }

    @GetMapping("/{userId}/rides")
    public ResponseEntity<List<RideResponse>> getRideHistory(@PathVariable Long userId) {
        List<RideResponse> rideHistory = userService.getRideHistory(userId);
        return ResponseEntity.ok(rideHistory);
    }
}
