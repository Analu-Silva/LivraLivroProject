package br.edu.atitus.book_service.controllers;

import java.util.List;
import java.util.UUID;

import javax.security.sasl.AuthenticationException;

import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.book_service.dtos.BookDTO;
import br.edu.atitus.book_service.entities.BookConditionEntity;
import br.edu.atitus.book_service.entities.BookEntity;
import br.edu.atitus.book_service.entities.BookGenreEntity;
import br.edu.atitus.book_service.repositories.BookConditionRepository;
import br.edu.atitus.book_service.repositories.BookGenreRepository;
import br.edu.atitus.book_service.repositories.BookRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ws/books")
public class WsBookController {
	private final BookRepository repository;
	private BookGenreRepository bookGenreRepository;
	private BookConditionRepository bookConditionRepository;

	public WsBookController(BookRepository repository, BookGenreRepository bookGenreRepository,
			BookConditionRepository bookConditionRepository) {
		super();
		this.repository = repository;
		this.bookGenreRepository = bookGenreRepository;
		this.bookConditionRepository = bookConditionRepository;
	}

	private BookEntity convertDto2Entity(BookDTO dto) throws Exception {
		var book = new BookEntity();
		BeanUtils.copyProperties(dto, book);

		if (dto.genresId() != null && !dto.genresId().isEmpty()) {
			List<BookGenreEntity> genres = bookGenreRepository.findAllById(dto.genresId());
			book.setGenre(genres);
		}

		if (dto.bookConditionId() != null) {
			BookConditionEntity condition = bookConditionRepository.findById(dto.bookConditionId())
					.orElseThrow(() -> new Exception("Book Contidition not found"));
			book.setBookCondition(condition);
		}

		return book;
	}

	@PostMapping
	public ResponseEntity<BookEntity> createBook(@Valid @RequestBody BookDTO dto, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Email") String emailUser, @RequestHeader("X-User-Type") Integer userType)
			throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		var book = convertDto2Entity(dto);
		repository.save(book);

		return ResponseEntity.status(201).body(book);
	}

	@PatchMapping("/{idBook}")
	public ResponseEntity<BookEntity> updateBook(@PathVariable UUID idBook, @Valid @RequestBody BookDTO dto,
			@RequestHeader("X-User-Id") UUID UserId, @RequestHeader("X-User-Email") String emailUser,
			@RequestHeader("X-User-Type") Integer userType) throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		var book = convertDto2Entity(dto);
		book.setId(idBook);
		repository.save(book);

		return ResponseEntity.ok(book);
	}

	@DeleteMapping("/{idBook}")
	public ResponseEntity<String> deleteBook(@PathVariable UUID idBook, @RequestHeader("X-User-Id") UUID UserId,
			@RequestHeader("X-User-Email") String emailUser, @RequestHeader("X-User-Type") Integer userType)
			throws Exception {

		if (userType != 0 && userType != 1)
			throw new AuthenticationException("Usuário sem permissão");

		repository.deleteById(idBook);

		return ResponseEntity.ok("Excluído"); // Ou null
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<String> handlerAuth(AuthenticationException e) {
		String message = e.getMessage().replaceAll("[\\r\\n]", "");
		return ResponseEntity.status(403).body(message);
	}
}
