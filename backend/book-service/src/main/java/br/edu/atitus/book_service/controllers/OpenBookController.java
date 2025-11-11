package br.edu.atitus.book_service.controllers;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.book_service.clients.CurrencyClient;
import br.edu.atitus.book_service.clients.CurrencyResponse;
import br.edu.atitus.book_service.entities.BookEntity;
import br.edu.atitus.book_service.repositories.BookRepository;

@RestController
@RequestMapping("/books")
public class OpenBookController {

	private final BookRepository repository;
	private final CurrencyClient currencyClient;
	private final CacheManager cacheManager;

	public OpenBookController(BookRepository repository, CurrencyClient currencyClient, CacheManager cacheManager) {
		super();
		this.repository = repository;
		this.currencyClient = currencyClient;
		this.cacheManager = cacheManager;
	}

	@Value("${server.port}")
	private int serverPort;

	@GetMapping("/{idBook}/{targetCurrency}")
	public ResponseEntity<BookEntity> getBook(@PathVariable UUID idBook, @PathVariable String targetCurrency)
			throws Exception {

		targetCurrency = targetCurrency.toUpperCase();
		String nameCache = "Book";
		String keyCache = idBook + targetCurrency;

		BookEntity book = cacheManager.getCache(nameCache).get(keyCache, BookEntity.class);

		if (book == null) {
			book = repository.findById(idBook).orElseThrow(() -> new Exception("Book not found"));
			book.setEnvironment("Book-service running on Port: " + serverPort);

			if (targetCurrency.equalsIgnoreCase(book.getCurrency()))
				book.setConvertedPrice(book.getPrice());
			else {
				CurrencyResponse currency = currencyClient.getCurrency(book.getPrice(), book.getCurrency(),
						targetCurrency);
				if (currency != null) {
					book.setConvertedPrice(currency.getConvertedValue());
					book.setEnvironment(book.getEnvironment() + " - " + currency.getEnvironment());
					cacheManager.getCache(nameCache).put(keyCache, book);
				} else {
					book.setConvertedPrice(BigDecimal.ONE.negate());
					book.setEnvironment(book.getEnvironment() + " - Currency unavailable");
				}

			}
		} else {
			book.setEnvironment("Book-service running on Port: " + serverPort + " - DataSource: cache");
		}

		return ResponseEntity.ok(book);
	}

	@GetMapping("/noconverter/{idBook}")
	public ResponseEntity<BookEntity> getNoConverter(@PathVariable UUID idBook) throws Exception {
		var book = repository.findById(idBook).orElseThrow(() -> new Exception("Livro não encontrado"));
		book.setConvertedPrice(BigDecimal.ONE.negate());
		book.setEnvironment("Book-service running on Port: " + serverPort);
		return ResponseEntity.ok(book);
	}

	@GetMapping("/{targetCurrency}")
	public ResponseEntity<Page<BookEntity>> getAllBooks(@PathVariable String targetCurrency,
			@RequestParam(required = false, name = "currency") String sourceCurrency,
			@RequestParam(required = false, name = "genreId") Integer sourceGenreId,
			@RequestParam(required = false, name = "bookConditionId") Integer sourceConditionId,
			@RequestParam(required = false, name = "author") UUID sourceAuthor,
			@RequestParam(required = false, name = "search") String searchText, 
			@PageableDefault(page = 0, size = 10, sort = "description", direction = Direction.ASC) Pageable pageable)
			 {
		
		Page<BookEntity> books;
		if (sourceCurrency != null) {
			books = repository.findByCurrency(sourceCurrency, pageable);
			
		} else if(sourceGenreId != null) {
			books = repository.findByGenre_id(sourceGenreId, pageable);
			
		} else if(sourceConditionId != null) {
			books = repository.findByBookCondition_Id(sourceConditionId, pageable);
		
		} else if (sourceAuthor != null) {
			books = repository.findBySeller(sourceAuthor, pageable);
		
		} else if (searchText != null) {
			books = repository.findByTitleContainingIgnoreCase(searchText, pageable);
			
		} else {
			books = repository.findAll(pageable);
		}
		
		for (BookEntity book : books) {
			CurrencyResponse currency = currencyClient.getCurrency(book.getPrice(), book.getCurrency(),
					targetCurrency);

			book.setConvertedPrice(currency.getConvertedValue());
			// Setar o ambiente
			book.setEnvironment(
					"Book-Service running on port: " + serverPort + " - " + currency.getEnvironment()); // + " - " +
																											// cambio.getAmbiente());
		}
		return ResponseEntity.ok(books);
	}
	
	@GetMapping("/internal/sellers")
	public ResponseEntity<List<UUID>> getSellers() {
		List<UUID> sellerIds = repository.findSellerId();
		return ResponseEntity.ok(sellerIds);
	}
}
