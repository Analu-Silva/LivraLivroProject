package br.edu.atitus.book_service.clients;

import java.math.BigDecimal;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "currency-service", fallback = CurrencyFallback.class)
public interface CurrencyClient {

	@GetMapping("/currency/{value}/{source}/{target}")
	CurrencyResponse getCurrency(@PathVariable BigDecimal value, @PathVariable String source,
			@PathVariable String target);
}
