package com.example.demo.service.impl;

import com.example.demo.dto.ContactRequest;
import com.example.demo.entity.Contact;
import com.example.demo.repository.ContactRepository;
import com.example.demo.service.ContactService;
import org.springframework.stereotype.Service;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void createContact(ContactRequest request) {
        Contact contact = new Contact();
        contact.setUserId(request.getUserId());
        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setTitle(request.getTitle());
        contact.setContent(request.getContent());

        contactRepository.save(contact);
    }

    @Override
    public java.util.List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @Override
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        contactRepository.updateStatus(id, status);
    }
}
