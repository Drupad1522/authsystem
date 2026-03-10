package com.drupad.project.authsystem.config;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */

@Component
public class IdGenerator implements IdentifierGenerator {
    @Override
    public Object generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object o) {
        return UUID.randomUUID().toString().replace("-","").substring(0,26);
    }
    public static String generateID(){
        return UUID.randomUUID().toString().replace("-","").substring(0,26);
    }

}
