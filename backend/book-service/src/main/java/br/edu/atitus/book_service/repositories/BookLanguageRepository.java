package br.edu.atitus.book_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.book_service.entities.BookLanguageEntity;

@Repository
public interface BookLanguageRepository extends JpaRepository<BookLanguageEntity, Integer> {

}
