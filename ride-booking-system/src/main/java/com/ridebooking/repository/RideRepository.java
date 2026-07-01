package com.ridebooking.repository;

import com.ridebooking.entity.Ride;
import com.ridebooking.enums.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RideRepository extends JpaRepository<Ride, Long> {
    boolean existsByUserIdAndStatusIn(Long userId, List<RideStatus> statuses);
    Optional<Ride> findFirstByUserIdAndStatusInOrderByBookedAtDesc(Long id, List<RideStatus> requested);
    List<Ride> findByUserIdAndStatus(Long userId, RideStatus status);
}