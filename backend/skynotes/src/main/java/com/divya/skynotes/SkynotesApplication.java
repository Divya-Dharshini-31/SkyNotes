package com.divya.skynotes;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class SkynotesApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkynotesApplication.class, args);
    }

    @Bean
    CommandLineRunner printMongoUri(Environment environment) {
        return args -> {
            System.out.println("======================================");
            System.out.println("Mongo URI: " + environment.getProperty("spring.data.mongodb.uri"));
            System.out.println("======================================");
        };
    }
}