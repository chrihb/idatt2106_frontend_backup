import { createTestingPinia } from "@pinia/testing";

const mockPinia = (options = {}) => {
  return createTestingPinia({
    initialState: options.initialState || {}, // Allow injecting initial state
    createSpy: options.createSpy || vi.fn,   // Allow custom spy function
    ...options,                              // Spread other options
  });
};

export default mockPinia;
