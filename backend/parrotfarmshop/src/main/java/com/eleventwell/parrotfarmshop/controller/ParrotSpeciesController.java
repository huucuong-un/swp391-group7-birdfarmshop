/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.eleventwell.parrotfarmshop.controller;

import com.eleventwell.parrotfarmshop.dto.ParrotSpeciesDTO;
import com.eleventwell.parrotfarmshop.output.ListOutput;
import com.eleventwell.parrotfarmshop.service.IGenericService;
//import com.eleventwell.parrotfarmshop.service.IParrotSpeciesService;
import java.util.List;

import com.eleventwell.parrotfarmshop.service.impl.ParrotSpeciesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ASUS
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/api/parrot-species")
public class ParrotSpeciesController {
    @Autowired
    private ParrotSpeciesService parrotSpeciesService;
    
    @GetMapping(value = "") 
    public List<ParrotSpeciesDTO> showParrotSpecies() {
        ListOutput result = new ListOutput();
        
        result.setListResult(parrotSpeciesService.findAll());
        return result.getListResult();
    }

    @GetMapping(value = "find-one-species-by-id/{id}")
    public ParrotSpeciesDTO findOneSpeciesById(@RequestBody @PathVariable("id") long id) {

        return (ParrotSpeciesDTO) parrotSpeciesService.findOneSpeciesById(id);
    }
    @PostMapping(value = "")
	public ParrotSpeciesDTO createParrotSpecies(@RequestBody ParrotSpeciesDTO model) {
		return (ParrotSpeciesDTO) parrotSpeciesService.save(model);
	}
        @PutMapping(value = "{id}")
	public ParrotSpeciesDTO updateParrotSpecies(@RequestBody ParrotSpeciesDTO model, @PathVariable("id") long id) {
		model.setId(id);
		return (ParrotSpeciesDTO) parrotSpeciesService.save(model);
	}
        @DeleteMapping(value = "")
	public void deleteParrotSpecies(@RequestBody Long ids) {
		parrotSpeciesService.changeStatus(ids);
	}
}
