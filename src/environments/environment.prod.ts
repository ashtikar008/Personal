let appDomainPrefix = "step3";
let apiDomainPrefix = "platform-api";
export const environment = {
  production: true,
  auth: {
    domain: 'dev-rnv5rbz4.au.auth0.com',
    clientId: 'wZPdcrP1QlvfpJ52zfpoAWy2OM53757Z',
    // audience: 'wZPdcrP1QlvfpJ52zfpoAWy2OM53757Z'
    audience: 'http://osqo-backend-api/',
  },
  appDomainPrefix: appDomainPrefix,
  apiDomainPrefix: apiDomainPrefix,
  logglyKey: "69fca2ce-15c5-43a6-a2fc-8de28ad36f0b",
  logglyTag: "UI"
};