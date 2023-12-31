package com.eleventwell.parrotfarmshop.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Date;

@ToString
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "nest_development")
public class NestDevelopmentEntity extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "nest_usage_history_id")
    private NestUsageHistoryEntity nestUsageHistory;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private NestDevelopmentStatusEntity nestDevelopmentStatus;

    @Column(name = "event_date")
    private Date eventDate;

    @Size(min = 10, max = 150)
    @Column(name = "description")
    private String description;




}
