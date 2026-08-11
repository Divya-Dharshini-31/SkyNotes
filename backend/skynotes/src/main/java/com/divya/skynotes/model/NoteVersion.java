package com.divya.skynotes.model;

import java.time.LocalDateTime;

public class NoteVersion {

    private String title;

    private String content;

    private LocalDateTime updatedAt;

    public NoteVersion() {
    }

    public NoteVersion(String title, String content, LocalDateTime updatedAt) {
        this.title = title;
        this.content = content;
        this.updatedAt = updatedAt;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}