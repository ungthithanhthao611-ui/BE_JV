package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import com.example.demo.service.impl.ProductServiceImpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * ============================================
 * PRODUCT SERVICE TEST - YÊU CẦU ĐỀ BÀI
 * ============================================
 * Unit tests cho ProductService
 * Demo testing với JUnit 5 + Mockito
 * Tổng cộng: 10 tests
 */
@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository repository;

    @InjectMocks
    private ProductServiceImpl service;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product();
        sampleProduct.setId(1L);
        sampleProduct.setTitle("Trà Sữa Trân Châu");
        sampleProduct.setPrice(45000.0);
        sampleProduct.setQty(50);
        sampleProduct.setCategoryId(1L);
    }

    /**
     * ============================================
     * TEST 1: TÌM SẢN PHẨM THEO ID - THÀNH CÔNG
     * ============================================
     */
    @Test
    void testGetById_WhenProductExists_ShouldReturnProduct() {
        // Arrange
        when(repository.findById(1L)).thenReturn(sampleProduct);

        // Act
        Product result = service.getById(1L);

        // Assert
        assertNotNull(result, "Product should not be null");
        assertEquals(1L, result.getId(), "Product ID should match");
        assertEquals("Trà Sữa Trân Châu", result.getTitle(), "Product title should match");
        verify(repository, times(1)).findById(1L);

        System.out.println("✅ TEST 1 PASSED: Tìm sản phẩm theo ID thành công (Có kết quả)");
    }

    /**
     * ============================================
     * TEST 2: TÌM SẢN PHẨM THEO ID - KHÔNG TÌM THẤY
     * ============================================
     */
    @Test
    void testGetById_WhenProductNotExists_ShouldReturnNull() {
        // Arrange
        when(repository.findById(999L)).thenReturn(null);

        // Act
        Product result = service.getById(999L);

        // Assert
        assertNull(result, "Product should be null when not found");
        verify(repository, times(1)).findById(999L);

        System.out.println("✅ TEST 2 PASSED: Tìm sản phẩm theo ID thành công (Không tìm thấy - Trả về Null)");
    }

    /**
     * ============================================
     * TEST 3: LẤY DANH SÁCH SẢN PHẨM ACTIVE
     * ============================================
     */
    @Test
    void testGetActive_ShouldReturnListOfActiveProducts() {
        // Arrange
        Product product2 = new Product();
        product2.setId(2L);
        product2.setTitle("Trà Đào");
        product2.setPrice(40000.0);

        List<Product> mockProducts = Arrays.asList(sampleProduct, product2);
        when(repository.findActive(null)).thenReturn(mockProducts);

        // Act
        List<Product> result = service.getActive(null);

        // Assert
        assertNotNull(result, "Result should not be null");
        assertEquals(2, result.size(), "Should return 2 products");
        verify(repository, times(1)).findActive(null);

        System.out.println("✅ TEST 3 PASSED: Get active products list");
    }

    /**
     * ============================================
     * TEST 4: FILTER SẢN PHẨM THEO CATEGORY
     * ============================================
     */
    @Test
    void testGetActive_WithCategoryId_ShouldReturnFilteredProducts() {
        // Arrange
        Long categoryId = 1L;
        List<Product> mockProducts = Arrays.asList(sampleProduct);
        when(repository.findActive(categoryId)).thenReturn(mockProducts);

        // Act
        List<Product> result = service.getActive(categoryId);

        // Assert
        assertNotNull(result, "Result should not be null");
        assertEquals(1, result.size(), "Should return 1 product");
        assertEquals(categoryId, result.get(0).getCategoryId(), "Category ID should match");
        verify(repository, times(1)).findActive(categoryId);

        System.out.println("✅ TEST 4 PASSED: Filter products by category");
    }

    /**
     * ============================================
     * TEST 5: TÌM KIẾM THEO KEYWORD
     * ============================================
     */
    @Test
    void testSearch_WithKeyword_ShouldReturnMatchingProducts() {
        // Arrange
        String keyword = "Trà";
        List<Product> mockProducts = Arrays.asList(sampleProduct);
        when(repository.searchActive(keyword, null)).thenReturn(mockProducts);

        // Act
        List<Product> result = service.search(keyword, null);

        // Assert
        assertNotNull(result, "Result should not be null");
        assertEquals(1, result.size(), "Should return 1 matching product");
        assertTrue(result.get(0).getTitle().contains("Trà"), "Title should contain keyword");
        verify(repository, times(1)).searchActive(keyword, null);

        System.out.println("✅ TEST 5 PASSED: Search by keyword");
    }

    /**
     * ============================================
     * TEST 6: SOFT DELETE
     * ============================================
     */
    @Test
    void testDelete_ShouldCallRepositorySoftDelete() {
        // Arrange
        Long productId = 1L;
        doNothing().when(repository).softDelete(productId);

        // Act
        service.delete(productId);

        // Assert
        verify(repository, times(1)).softDelete(productId);

        System.out.println("✅ TEST 6 PASSED: Soft delete");
    }

    /**
     * ============================================
     * TEST 7: RESTORE TỪ TRASH
     * ============================================
     */
    @Test
    void testRestore_ShouldCallRepositoryRestore() {
        // Arrange
        Long productId = 1L;
        doNothing().when(repository).restore(productId);

        // Act
        service.restore(productId);

        // Assert
        verify(repository, times(1)).restore(productId);

        System.out.println("✅ TEST 7 PASSED: Restore from trash");
    }

    /**
     * ============================================
     * TEST 8: FORCE DELETE
     * ============================================
     */
    @Test
    void testForceDelete_ShouldCallRepositoryForceDelete() {
        // Arrange
        Long productId = 1L;
        doNothing().when(repository).forceDelete(productId);

        // Act
        service.forceDelete(productId);

        // Assert
        verify(repository, times(1)).forceDelete(productId);

        System.out.println("✅ TEST 8 PASSED: Force delete");
    }

    /**
     * ============================================
     * TEST 9: KIỂM TRA TỒN TẠI
     * ============================================
     */
    @Test
    void testExists_WhenProductExists_ShouldReturnTrue() {
        // Arrange
        when(repository.findById(1L)).thenReturn(sampleProduct);

        // Act
        boolean result = service.exists(1L);

        // Assert
        assertTrue(result, "Should return true when product exists");
        verify(repository, times(1)).findById(1L);

        System.out.println("✅ TEST 9 PASSED: Check exists - true");
    }

    /**
     * ============================================
     * TEST 10: KIỂM TRA KHÔNG TỒN TẠI
     * ============================================
     */
    @Test
    void testExists_WhenProductNotExists_ShouldReturnFalse() {
        // Arrange
        when(repository.findById(999L)).thenReturn(null);

        // Act
        boolean result = service.exists(999L);

        // Assert
        assertFalse(result, "Should return false when product not exists");
        verify(repository, times(1)).findById(999L);

        System.out.println("✅ TEST 10 PASSED: Check exists - false");
    }
}
