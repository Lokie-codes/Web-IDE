package com.codeforge.server.dto;

import lombok.Data;

@Data
public class FileRequest {
    private String path;
    private String content;
    private Boolean isFolder;
    private String parentPath;
}
