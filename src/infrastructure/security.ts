// Security and Advanced Validations
import { z } from 'zod';
import type { Result } from '../application/usecases';

// Security configuration
export const SECURITY_CONFIG = {
  MAX_INPUT_LENGTH: 1000,
  ALLOWED_HTML_TAGS: ['b', 'i', 'em', 'strong', 'span'],
  XSS_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi
  ],
  SQL_INJECTION_PATTERNS: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(--|\*\/|\/\*)/g,
    /('|(\\')|('')|(%27))/gi
  ]
};

// Sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove potential XSS attacks
  let sanitized = input.trim();
  
  // Remove script tags and dangerous attributes
  SECURITY_CONFIG.XSS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Remove potential SQL injection
  SECURITY_CONFIG.SQL_INJECTION_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Limit length
  if (sanitized.length > SECURITY_CONFIG.MAX_INPUT_LENGTH) {
    sanitized = sanitized.substring(0, SECURITY_CONFIG.MAX_INPUT_LENGTH);
  }
  
  return sanitized;
};

// Advanced validation schemas
export const SecurityValidationSchema = z.object({
  categoryId: z.string()
    .min(1, 'Category ID is required')
    .max(50, 'Category ID too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid category ID format')
    .transform(sanitizeInput),
    
  subCategoryId: z.string()
    .max(50, 'Subcategory ID too long')
    .regex(/^[a-zA-Z0-9_-]*$/, 'Invalid subcategory ID format')
    .transform(sanitizeInput)
    .optional(),
    
  searchTerm: z.string()
    .max(100, 'Search term too long')
    .transform(sanitizeInput)
    .optional(),
    
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .transform(sanitizeInput)
    .optional()
});

// Rate limiting interface
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (identifier: string) => string;
}

export class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  
  constructor(private config: RateLimitConfig) {}
  
  isAllowed(identifier: string): boolean {
    const key = this.config.keyGenerator?.(identifier) || identifier;
    const now = Date.now();
    const existing = this.requests.get(key);
    
    if (!existing || now > existing.resetTime) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return true;
    }
    
    if (existing.count >= this.config.maxRequests) {
      return false;
    }
    
    existing.count++;
    return true;
  }
  
  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

// CSRF protection utilities
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken && token.length === 64;
};

// Content Security Policy headers
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Custom error types for security
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'VALIDATION_ERROR',
    public readonly details: Array<{ field: string; message: string; code: string }> = []
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Input validation middleware
export const validateAndSanitize = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): Result<T> => {
  try {
    const validated = schema.parse(data);
    return {
      success: true,
      data: validated
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: new ValidationError(
          'Validation failed',
          'VALIDATION_ERROR',
          error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        )
      };
    }
    
    return {
      success: false,
      error: new ValidationError('Unknown validation error', 'UNKNOWN_ERROR')
    };
  }
};

// Security audit logging
export interface SecurityEvent {
  type: 'XSS_ATTEMPT' | 'SQL_INJECTION_ATTEMPT' | 'RATE_LIMIT_EXCEEDED' | 'CSRF_INVALID' | 'VALIDATION_FAILED';
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  details: Record<string, unknown>;
}

export class SecurityLogger {
  private events: SecurityEvent[] = [];
  
  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };
    
    this.events.push(securityEvent);
    
    // In production, send to external logging service
    if (import.meta.env.PROD) {
      console.warn('Security Event:', securityEvent);
    }
  }
  
  getEvents(): SecurityEvent[] {
    return [...this.events];
  }
  
  clear(): void {
    this.events = [];
  }
}

// Export singleton instance
export const securityLogger = new SecurityLogger();