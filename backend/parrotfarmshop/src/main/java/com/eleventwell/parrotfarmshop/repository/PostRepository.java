package com.eleventwell.parrotfarmshop.repository;

import com.eleventwell.parrotfarmshop.entity.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<PostEntity, Long> {

    PostEntity findOneById(long id);
}
