package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseInitializer {

    @Bean
    public CommandLineRunner initDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            System.out.println(">>> CHECKING DATABASE SCHEMA...");

            // 1. Create favorites table if not exists
            try {
                jdbcTemplate.execute("""
                            CREATE TABLE IF NOT EXISTS favorites (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                user_id BIGINT NOT NULL,
                                product_id BIGINT NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                                FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
                                UNIQUE KEY unique_fav (user_id, product_id)
                            )
                        """);
                System.out.println(">>> TABLE 'favorites' CHECKED/CREATED.");
            } catch (Exception e) {
                System.out.println(">>> Error creating favorites table: " + e.getMessage());
            }

            // 2. Add reset_token column to users if not exists
            try {
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL");
                System.out.println(">>> COLUMN 'reset_token' ADDED.");
            } catch (Exception e) {
                // Ignore if column exists
                if (!e.getMessage().toLowerCase().contains("duplicate column")) {
                    System.out.println(">>> Note on reset_token: " + e.getMessage());
                }
            }

            // 3. Update users table columns (full_name, phone, etc)
            // This is trickier because it fails if column doesn't exist to change, or if
            // exists.
            // Let's try adding columns safely.
            String[] addCols = {
                    "ALTER TABLE users ADD COLUMN phone VARCHAR(20)",
                    "ALTER TABLE users ADD COLUMN address TEXT",
                    "ALTER TABLE users ADD COLUMN avatar VARCHAR(255)",
                    "ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'USER'"
            };

            for (String sql : addCols) {
                try {
                    jdbcTemplate.execute(sql);
                } catch (Exception e) {
                    // Ignore duplicate column errors
                }
            }

            // Try renaming name -> full_name
            try {
                jdbcTemplate.execute("ALTER TABLE users CHANGE COLUMN name full_name VARCHAR(255)");
            } catch (Exception e) {
                // Ignore if unknown column 'name' (already changed) or other issues
            }

            System.out.println(">>> DATABASE SCHEMA CHECK COMPLETE.");
        };
    }
}
