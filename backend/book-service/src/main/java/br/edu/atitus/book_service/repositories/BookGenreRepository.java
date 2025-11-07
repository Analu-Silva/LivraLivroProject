package br.edu.atitus.book_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.book_service.entities.BookGenreEntity;

@Repository
public interface BookGenreRepository extends JpaRepository<BookGenreEntity, Integer> {

}
