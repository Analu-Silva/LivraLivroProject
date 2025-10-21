package br.edu.atitus.product_service.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.edu.atitus.product_service.dtos.BookDTO;
import br.edu.atitus.product_service.entities.BookConditionEntity;
import br.edu.atitus.product_service.entities.BookEntity;
import br.edu.atitus.product_service.entities.BookGenreEntity;
import br.edu.atitus.product_service.repositories.BookConditionRepository;
import br.edu.atitus.product_service.repositories.BookGenreRepository;
import br.edu.atitus.product_service.repositories.BookRepository;
import jakarta.transaction.Transactional;

@Service
public class BookService {

	private final BookRepository bookRepository;
	private final BookGenreRepository bookGenreRepository;
	private final BookConditionRepository bookConditionRepository;

	public BookService(BookRepository bookRepository, BookGenreRepository bookGenreRepository,
			BookConditionRepository bookConditionRepository) {
		super();
		this.bookRepository = bookRepository;
		this.bookGenreRepository = bookGenreRepository;
		this.bookConditionRepository = bookConditionRepository;
	}

	@Transactional
	public BookEntity bookRegistration(BookDTO dto) throws Exception {
		BookEntity newBook = new BookEntity();
		newBook.setTitle(dto.title());
		newBook.setNumberOfPages(dto.numberOfPages());
		newBook.setPrice(dto.price());

		newBook.setNumberOfYears(dto.numberOfYears());
		newBook.setIsbn(dto.isbn());
		newBook.setPublisher(dto.publisher());
		newBook.setDescription(dto.description());

		List<Integer> genreIds = dto.genresId();
		List<BookGenreEntity> genreObjects = bookGenreRepository.findAllById(genreIds);
		newBook.setGenre(genreObjects);

		Integer conditionId = dto.bookConditionId();
		BookConditionEntity conditionObject = bookConditionRepository.findById(conditionId)
				.orElseThrow(() -> new Exception());
		newBook.setBookCondition(conditionObject);

//		TODO substituir lógica do seller
		newBook.setSeller(UUID.randomUUID()); /////////////////////////////////

		return bookRepository.save(newBook);
	}

}
