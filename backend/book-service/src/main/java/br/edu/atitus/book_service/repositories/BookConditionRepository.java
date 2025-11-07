package br.edu.atitus.book_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.book_service.entities.BookConditionEntity;

@Repository
public interface BookConditionRepository extends JpaRepository<BookConditionEntity, Integer> {

}
