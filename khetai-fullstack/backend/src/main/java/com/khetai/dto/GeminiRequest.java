package com.khetai.dto;

import java.util.List;

public class GeminiRequest {

    private List<Content> contents;

    public GeminiRequest() {}

    public GeminiRequest(List<Content> contents) {
        this.contents = contents;
    }

    public List<Content> getContents() {
        return contents;
    }

    public void setContents(List<Content> contents) {
        this.contents = contents;
    }

    public static class Content {
        private List<Part> parts;

        public Content() {}

        public Content(List<Part> parts) {
            this.parts = parts;
        }

        public List<Part> getParts() {
            return parts;
        }

        public void setParts(List<Part> parts) {
            this.parts = parts;
        }
    }

    public static class Part {
        private String text;
        private InlineData inlineData;

        public Part() {}

        public Part(String text) {
            this.text = text;
        }

        public Part(InlineData inlineData) {
            this.inlineData = inlineData;
        }

        public Part(String text, InlineData inlineData) {
            this.text = text;
            this.inlineData = inlineData;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public InlineData getInlineData() {
            return inlineData;
        }

        public void setInlineData(InlineData inlineData) {
            this.inlineData = inlineData;
        }
    }

    public static class InlineData {
        private String mimeType;
        private String data;

        public InlineData() {}

        public InlineData(String mimeType, String data) {
            this.mimeType = mimeType;
            this.data = data;
        }

        public String getMimeType() {
            return mimeType;
        }

        public void setMimeType(String mimeType) {
            this.mimeType = mimeType;
        }

        public String getData() {
            return data;
        }

        public void setData(String data) {
            this.data = data;
        }
    }
}
