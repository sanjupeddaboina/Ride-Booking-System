package com.ridebooking.dto.response.ride;

import com.ridebooking.enums.VehicleType;
import java.time.LocalDateTime;
import lombok.*;

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
