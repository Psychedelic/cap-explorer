export default {};

export const shouldUseMockup = (env = process.env.MOCKUP) => env && JSON.parse(String(env).toLowerCase())