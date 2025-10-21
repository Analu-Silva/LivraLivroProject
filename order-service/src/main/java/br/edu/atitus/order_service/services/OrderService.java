package br.edu.atitus.order_service.services;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.edu.atitus.order_service.clients.CurrencyClient;
import br.edu.atitus.order_service.clients.CurrencyResponse;
import br.edu.atitus.order_service.clients.ProductClient;
import br.edu.atitus.order_service.clients.ProductResponse;
import br.edu.atitus.order_service.entities.OrderEntity;
import br.edu.atitus.order_service.entities.OrderItemEntity;
import br.edu.atitus.order_service.repositories.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final CurrencyClient currencyClient;

    public OrderService(OrderRepository orderRepository, ProductClient productClient, CurrencyClient currencyClient) {
        this.orderRepository = orderRepository;
        this.productClient = productClient;
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
        
            for (OrderItemEntity item : order.getItems()) {
                ProductResponse product = productClient.getProductById(item.getProductId());
                item.setProduct(product);
                
                BigDecimal quantity = new BigDecimal(item.getQuantity()); 
                BigDecimal totalPriceMultiplication = item.getPriceAtPurchase().multiply(quantity);
                totalPrice = totalPrice.add(totalPriceMultiplication);
                
                CurrencyResponse currencyResponse = currencyClient.getCurrency(
						item.getPriceAtPurchase(), item.getCurrencyAtPurchase(), targetCurrency);
                item.setConvertedPriceAtPruchase(currencyResponse.getConvertedValue());
                BigDecimal totalConvertedPriceMultiplication = item.getConvertedPriceAtPruchase().multiply(quantity);
                totalConvertedPrice = totalConvertedPrice.add(totalConvertedPriceMultiplication);
            }
            order.setTotalPrice(totalPrice);
            order.setTotalConvertedPrice(totalConvertedPrice);
        }
        return orders;
    }
}
