package br.edu.atitus.order_service.services;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.edu.atitus.order_service.clients.BookClient;
import br.edu.atitus.order_service.clients.BookResponse;
import br.edu.atitus.order_service.clients.CurrencyClient;
import br.edu.atitus.order_service.clients.CurrencyResponse;
import br.edu.atitus.order_service.entities.OrderEntity;
import br.edu.atitus.order_service.entities.OrderItemEntity;
import br.edu.atitus.order_service.repositories.OrderRepository;

@Service
public class OrderService {

	private final OrderRepository orderRepository;
	private final BookClient bookClient;
	private final CurrencyClient currencyClient;

	public OrderService(OrderRepository orderRepository, BookClient bookClient, CurrencyClient currencyClient) {
		this.orderRepository = orderRepository;
		this.bookClient = bookClient;
		this.currencyClient = currencyClient;
	}

	public OrderEntity createOrder(OrderEntity order, UUID userId) {

		return orderRepository.save(order);
	}

	public Page<OrderEntity> findOrdersByCustomerId(UUID customerId, String targetCurrency, Pageable pageable) {
		Page<OrderEntity> orders = orderRepository.findByCustomerId(customerId, pageable);

		for (OrderEntity order : orders) {
			BigDecimal totalPrice = BigDecimal.ZERO;
			BigDecimal totalConvertedPrice = BigDecimal.ZERO;
			BigDecimal shipping = (order.getShipping() != null) ? order.getShipping() : BigDecimal.ZERO;

			for (OrderItemEntity item : order.getItems()) {
				BookResponse book = bookClient.getBookById(item.getBookId());
				
				item.setBook(book);

				BigDecimal quantity = new BigDecimal(item.getQuantity());
				BigDecimal totalPriceMultiplication = item.getPriceAtPurchase().multiply(quantity);
				totalPrice = totalPrice.add(totalPriceMultiplication);

				CurrencyResponse currencyResponse = currencyClient.getCurrency(item.getPriceAtPurchase(),
						item.getCurrencyAtPurchase(), targetCurrency);
				item.setConvertedPriceAtPruchase(currencyResponse.getConvertedValue());
				BigDecimal totalConvertedPriceMultiplication = item.getConvertedPriceAtPruchase().multiply(quantity);
				totalConvertedPrice = totalConvertedPrice.add(totalConvertedPriceMultiplication);
			}
			order.setTotalPrice(totalPrice.add(shipping));
			order.setTotalConvertedPrice(totalConvertedPrice.add(shipping));
		}
		return orders;
	}
}
