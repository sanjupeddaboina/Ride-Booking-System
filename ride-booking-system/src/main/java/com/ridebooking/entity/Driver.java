package com.ridebooking.entity;

import com.ridebooking.enums.VehicleType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
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

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @Column(unique = true)
    private String phoneNumber;

    @Column(unique = true)
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @Column(unique = true)
    private String licenseNumber;

    private Boolean available;

    private Double rating;

    private Double earnings;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "driver")
    private List<Ride> rides;
}