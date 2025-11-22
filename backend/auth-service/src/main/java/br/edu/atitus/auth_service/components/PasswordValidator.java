package br.edu.atitus.auth_service.components;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PasswordValidator {

	private static final String PASSWORD_REGEX = "^(?=.*\\p{Lu})(?=.*\\p{Ll})(?=.*\\d)(?=.*[^\\p{L}\\p{N}]).{8,256}$";

	private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

	public static boolean validatePassword(String password) {
		if (password == null) {
			return false;
		}

		Matcher matcher = PASSWORD_PATTERN.matcher(password);
		return matcher.matches();
	}

}