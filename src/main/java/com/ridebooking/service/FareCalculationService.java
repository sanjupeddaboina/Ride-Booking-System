package com.ridebooking.service;

import com.ridebooking.enums.VehicleType;
import org.springframework.stereotype.Service;

public interface FareCalculationService {
    public Double calculateFare(VehicleType vehicleType, Double distance);
}
