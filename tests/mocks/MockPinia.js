import { createTestingPinia } from "@pinia/testing";

const mockPinia = (options = {}) => {
  return createTestingPinia({
    initialState: options.initialState || {},
    createSpy: options.createSpy || vi.fn,
    ...options,
  });
};

export default mockPinia;
