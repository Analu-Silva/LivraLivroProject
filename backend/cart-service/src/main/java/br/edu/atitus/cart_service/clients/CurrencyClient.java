package br.edu.atitus.cart_service.clients;

import java.math.BigDecimal;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "currency-service")
public interface CurrencyClient {

	@GetMapping("/currency/{value}/{fromCurrency}/{toCurrency}")
	CurrencyResponse getCurrency(@PathVariable BigDecimal value, @PathVariable String fromCurrency,
			@PathVariable String toCurrency);
}

