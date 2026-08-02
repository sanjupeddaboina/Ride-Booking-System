package com.ridebooking.repository;

import com.ridebooking.entity.Ride;
import com.ridebooking.enums.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    boolean existsByUserIdAndStatusIn(Long userId, List<RideStatus> statuses);
    Optional<Ride> findFirstByUserIdAndStatusInOrderByBookedAtDesc(Long userId, List<RideStatus> statuses);
    List<Ride> findByUserIdAndStatus(Long userId, RideStatus status);
    boolean existsByDriverIdAndStatusIn(Long driverId, List<RideStatus> statuses);
    Optional<Ride> findFirstByDriverIdAndStatusInOrderByBookedAtDesc(Long driverId, List<RideStatus> statuses);

    // Single-ride lookup, e.g. checking whether a driver has one specific-status ride (BOOKED awaiting acceptance).
    Optional<Ride> findByDriverIdAndStatus(Long driverId, RideStatus status);

    // List version for history screens, where a driver can have many rides in the same status.
    List<Ride> findByDriverIdAndStatusOrderByBookedAtDesc(Long driverId, RideStatus status);

    List<Ride> findByDriverId(Long driverId);
    List<Ride> findByStatus(RideStatus status);
}
