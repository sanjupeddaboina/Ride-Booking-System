package com.ridebooking.repository;

import com.ridebooking.entity.Driver;
import com.ridebooking.enums.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ridebooking.enums.DriverStatus;
import com.ridebooking.enums.VehicleType;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByVehicleNumber(String vehicleNumber);
    boolean existsByLicenseNumber(String licenseNumber);
    List<Driver> findByStatusAndAvailableTrueAndVehicleType(
            DriverStatus status,
            VehicleType vehicleType);
}
