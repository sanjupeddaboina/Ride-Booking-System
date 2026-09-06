package com.ridebooking.controller;

import com.ridebooking.dto.request.ride.BookingRideRequest;
import com.ridebooking.dto.request.user.UserLoginRequest;
import com.ridebooking.dto.request.user.UserRegistrationRequest;
import com.ridebooking.dto.response.auth.AuthResponse;
import com.ridebooking.dto.response.ride.RideResponse;
import com.ridebooking.dto.response.user.UserResponse;
import com.ridebooking.service.RideService;
import com.ridebooking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final RideService rideService;

    public UserController(
            UserService userService,
            RideService rideService) {

        this.userService = userService;
        this.rideService = rideService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(
            @Valid @RequestBody UserRegistrationRequest request) {

        UserResponse userResponse = userService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(
            @Valid @RequestBody UserLoginRequest request) {

        AuthResponse userResponse = userService.loginUser(request);

        return ResponseEntity.ok(userResponse);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getByUserId(
            @PathVariable Long userId) {

        UserResponse userResponse = userService.getByUserId(userId);

        return ResponseEntity.ok(userResponse);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{userId}/current")
    public ResponseEntity<RideResponse> getCurrentRide(
            @PathVariable Long userId) {

        RideResponse response = userService.getCurrentRide(userId);

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{userId}/rides")
    public ResponseEntity<List<RideResponse>> getRideHistory(
            @PathVariable Long userId) {

        List<RideResponse> response = userService.getRideHistory(userId);

        return ResponseEntity.ok(response);
    }
}