package com.eleventwell.parrotfarmshop.Model;

import lombok.*;

@ToString
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDetailHistoryModel {

    String img;
    String SpeciesName;

    String color;
    Integer quantity;
    Double totalPrice;



}
