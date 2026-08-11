package com.divya.skynotes.service;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.divya.skynotes.exception.ResourceNotFoundException;
import com.divya.skynotes.model.Note;
import com.divya.skynotes.model.NoteVersion;
import com.divya.skynotes.model.User;
import com.divya.skynotes.repository.NoteRepository;
import com.divya.skynotes.repository.UserRepository;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    public Note createNote(Note note) {

        // Get the logged-in user's email
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        // Find the user from the database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // Set the owner of the note
        note.setUserId(user.getId());

        // Set timestamps
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());

        // Save the note
        return noteRepository.save(note);
    }

    public List<Note> getMyNotes() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return noteRepository.findByUserId(user.getId());
    }

    public Note getNoteById(String id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Note not found"));
    }

    public Note updateNote(String id, Note updatedNote) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Note existingNote = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Note not found"));

        // Save the current version before updating
        NoteVersion previousVersion = new NoteVersion(
                existingNote.getTitle(),
                existingNote.getContent(),
                existingNote.getUpdatedAt()
        );

        existingNote.getVersions().add(previousVersion);

        // Update the note with the new content
        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setContent(updatedNote.getContent());
        existingNote.setUpdatedAt(LocalDateTime.now());

        return noteRepository.save(existingNote);
    }

    public void deleteNote(String id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Note not found"));

        noteRepository.delete(note);
    }
}