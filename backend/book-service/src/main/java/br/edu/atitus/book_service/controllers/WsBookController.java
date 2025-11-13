package br.edu.atitus.book_service.controllers;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.book_service.dtos.BookDTO;
import br.edu.atitus.book_service.dtos.BookUpdateDTO;
import br.edu.atitus.book_service.entities.BookConditionEntity;
import br.edu.atitus.book_service.entities.BookEntity;
import br.edu.atitus.book_service.entities.BookGenreEntity;
import br.edu.atitus.book_service.entities.BookImageUrlEntity;
import br.edu.atitus.book_service.entities.BookLanguageEntity;
import br.edu.atitus.book_service.repositories.BookConditionRepository;
import br.edu.atitus.book_service.repositories.BookGenreRepository;
import br.edu.atitus.book_service.repositories.BookImageUrlRepository;
import br.edu.atitus.book_service.repositories.BookLanguageRepository;
import br.edu.atitus.book_service.repositories.BookRepository;
import br.edu.atitus.book_service.services.BookService;
import br.edu.atitus.book_service.exceptions.ResourceAlreadyExistsException;
import br.edu.atitus.book_service.exceptions.ResourceNotFoundException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ws/books")
public class WsBookController {
	private final BookService bookService;
	private final BookRepository bookRepository;
	private final BookGenreRepository bookGenreRepository;
	private final BookConditionRepository bookConditionRepository;
	private final BookImageUrlRepository bookImageUrlRepository;
	private final BookLanguageRepository bookLanguageRepository;

	public WsBookController(BookRepository bookrepository, BookGenreRepository bookGenreRepository,
			BookConditionRepository bookConditionRepository, BookImageUrlRepository bookImageUrlRepository, BookService bookService, BookLanguageRepository bookLanguageRepository) {
		super();
		this.bookService = bookService;
		this.bookRepository = bookrepository;
		this.bookGenreRepository = bookGenreRepository;
		this.bookConditionRepository = bookConditionRepository;
		this.bookImageUrlRepository = bookImageUrlRepository;
		this.bookLanguageRepository = bookLanguageRepository;
	}

	private void validateUserType(Integer userType) {
		if (userType != 0 && userType != 1)
			throw new SecurityException("Usuário sem permissão");
	}
	
	private void validateIsbnUniquenessWithIdNull(String isbn) {
		if (bookRepository.existsByIsbn(isbn.trim()))
			throw new ResourceAlreadyExistsException("isbn: Já existe um livro com este isbn");
	}

	private void validateIsbnUniquenessWithIdNotNull(UUID id, String isbn) {
		if (bookRepository.existsByIsbnAndIdNot(isbn, id))
			throw new ResourceAlreadyExistsException("isbn: Já existe um livro com este isbn");
	}
	
	private void validateImageUrlUniquenessWithId(List<String> imagesUrl) {
		if (imagesUrl == null || imagesUrl.isEmpty()) {
			return;
		}
		
		List<String> existingUrls = bookImageUrlRepository.findExistingUrls(imagesUrl);
		
		if (!existingUrls.isEmpty()) {
				throw new ResourceAlreadyExistsException("Já existe livro cadastrado com esta url");
			}
		}

	private BookEntity convertDto2Entity(BookDTO dto) {
		BookEntity book = new BookEntity();
		BeanUtils.copyProperties(dto, book);

		if (dto.genresId() != null && !dto.genresId().isEmpty()) {
			List<BookGenreEntity> genres = bookGenreRepository.findAllById(dto.genresId());
			book.setGenre(genres);
		}

		if (dto.bookConditionId() != null) {
			BookConditionEntity condition = bookConditionRepository.findById(dto.bookConditionId())
					.orElseThrow(() -> new ResourceNotFoundException("Condição do livro não encontrada"));
			book.setBookCondition(condition);
		}
		
		if (dto.bookLanguageId() != null) {
			BookLanguageEntity condition = bookLanguageRepository.findById(dto.bookLanguageId())
					.orElseThrow(() -> new ResourceNotFoundException("Linguagem do livro não encontrada"));
			book.setBookLanguage(condition);
		}

		if (dto.imagesUrl() != null && !dto.imagesUrl().isEmpty()) {

			List<BookImageUrlEntity> imageEntities = dto.imagesUrl().stream().map(url -> {
				BookImageUrlEntity img = new BookImageUrlEntity();
				img.setImageUrl(url);
				img.setBook(book);
				return img;
			}).collect(Collectors.toList());

			book.setImagesUrls(imageEntities);
		}

		return book;
	}

	@PostMapping
	public ResponseEntity<BookEntity> createBook(@Valid @RequestBody BookDTO dto,
			@RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		validateUserType(userType);
		validateIsbnUniquenessWithIdNull(dto.isbn());
		validateImageUrlUniquenessWithId(dto.imagesUrl());

		BookEntity book = convertDto2Entity(dto);
		book.setSeller(UserId);
		bookRepository.save(book);

		return ResponseEntity.status(201).body(book);
	}

	@PatchMapping("/{idBook}")
	public ResponseEntity<BookEntity> updateBook(@PathVariable UUID idBook, @Valid @RequestBody BookUpdateDTO dto,
			@RequestHeader("X-User-Id") UUID UserId, @RequestHeader("X-User-Type") Integer userType) {
		
		validateUserType(userType);
		validateIsbnUniquenessWithIdNotNull(idBook, dto.isbn());
		validateImageUrlUniquenessWithId(dto.imagesUrl());
		
		BookEntity updatebook = bookService.alterBook(idBook, dto, UserId, userType);

		return ResponseEntity.ok(updatebook);
	}

	@DeleteMapping("/{idBook}")
	public ResponseEntity<Void> deleteBook(@PathVariable UUID idBook, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Type") Integer userType) {

		validateUserType(userType);

		bookRepository.deleteById(idBook);

		return ResponseEntity.noContent().build(); // null ou .ok("Excluído") tbm
	}

	@DeleteMapping("/internal/deleteAccount/{id}")
	@Transactional
	public ResponseEntity<Void> deleteAllBooksFromUser(@PathVariable UUID id) {

		List<BookEntity> booksToBeDeleted = bookRepository.findBooksBySeller(id);
		bookRepository.deleteAll(booksToBeDeleted);

		return ResponseEntity.noContent().build();
	}

}
