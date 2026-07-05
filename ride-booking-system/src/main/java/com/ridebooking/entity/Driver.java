package com.ridebooking.entity;

import com.ridebooking.enums.VehicleType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false, unique = true)
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Builder.Default
    private Boolean available = true;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Double totalEarnings = 0.0;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "driver")
    private List<Ride> rides;

}