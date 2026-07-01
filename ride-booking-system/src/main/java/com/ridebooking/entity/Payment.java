package com.ridebooking.entity;

import com.ridebooking.enums.PaymentMethod;
import com.ridebooking.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private LocalDateTime paidAt;

    @OneToOne
    @JoinColumn(name = "ride_id")
    private Ride ride;
}