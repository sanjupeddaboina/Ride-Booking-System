package com.ridebooking.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RideResponse {

    private Long rideId;
    private String pickupAddress;
    private String dropAddress;
    private String status;
    private Long driverId;
    private Long userId;
}