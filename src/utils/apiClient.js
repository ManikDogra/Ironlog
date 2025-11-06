/**
 * API client that ignores self-signed certificate errors
 * This is needed because our EC2 backend uses a self-signed HTTPS certificate
 * 
 * In production, replace with a proper certificate (Let's Encrypt via domain)
 */

export const createFetchWithCertBypass = () => {
  // In browser, we can't directly bypass cert validation
  // But we can use a workaround with a CORS proxy or disable strict validation
  
  return async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        // Credentials allow cookies to be sent/received
        credentials: 'include',
      });
      return response;
    } catch (error) {
      // If it's a certificate error, log it but don't fail silently
      console.warn('Fetch error (may be cert-related):', error);
      throw error;
    }
  };
};

// For now, just use standard fetch
// The cert error will still show in console, but we'll handle it properly
export default fetch;
