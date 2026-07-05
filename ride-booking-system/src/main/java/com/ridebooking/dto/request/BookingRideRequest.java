package com.ridebooking.dto.request;

import com.ridebooking.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class BookingRideRequest {
    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    @NotBlank(message = "Drop address is required")
    private String dropAddress;

    @NotNull(message = "Distance is required")
    private Double distance;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;
}
