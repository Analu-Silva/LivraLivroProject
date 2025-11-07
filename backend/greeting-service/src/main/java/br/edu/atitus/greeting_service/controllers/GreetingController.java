package br.edu.atitus.greeting_service.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.greeting_service.configs.GreetingConfig;
import br.edu.atitus.greeting_service.dtos.GreetingDTO;

@RestController
@RequestMapping("greeting")
public class GreetingController {

//	@Value("${greeting-service.greeting}")
//	private String greeting;
//	@Value("${greeting-service.default-name}")
//	private String defaultName;

	private final GreetingConfig config;

	public GreetingController(GreetingConfig config) {
		super();
		this.config = config;
	}

	public String greetBuilder(String name) {
		String greetingReturn = config.getGreeting();// Era greeting
		String nameReturn = name != null ? name : config.getDefaultName(); // Era defaultName
		String textReturn = String.format("%s,  %s !!!", greetingReturn, nameReturn);
		return textReturn;
	}

	@GetMapping({ "/{name}", "/" })
	public ResponseEntity<String> greetPath(@PathVariable(required = false) String name) {
		return ResponseEntity.ok(greetBuilder(name));
	}

	@GetMapping()
	public ResponseEntity<String> greetParam(@RequestParam(required = false) String name) {
		return ResponseEntity.ok(greetBuilder(name));
	}

	@PostMapping
	public ResponseEntity<String> save(@RequestBody GreetingDTO dto) {
		String greetingReturn = config.getGreeting();
		String nameReturn = dto.name();
		String textReturn = String.format("%s,  %s !!!", greetingReturn, nameReturn);
		return ResponseEntity.ok(textReturn);
	}
}
