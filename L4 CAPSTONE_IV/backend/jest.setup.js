// jest.setup.js
beforeAll(() => {
    process.env.PORT = 3003; // Use a different port for testing, e.g., 3003
  });
  
  afterAll(() => {
    delete process.env.PORT;
  });
  