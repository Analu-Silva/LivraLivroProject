package br.edu.atitus.cart_service.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.edu.atitus.cart_service.clients.BookClient;
import br.edu.atitus.cart_service.clients.BookResponse;
import br.edu.atitus.cart_service.clients.BookImageUrlResponse;
import br.edu.atitus.cart_service.clients.BookGenreResponse;
import br.edu.atitus.cart_service.clients.BookConditionResponse;
import br.edu.atitus.cart_service.clients.BookLanguageResponse;
import br.edu.atitus.cart_service.clients.CurrencyClient;
import br.edu.atitus.cart_service.clients.CurrencyResponse;
import br.edu.atitus.cart_service.dtos.BookDTO;
import br.edu.atitus.cart_service.dtos.GenreDTO;
import br.edu.atitus.cart_service.dtos.BookConditionDTO;
import br.edu.atitus.cart_service.dtos.BookLanguageDTO;
import br.edu.atitus.cart_service.dtos.CartItemResponseDTO;
import br.edu.atitus.cart_service.dtos.CartResponseDTO;
import br.edu.atitus.cart_service.entities.CartEntity;
import br.edu.atitus.cart_service.entities.CartItemEntity;
import br.edu.atitus.cart_service.repositories.CartRepository;
import jakarta.transaction.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final BookClient bookClient;
    private final CurrencyClient currencyClient;

    public CartService(CartRepository cartRepository, BookClient bookClient, CurrencyClient currencyClient) {
        this.cartRepository = cartRepository;
        this.bookClient = bookClient;
        this.currencyClient = currencyClient;
    }

    @Transactional
    public CartEntity getOrCreateCart(UUID userId) {
        Optional<CartEntity> existingCart = cartRepository.findByUserId(userId);
        if (existingCart.isPresent()) {
            return existingCart.get();
        }
        CartEntity newCart = new CartEntity();
        newCart.setUserId(userId);
        return cartRepository.save(newCart);
    }

    @Transactional
    public CartResponseDTO addItemToCart(UUID userId, UUID bookId, Integer quantity) {
        CartEntity cart = getOrCreateCart(userId);
        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }
        
        Optional<CartItemEntity> existingItem = cart.getItems().stream()
                .filter(item -> item.getBookId().equals(bookId)).findFirst();
                
        if (existingItem.isPresent()) {
            CartItemEntity item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItemEntity newItem = new CartItemEntity();
            newItem.setBookId(bookId);
            newItem.setQuantity(quantity);
            newItem.setCart(cart);
            cart.getItems().add(newItem);
        }
        
        CartEntity savedCart = cartRepository.save(cart);
        return convertToCartResponseDTO(savedCart, null);
    }

    @Transactional
    public CartResponseDTO updateItemQuantity(UUID userId, UUID itemId, Integer quantity) {
        CartEntity cart = getOrCreateCart(userId);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        CartItemEntity item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));
                
        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }
        
        CartEntity savedCart = cartRepository.save(cart);
        return convertToCartResponseDTO(savedCart, null);
    }

    @Transactional
    public void removeItemFromCart(UUID userId, UUID itemId) {
        CartEntity cart = getOrCreateCart(userId);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        CartItemEntity item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));
                
        cart.getItems().remove(item);
        cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(UUID userId) {
        CartEntity cart = getOrCreateCart(userId);
        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public CartResponseDTO getCartWithDetails(UUID userId, String targetCurrency) {
        CartEntity cart = getOrCreateCart(userId);
        return convertToCartResponseDTO(cart, targetCurrency);
    }

    private CartResponseDTO convertToCartResponseDTO(CartEntity cart, String targetCurrency) {
        CartResponseDTO response = new CartResponseDTO();
        response.setId(cart.getId());
        
        List<CartItemResponseDTO> itemDTOs = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;
        BigDecimal totalConvertedPrice = BigDecimal.ZERO;
        
        if (cart.getItems() != null) {
            for (CartItemEntity item : cart.getItems()) {
                CartItemResponseDTO itemDTO = convertToCartItemResponseDTO(item, targetCurrency);
                itemDTOs.add(itemDTO);
                
                if (itemDTO.getBook() != null && itemDTO.getBook().getPrice() != null) {
                    BigDecimal itemTotal = itemDTO.getBook().getPrice().multiply(new BigDecimal(itemDTO.getQuantity()));
                    totalPrice = totalPrice.add(itemTotal);
                    
                    if (itemDTO.getBook().getConvertedPrice() != null) {
                        BigDecimal convertedTotal = itemDTO.getBook().getConvertedPrice().multiply(new BigDecimal(itemDTO.getQuantity()));
                        totalConvertedPrice = totalConvertedPrice.add(convertedTotal);
                    }
                }
            }
        }
        
        response.setItems(itemDTOs);
        response.setTotalPrice(totalPrice);
        response.setTotalConvertedPrice(totalConvertedPrice);
        
        return response;
    }

    private CartItemResponseDTO convertToCartItemResponseDTO(CartItemEntity item, String targetCurrency) {
        CartItemResponseDTO itemDTO = new CartItemResponseDTO();
        itemDTO.setId(item.getId());
        itemDTO.setBookId(item.getBookId());
        itemDTO.setQuantity(item.getQuantity());
        itemDTO.setConvertedPrice(item.getConvertedPrice());
        
        if (item.getBookId() != null) {
            try {
                BookResponse bookResponse = bookClient.getBookByIdWithCurrency(item.getBookId(), targetCurrency);
                if (bookResponse != null) {
                    BookDTO bookDTO = convertBookResponseToDTO(bookResponse);
                    itemDTO.setBook(bookDTO);
                    
                    if (bookDTO.getPrice() != null && targetCurrency != null && 
                        !bookDTO.getCurrency().equals(targetCurrency)) {
                        
                        CurrencyResponse currencyResponse = currencyClient.getCurrency(
                            bookDTO.getPrice().doubleValue(),
                            bookDTO.getCurrency(),
                            targetCurrency
                        );
                        
                        itemDTO.setConvertedPrice(currencyResponse.getConvertedValue());
                        bookDTO.setConvertedPrice(currencyResponse.getConvertedValue());
                    } else {
                        itemDTO.setConvertedPrice(bookDTO.getPrice());
                        bookDTO.setConvertedPrice(bookDTO.getPrice());
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("Erro ao buscar livro: " + e.getMessage(), e);
            }
        }
        
        return itemDTO;
    }

    private BookDTO convertBookResponseToDTO(BookResponse bookResponse) {
        BookDTO bookDTO = new BookDTO();
        bookDTO.setId(bookResponse.id());
        bookDTO.setTitle(bookResponse.title());
        bookDTO.setDescription(bookResponse.description());
        bookDTO.setPrice(bookResponse.price());
        bookDTO.setCurrency(bookResponse.currency());
        bookDTO.setNumberOfPages(bookResponse.numberOfPages());
        bookDTO.setNumberOfYears(bookResponse.numberOfYears());
        bookDTO.setIsbn(bookResponse.isbn());
        bookDTO.setPublisher(bookResponse.publisher());
        bookDTO.setStock(bookResponse.stock());
        bookDTO.setSeller(bookResponse.seller());
        bookDTO.setEnviroment(bookResponse.enviroment());
        bookDTO.setConvertedPrice(bookResponse.convertedPrice());
        
        if (bookResponse.imageUrls() != null) {
            List<String> imageUrls = bookResponse.imageUrls().stream()
                    .map(BookImageUrlResponse::imageUrl)
                    .toList();
            bookDTO.setImageUrls(imageUrls);
        }
        
        if (bookResponse.genre() != null) {
            List<GenreDTO> genreDTOs = bookResponse.genre().stream()
                    .map(genreResponse -> {
                        GenreDTO genreDTO = new GenreDTO();
                        genreDTO.setId(genreResponse.id().longValue());
                        genreDTO.setGenre(genreResponse.genre());
                        return genreDTO;
                    })
                    .toList();
            bookDTO.setGenre(genreDTOs);
        }
        
        if (bookResponse.bookCondition() != null) {
            BookConditionDTO conditionDTO = new BookConditionDTO();
            conditionDTO.setId(bookResponse.bookCondition().id().longValue());
            conditionDTO.setCondition(bookResponse.bookCondition().condition());
            bookDTO.setBookCondition(conditionDTO);
        }
        
        if (bookResponse.bookLanguage() != null) {
            BookLanguageDTO languageDTO = new BookLanguageDTO();
            languageDTO.setId(bookResponse.bookLanguage().id().longValue());
            languageDTO.setLanguage(bookResponse.bookLanguage().language());
            bookDTO.setBookLanguage(languageDTO);
        }
        
        return bookDTO;
    }
}