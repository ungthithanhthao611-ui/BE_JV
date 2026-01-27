package com.example.demo.controller;

import com.example.demo.entity.Category;
import com.example.demo.repository.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
// @CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    // ✅ GET ALL
    @GetMapping
    public List<Category> getAll() {
        return repo.findAll();
    }

    // ✅ GET BY ID (SỬA getById → findById)
    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        Category cat = repo.findById(id);
        if (cat == null) {
            throw new RuntimeException("Category not found with id = " + id);
        }
        return cat;
    }

    // ✅ CREATE
    @PostMapping
    public void create(@RequestBody Category cat) {
        repo.save(cat);
    }

    // ✅ UPDATE (ĐÚNG VỚI JDBC REPO)
    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody Category cat) {
        repo.update(id, cat);
    }

    // ✅ DELETE (SOFT DELETE)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.delete(id);
    }
}
