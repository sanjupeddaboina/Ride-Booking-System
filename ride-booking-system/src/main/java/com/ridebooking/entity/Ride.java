package com.ridebooking.entity;

import com.ridebooking.enums.RideStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pickupAddress;

    private String dropAddress;

    private Double distance;

    private Double fare;

    @Enumerated(EnumType.STRING)
    private RideStatus status;

    private LocalDateTime bookedAt;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @OneToOne(mappedBy = "ride")
    private Payment payment;
}