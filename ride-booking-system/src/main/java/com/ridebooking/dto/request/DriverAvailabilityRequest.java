package com.ridebooking.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverAvailabilityRequest {

    private Long driverId;
    private Boolean available;
}