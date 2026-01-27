package com.example.demo.controller;

import com.example.demo.dto.ContactRequest;
import com.example.demo.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
// @CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<?> submitContact(@RequestBody ContactRequest request) {
        contactService.createContact(request);
        return ResponseEntity.ok("Message sent successfully");
    }

    @GetMapping
    public java.util.List<com.example.demo.entity.Contact> getAllContacts() {
        return contactService.getAllContacts();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        contactService.updateStatus(id, status);
        return ResponseEntity.ok("Status updated");
    }
}
