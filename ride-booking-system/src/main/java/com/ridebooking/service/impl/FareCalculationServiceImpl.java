package com.ridebooking.service.impl;

import com.ridebooking.enums.VehicleType;
import com.ridebooking.service.FareCalculationService;
import org.springframework.stereotype.Service;

@Service
public class FareCalculationServiceImpl implements FareCalculationService {

    @Override
    public Double calculateFare(VehicleType vehicleType, Double distance) {
        double baseFare;
        double perKmRate = switch (vehicleType) {
            case BIKE -> {
                baseFare = 50.0;
                yield 8.0;
            }
            case AUTO -> {
                baseFare = 70.0;
                yield 12.0;
            }
            case MINI -> {
                baseFare = 100.0;
                yield 16.0;
            }
            case SEDAN -> {
                baseFare = 150.0;
                yield 20.0;
            }
            default -> throw new IllegalArgumentException("Invalid vehicle type");
        };

        return baseFare + (perKmRate * distance);
    }
}
