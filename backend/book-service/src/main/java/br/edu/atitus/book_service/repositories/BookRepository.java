package br.edu.atitus.book_service.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import br.edu.atitus.book_service.entities.BookEntity;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, UUID> {
	
	boolean existsByIsbn(String isbn);
	
//	Optional<BookEntity> findSellerById(UUID seller);
	
	List<BookEntity> findBooksBySeller(UUID seller);
	
	Page<BookEntity> findByCurrency(String currency, Pageable pageable);
	
	Page<BookEntity> findByGenre_id(Integer genreId, Pageable pageable);
	
	Page<BookEntity> findByBookCondition_Id(Integer conditionId, Pageable pageable);
	
	Page<BookEntity> findBySeller(UUID seller, Pageable pageable);
	
	Page<BookEntity> findByTitleContainingIgnoreCase(String searchText, Pageable pageable);
	
	@Query("SELECT DISTINCT bookent.seller FROM BookEntity bookent")
	List<UUID> findSellerId();
}
