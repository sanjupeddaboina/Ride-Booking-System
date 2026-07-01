package com.ridebooking.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class AcceptRideRequest {
    private Long driverId;
    private Long rideId;
}
