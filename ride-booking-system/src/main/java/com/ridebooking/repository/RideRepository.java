package com.ridebooking.repository;

import com.ridebooking.entity.Driver;
import com.ridebooking.entity.Ride;
import com.ridebooking.entity.User;
import com.ridebooking.enums.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RideRepository extends JpaRepository<Ride, Long> {

    boolean existsByUserIdAndStatusIn(Long userId, List<RideStatus> statuses);
    Optional<Ride> findFirstByUserIdAndStatusInOrderByBookedAtDesc(Long userId, List<RideStatus> statuses);
    List<Ride> findByUserIdAndStatus(Long userId, RideStatus status);
    boolean existsByDriverIdAndStatusIn(Long driverId, List<RideStatus> statuses);
    Optional<Ride> findFirstByDriverIdAndStatusInOrderByBookedAtDesc(Long driverId, List<RideStatus> statuses);
    Optional<Ride> findByDriverIdAndStatus(Long driverId, RideStatus status);
    List<Ride> findByDriverId(Long driverId);
    List<Ride> findByStatus(RideStatus status);
}