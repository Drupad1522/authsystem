package com.drupad.project.authsystem.entity;

import com.drupad.project.authsystem.config.IdGenerator;
import com.drupad.project.authsystem.util.DbConstants;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.*;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
@Getter
@Setter
@ToString
@MappedSuperclass
public abstract class BaseEntity {

    @Column(name= DbConstants.COLUMN_CREATED_AT)
    private Long createdAt;

    @Column(name = DbConstants.COLUMN_MODIFIED_AT)
    private Long modifiedAt;

    @PrePersist
    protected void onCreate(){
        createdAt=System.currentTimeMillis();
        modifiedAt=System.currentTimeMillis();
        generateIdIfNull();
    }

    private void generateIdIfNull() {
        if(getId()==null){setId(IdGenerator.generateID());}
    }

    protected abstract void setId(String s);


    protected abstract String getId();


}
