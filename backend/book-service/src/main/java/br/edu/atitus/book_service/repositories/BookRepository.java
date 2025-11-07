package br.edu.atitus.book_service.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.atitus.book_service.entities.BookEntity;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, UUID> {
	
}
