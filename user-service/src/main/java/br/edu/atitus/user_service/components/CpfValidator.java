package br.edu.atitus.user_service.components;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CpfValidator {

	private static final String CPF_REGEX = "^(?!(\\d)\\1{10})\\d{11}$";

	private static final Pattern CPF_PATTERN = Pattern.compile(CPF_REGEX);

	public static boolean validateCpf(String cpf) {
		if (cpf == null) {
			return false;
		}

		Matcher matcher = CPF_PATTERN.matcher(cpf);
		return matcher.matches();
	}

}
