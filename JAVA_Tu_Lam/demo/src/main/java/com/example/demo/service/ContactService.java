package com.example.demo.service;

import com.example.demo.dto.ContactRequest;

public interface ContactService {
    void createContact(ContactRequest request);

    java.util.List<com.example.demo.entity.Contact> getAllContacts();

    void deleteContact(Long id);

    void updateStatus(Long id, Integer status);
}
