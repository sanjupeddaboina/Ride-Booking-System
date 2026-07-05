package com.ridebooking.dto.response;

import com.ridebooking.enums.VehicleType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RideResponse {

    private Long rideId;
    private Long userId;
    private Long driverId;
    private String pickupAddress;
    private String dropAddress;
    private VehicleType vehicleType;
    private Double fare;
    private String status;
    private LocalDateTime bookedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}