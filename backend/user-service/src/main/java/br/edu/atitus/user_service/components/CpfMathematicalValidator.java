package br.edu.atitus.user_service.components;

public class CpfMathematicalValidator {

	public static boolean validateMathCpf(String cpf) {

		String nineDigits = cpf.substring(0, 9);
		char[] nineDigitsArray = nineDigits.toCharArray();
		Integer regressiveCounterOne = 10;
		Integer digitOneResult = 0;

		for (char digit : nineDigitsArray) {
			digitOneResult += Character.getNumericValue(digit) * regressiveCounterOne;
			regressiveCounterOne -= 1;
		}

		Integer digitOneAfterFor = (digitOneResult * 10) % 11;

		if (digitOneAfterFor > 9) {
			digitOneAfterFor = 0;
		}

		String tenDigits = nineDigits + digitOneAfterFor.toString();
		Integer regressiveCounterTwo = 11;
		Integer digitTwoResult = 0;

		char[] tenDigitsArray = tenDigits.toCharArray();

		for (char digit : tenDigitsArray) {
			digitTwoResult += Character.getNumericValue(digit) * regressiveCounterTwo;
			regressiveCounterTwo -= 1;
		}

		Integer digitTwoAfterFor = (digitTwoResult * 10) % 11;

		if (digitTwoAfterFor > 9) {
			digitTwoAfterFor = 0;
		}

		String verifiedCpfByOperation = nineDigits + digitOneAfterFor + digitTwoAfterFor;

		return cpf.equals(verifiedCpfByOperation) ? true : false;
	}
}
