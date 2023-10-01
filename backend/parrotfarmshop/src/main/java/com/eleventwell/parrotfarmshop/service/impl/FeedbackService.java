package com.eleventwell.parrotfarmshop.service.impl;

import com.eleventwell.parrotfarmshop.converter.GenericConverter;
import com.eleventwell.parrotfarmshop.dto.FeedbackDTO;
import com.eleventwell.parrotfarmshop.entity.FeedbackEntity;
import com.eleventwell.parrotfarmshop.repository.FeedbackRepository;
import com.eleventwell.parrotfarmshop.repository.ParrotRepository;
import com.eleventwell.parrotfarmshop.repository.ParrotSpeciesRepository;
import com.eleventwell.parrotfarmshop.service.IGenericService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class FeedbackService implements IGenericService<FeedbackDTO> {

    @Autowired
    FeedbackRepository feedbackRepository;

    @Autowired
    ParrotSpeciesRepository parrotSpeciesRepository;

    @Autowired
    GenericConverter genericConverter;

    @Override
    public List<FeedbackDTO> findAll() {
List<FeedbackDTO> listDTO = new ArrayList<>();
List<FeedbackEntity> listEntity = feedbackRepository.findAllByOrderByIdDesc();
        for (FeedbackEntity entity: listEntity) {
         FeedbackDTO dto = (FeedbackDTO) genericConverter.toDTO(entity,FeedbackDTO.class);
            listDTO.add(dto);
        }
        return listDTO;
    }

    @Override
    public FeedbackDTO save(FeedbackDTO DTO) {
FeedbackEntity newEntity = new FeedbackEntity();

if(DTO.getId()!=null){
    FeedbackEntity oldEntity = feedbackRepository.findOneById(DTO.getId());
    newEntity = (FeedbackEntity) genericConverter.updateEntity(DTO,oldEntity);

}else{
    newEntity = (FeedbackEntity) genericConverter.toEntity(DTO, FeedbackEntity.class);
}
newEntity.setParrotSpecies(parrotSpeciesRepository.findOneById(DTO.getSpeciesId()));
feedbackRepository.save(newEntity);
return (FeedbackDTO) genericConverter.toDTO(newEntity, FeedbackDTO.class);
    }
public List<FeedbackDTO> findAllBySpeciesIdAndBelongto(Long id, String belongto){
        List<FeedbackDTO> listDTO = new ArrayList<>();
        List<FeedbackEntity> listEntity = feedbackRepository.findAllByParrotSpeciesIdAndBelongToOrderByIdDesc(id,belongto);

    for (FeedbackEntity entity:listEntity) {
        FeedbackDTO dto = (FeedbackDTO) genericConverter.toDTO(entity, FeedbackDTO.class);
        listDTO.add(dto);
    }
    return  listDTO;
}


    @Override
    public void changeStatus(Long ids) {

    }
}
