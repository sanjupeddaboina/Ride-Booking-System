package com.ridebooking.repository;

import com.ridebooking.entity.Driver;
import com.ridebooking.enums.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByVehicleNumber(String vehicleNumber);
    boolean existsByLicenseNumber(String licenseNumber);
    List<Driver> findByAvailableTrueAndVehicleType(VehicleType vehicleType);

}
