package com.ridebooking.dto.response.driver;

import com.ridebooking.enums.DriverStatus;
import com.ridebooking.enums.VehicleType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverResponse {

    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private String vehicleNumber;

    private VehicleType vehicleType;

    private DriverStatus status;

    private Boolean available;

    private Double rating;

    private Double totalEarnings;

}
