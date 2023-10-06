package com.eleventwell.parrotfarmshop.controller;

import com.eleventwell.parrotfarmshop.dto.DeliveryInformationDTO;
import com.eleventwell.parrotfarmshop.service.impl.DeliveryInformationService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/delivery-information")
public class DeliveryInformationController {
   @Autowired
    private DeliveryInformationService deliveryInformationService;

    @GetMapping(value = "{customerid}")
    public List<DeliveryInformationDTO> showDeliveryInformationByCustomerId(@PathVariable("customerid") Long customerId) {
        return deliveryInformationService.getDeliveryInformationByCustomerId(customerId);
    }

    @GetMapping(value = "/picking-status/{customerid}")
    public DeliveryInformationDTO findDeliveryInfoWithTruePickStatus(@PathVariable("customerid") Long customerId) {
        return deliveryInformationService.getDeliveryInformationByCustomerIdWithTruePickingStatus(customerId);
    }

    @PostMapping(value = "")
    public DeliveryInformationDTO createDeliveryInformation(@RequestBody DeliveryInformationDTO model) {
        return deliveryInformationService.save(model);
    }

    @PutMapping(value = "{id}")
    public DeliveryInformationDTO updateDeliveryInformation(@RequestBody DeliveryInformationDTO model, @PathVariable("id") Long id) {
        model.setId(id);
        return deliveryInformationService.save(model);
    }

    @PutMapping(value = "/update-picking-status/{customerid}")
    public DeliveryInformationDTO updatePickingStatus(@RequestBody DeliveryInformationDTO deliveryInfo, @PathVariable("customerid") Long customerId) {
        return deliveryInformationService.updatePickingStatus(deliveryInfo.getId(), customerId);
    }

}
