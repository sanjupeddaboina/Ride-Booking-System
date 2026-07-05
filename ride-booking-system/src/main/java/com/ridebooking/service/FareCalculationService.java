package com.ridebooking.service;

import com.ridebooking.enums.VehicleType;

public interface FareCalculationService {
    public Double calculateFare(VehicleType vehicleType, Double distance);
}
