package br.edu.atitus.book_service.clients;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

@Component
public class CurrencyFallback implements CurrencyClient {

	@Override
	public CurrencyResponse getCurrency(BigDecimal value, String source, String target) {
		return null;
	}
}
