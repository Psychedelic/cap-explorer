export const qsE2ETestRunner = 'e2e-test-runner';

export const isE2ETestRunner = () => {
  if (process.env.NODE_ENV === 'production') return false;

  if (process.env.E2E_TEST_RUNNER || process.env.STAGING_BUILDER) return true;

  //  When non-DOM environment
  if (typeof window === 'undefined') return false;

  return window.location.search.includes(qsE2ETestRunner);
};
