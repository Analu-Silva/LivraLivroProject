package br.edu.atitus.book_service.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.edu.atitus.book_service.entities.BookImageUrlEntity;
import feign.Param;

@Repository
public interface BookImageUrlRepository extends JpaRepository<BookImageUrlEntity, UUID> {
	
	boolean existsByImageUrl(String imageUrl);
	
	@Query("SELECT bkimageurlent.imageUrl FROM BookImageUrlEntity bkimageurlent WHERE bkimageurlent.imageUrl IN :urls")
	List<String> findExistingUrls(@Param("urls") List<String> urls);

}
