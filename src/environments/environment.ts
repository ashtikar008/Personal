// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let appDomainPrefix = "localhost:4200";
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
