package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

/**
 * ============================================
 * HATEOAS Controller - YÊU CẦU ĐỀ BÀI
 * ============================================
 * Controller này demo HATEOAS (Hypermedia as the Engine of Application State)
 * Kết quả JSON sẽ bao gồm:
 * - Dữ liệu thực tế
 * - Links (self, all-products, category, update, delete, etc.)
 */
@RestController
@RequestMapping("/api/hateoas/products")
// @CrossOrigin(origins = "http://localhost:5173")
public class ProductHateoasController {

    private final ProductService service;

    public ProductHateoasController(ProductService service) {
        this.service = service;
    }

    /**
     * GET: /api/hateoas/products/{id}
     * Trả về 1 sản phẩm với HATEOAS links
     */
    @GetMapping("/{id}")
    public EntityModel<Product> getById(@PathVariable Long id) {
        Product product = service.getById(id);
        
        // Tạo EntityModel với links
        EntityModel<Product> model = EntityModel.of(product);
        
        // Link tới chính nó (self)
        model.add(linkTo(methodOn(ProductHateoasController.class).getById(id)).withSelfRel());
        
        // Link tới danh sách tất cả sản phẩm
        model.add(linkTo(methodOn(ProductHateoasController.class).getAll()).withRel("all-products"));
        
        // Link tới danh sách sản phẩm cùng category
        if (product.getCategoryId() != null) {
            model.add(linkTo(methodOn(ProductHateoasController.class)
                .getByCategory(product.getCategoryId())).withRel("same-category"));
        }
        
        // Link update và delete
        model.add(linkTo(methodOn(ProductHateoasController.class).getById(id)).withRel("update"));
        model.add(linkTo(methodOn(ProductHateoasController.class).getById(id)).withRel("delete"));
        
        return model;
    }

    /**
     * GET: /api/hateoas/products
     * Trả về danh sách sản phẩm với HATEOAS links
     */
    @GetMapping
    public CollectionModel<EntityModel<Product>> getAll() {
        List<EntityModel<Product>> products = service.getActive(null).stream()
            .map(product -> {
                EntityModel<Product> model = EntityModel.of(product);
                model.add(linkTo(methodOn(ProductHateoasController.class)
                    .getById(product.getId())).withSelfRel());
                return model;
            })
            .collect(Collectors.toList());
        
        // Link tới collection
        Link selfLink = linkTo(methodOn(ProductHateoasController.class).getAll()).withSelfRel();
        
        return CollectionModel.of(products, selfLink);
    }

    /**
     * GET: /api/hateoas/products/category/{categoryId}
     * Lấy sản phẩm theo category với HATEOAS
     */
    @GetMapping("/category/{categoryId}")
    public CollectionModel<EntityModel<Product>> getByCategory(@PathVariable Long categoryId) {
        List<EntityModel<Product>> products = service.getActive(categoryId).stream()
            .map(product -> {
                EntityModel<Product> model = EntityModel.of(product);
                // Self link cho mỗi sản phẩm
                model.add(linkTo(methodOn(ProductHateoasController.class)
                    .getById(product.getId())).withSelfRel());
                // Link về category hiện tại
                model.add(linkTo(methodOn(ProductHateoasController.class)
                    .getByCategory(categoryId)).withRel("current-category"));
                return model;
            })
            .collect(Collectors.toList());
        
        // Collection links
        Link selfLink = linkTo(methodOn(ProductHateoasController.class)
            .getByCategory(categoryId)).withSelfRel();
        Link allProductsLink = linkTo(methodOn(ProductHateoasController.class)
            .getAll()).withRel("all-products");
        
        return CollectionModel.of(products, selfLink, allProductsLink);
    }

    /**
     * GET: /api/hateoas/products/search?q=keyword
     * Tìm kiếm với HATEOAS
     */
    @GetMapping("/search")
    public CollectionModel<EntityModel<Product>> search(
            @RequestParam("q") String keyword,
            @RequestParam(required = false) Long categoryId
    ) {
        List<EntityModel<Product>> products = service.search(keyword, categoryId).stream()
            .map(product -> {
                EntityModel<Product> model = EntityModel.of(product);
                model.add(linkTo(methodOn(ProductHateoasController.class)
                    .getById(product.getId())).withSelfRel());
                return model;
            })
            .collect(Collectors.toList());
        
        // Self link
        Link selfLink = linkTo(methodOn(ProductHateoasController.class)
            .search(keyword, categoryId)).withSelfRel();
        
        return CollectionModel.of(products, selfLink);
    }
}
