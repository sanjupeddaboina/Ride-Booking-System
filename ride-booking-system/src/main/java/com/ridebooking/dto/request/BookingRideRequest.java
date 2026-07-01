package com.ridebooking.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class BookingRideRequest {
    private Long userId;
    private String pickupLocation;
    private String dropoutLocation;
}
