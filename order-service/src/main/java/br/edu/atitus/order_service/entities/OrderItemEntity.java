package br.edu.atitus.order_service.entities;

import java.math.BigDecimal;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.edu.atitus.order_service.clients.ProductResponse;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "tb_order_item")
public class OrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // ID do produto vindo do product-service
    @Column(nullable = false)
    private UUID productId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal priceAtPurchase; // guarda o preço no momento da compra

    @Column(nullable = false)
    private String currencyAtPurchase; // guarda a moeda no momento da compra
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private OrderEntity order;

    @Transient
    private ProductResponse product; // preenchido via chamada REST

    @Transient
    private BigDecimal convertedPriceAtPruchase; 
    
	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public UUID getProductId() {
		return productId;
	}

	public void setProductId(UUID productId) {
		this.productId = productId;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public BigDecimal getPriceAtPurchase() {
		return priceAtPurchase;
	}

	public void setPriceAtPurchase(BigDecimal priceAtPurchase) {
		this.priceAtPurchase = priceAtPurchase;
	}

	public String getCurrencyAtPurchase() {
		return currencyAtPurchase;
	}

	public void setCurrencyAtPurchase(String currencyAtPurchase) {
		this.currencyAtPurchase = currencyAtPurchase;
	}

	public OrderEntity getOrder() {
		return order;
	}

	public void setOrder(OrderEntity order) {
		this.order = order;
	}

	public ProductResponse getProduct() {
		return product;
	}

	public void setProduct(ProductResponse product) {
		this.product = product;
	}

	public BigDecimal getConvertedPriceAtPruchase() {
		return convertedPriceAtPruchase;
	}

	public void setConvertedPriceAtPruchase(BigDecimal convertedPriceAtPruchase) {
		this.convertedPriceAtPruchase = convertedPriceAtPruchase;
	}

    
}
