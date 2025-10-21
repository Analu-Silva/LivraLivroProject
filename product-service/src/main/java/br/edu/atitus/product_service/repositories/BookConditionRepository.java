package br.edu.atitus.product_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.product_service.entities.BookConditionEntity;

@Repository
public interface BookConditionRepository extends JpaRepository<BookConditionEntity, Integer> {

}
