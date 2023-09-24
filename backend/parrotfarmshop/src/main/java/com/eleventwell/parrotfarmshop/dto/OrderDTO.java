package com.eleventwell.parrotfarmshop.dto;

import com.eleventwell.parrotfarmshop.entity.OrderDetailEntity;
import com.eleventwell.parrotfarmshop.entity.PromotionEntity;
import com.eleventwell.parrotfarmshop.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDTO {




    private Long userID;


    private String address;


    private Long promotionID;

    private Boolean status;

    private Double totalPrice;
}