package com.divya.skynotes.controller;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.divya.skynotes.model.Note;
import com.divya.skynotes.service.NoteService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping
    public ResponseEntity<Note> createNote(@Valid @RequestBody Note note) {

        Note savedNote = noteService.createNote(note);

        return new ResponseEntity<>(savedNote, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Note>> getMyNotes() {

        List<Note> notes = noteService.getMyNotes();

        return ResponseEntity.ok(notes);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable String id) {

        Note note = noteService.getNoteById(id);

        return ResponseEntity.ok(note);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(
            @PathVariable String id,
            @Valid @RequestBody Note updatedNote) {

        Note note = noteService.updateNote(id, updatedNote);

        return ResponseEntity.ok(note);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable String id) {

        noteService.deleteNote(id);

        return ResponseEntity.noContent().build();
    }
}