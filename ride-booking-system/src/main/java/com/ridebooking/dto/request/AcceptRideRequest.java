package com.ridebooking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class AcceptRideRequest {

    private Long driverId;
    @NotNull(message = "Ride ID is required")
    private Long rideId;
}
