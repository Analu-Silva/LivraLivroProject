package br.edu.atitus.currency_service.clients;

import java.math.BigDecimal;
import java.util.List;

public class CurrencyBCResponse {

	private List<values> value;

	public List<values> getValue() {
		return value;
	}

	public void setValue(List<values> value) {
		this.value = value;
	}

	public static class values {
		private BigDecimal cotacaoVenda;

		public BigDecimal getCotacaoVenda() {
			return cotacaoVenda;
		}

		public void setCotacaoVenda(BigDecimal cotacaoVenda) {
			this.cotacaoVenda = cotacaoVenda;
		}
	}
}