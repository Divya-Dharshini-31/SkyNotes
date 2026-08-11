package com.divya.skynotes.repository;

import java.util.*;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.divya.skynotes.model.Note;

public interface NoteRepository extends MongoRepository<Note, String> {

    List<Note> findByUserId(String userId);
    Optional<Note> findByIdAndUserId(String id, String userId);

}