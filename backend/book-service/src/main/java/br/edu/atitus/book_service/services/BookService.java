package br.edu.atitus.book_service.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.edu.atitus.book_service.dtos.BookDTO;
import br.edu.atitus.book_service.entities.BookConditionEntity;
import br.edu.atitus.book_service.entities.BookEntity;
import br.edu.atitus.book_service.entities.BookGenreEntity;
import br.edu.atitus.book_service.repositories.BookConditionRepository;
import br.edu.atitus.book_service.repositories.BookGenreRepository;
import br.edu.atitus.book_service.repositories.BookRepository;
import br.edu.atitus.book_service.exceptions.ResourceNotFoundException;
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
	
	private void validateUserType(Integer userType) {
		if (userType != 0 && userType != 1)
			throw new SecurityException("Usuário sem permissão");
	}

	private BookEntity findBookById(UUID id) {
		return bookRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado"));
	}

	@Transactional
	public BookEntity alterBook(UUID id, BookDTO dto, UUID UserId, Integer userType) {

		validateUserType(userType);
		BookEntity book = findBookById(id);

		if (dto.title() != null && !dto.title().isEmpty()) {
			book.setTitle(dto.title());
		}
		
		if (dto.price() != null) {
			book.setPrice(dto.price());
		}
		
		if (dto.currency() != null && !dto.currency().isEmpty()) {
			book.setCurrency(dto.currency());
		}
		
		if (dto.numberOfPages() != null) {
			book.setNumberOfPages(dto.numberOfPages());
		}
		
		if (dto.genresId() != null) {
			
			List<Integer> newGenreIds = dto.genresId();
			List<BookGenreEntity> newGenres = bookGenreRepository.findAllById(newGenreIds);
			
			if (newGenres.size() != newGenreIds.size()) {
				throw new ResourceNotFoundException("Gênero(s) não encontrado(s)");
			}
	
			book.setGenre(newGenres);
		}
		
		if (dto.bookConditionId() != null) {
			BookConditionEntity condition = bookConditionRepository.findById(dto.bookConditionId())
					.orElseThrow (() -> new ResourceNotFoundException("Condição não encontrada"));
			book.setBookCondition(condition);
		}
		
		if (dto.numberOfYears() != null) {
			book.setNumberOfYears(dto.numberOfYears());
		}
		
		if (dto.isbn() != null && !dto.isbn().isEmpty()) {
			book.setIsbn(dto.isbn());
		}
		
		if (dto.publisher() != null && !dto.publisher().isEmpty()) {
			book.setPublisher(dto.publisher());
		}
		
		if (dto.stock() != null) {
			book.setStock(dto.stock());
		}
		
		if (dto.author() != null && !dto.author().isEmpty()) {
			book.setAuthor(dto.author());
		}
		
//		if (dto.seller() != null) {
//			book.setSeller(dto.seller());
//		}
//		
		if (dto.description() != null && !dto.description().isEmpty()) {
			book.setDescription(dto.description());
		}

		bookRepository.save(book);

		return book;
	}

}
