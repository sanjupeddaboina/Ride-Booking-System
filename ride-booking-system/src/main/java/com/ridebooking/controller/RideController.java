package com.ridebooking.controller;

import com.ridebooking.dto.request.AcceptRideRequest;
import com.ridebooking.dto.request.BookingRideRequest;
import com.ridebooking.dto.response.RideResponse;
import com.ridebooking.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    @PostMapping("/book")
    public ResponseEntity<?> bookRide(@RequestBody BookingRideRequest request) {
        try {
            return ResponseEntity.ok(rideService.bookRide(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/accept")
    public RideResponse acceptRide(@RequestBody AcceptRideRequest request) {
        return rideService.acceptRide(request);
    }

    @PutMapping("{rideId}/cancel")
    public RideResponse cancelRide(@PathVariable Long rideId){
        return rideService.cancelRide(rideId);
    }

    @PutMapping("{rideId}/start")
    public RideResponse startRide(@PathVariable Long rideId) {
        return rideService.startRide(rideId);
    }

    @PutMapping("{rideId}/complete")
    public RideResponse completeRide(@PathVariable Long rideId) {
        return rideService.completeRide(rideId);
    }

    @GetMapping("{rideId}")
    public RideResponse getRideById(@PathVariable Long rideId) {
        return rideService.getRideById(rideId);
    }

    @GetMapping("/current/{userId}")
    public ResponseEntity<RideResponse> getCurrentRide(@PathVariable Long userId) {
        return ResponseEntity.ok(rideService.getCurrentRide(userId));
    }

    @GetMapping("history/{userId}")
    public ResponseEntity<?> getRideHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(rideService.getRideHistory(userId));
    }
}
