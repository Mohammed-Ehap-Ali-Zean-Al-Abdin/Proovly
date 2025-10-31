// Ensure necessary env vars are present before modules are loaded by tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
