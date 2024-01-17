// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { PublicClientApplication } from "@azure/msal-browser";
import { Authority } from "@azure/msal-common";

import CustomNavigationClient from "./custom-navigation-client";

export const setMsalConfig = (idp = {}) => {
  return {
    auth: {
      clientId: idp.client_id,
      authority: idp.authorization_url,
      knownAuthorities: ["unicefpartners.b2clogin.com"],
      validateAuthority: false,
      redirectUri: idp.redirect_uri
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false
    }
  };
};

export const setMsalApp = (msalConfig, forceStandardOidc, historyObj) => {
  if (forceStandardOidc) {
    // This affects a couple of behaviours:
    // The first is the form of the OIDC well-known configuration URI, to which msal appends a non-standard "v2.0"
    // between the issuer and the well-known suffix (when this function returns false)
    // See https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig
    // The second is how msal creates its "client info" structure. If this is false, it expects a non-standard
    // client_info parameter to be returned on the authorization response (standard params:
    // https://openid.net/specs/openid-connect-core-1_0.html#ImplicitAuthResponse)
    // When this returns true, it falls back on creating this structure from the id token, which succeeds
    Authority.isAdfs = () => true;
  }

  const app = new PublicClientApplication(msalConfig);
  const navigationClient = new CustomNavigationClient(historyObj);

  app.setNavigationClient(navigationClient);

  if (forceStandardOidc) {
    // A second situation where it expects a parameter that isn't standard, this time "scope"
    // See https://openid.net/specs/openid-connect-core-1_0.html#ImplicitAuthResponse for standard params
    // Luckily the scopes exist in a claim on the authorization token, which is passed to this function. We can
    // intercept the method call, parse the auth token, and place the extracted scope in the parameters, where msal
    // wants it
    const oldSaveAccessToken = app.saveAccessToken.bind(app);

    app.saveAccessToken = (response, authority, parameters, clientInfo) => {
      if (!parameters.scope) {
        // eslint-disable-next-line no-console
        console.warn("Intercepted problem in msal library, manually putting scope in parameters...");

        try {
          const claimsJsonBase64 = response.accessToken?.split(".")[1];
          const claimsJson = window.atob(claimsJsonBase64 ?? "");

          const claims = JSON.parse(claimsJson || "{}");

          // eslint-disable-next-line no-param-reassign
          parameters.scope = claims.scope;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
            "Cannot obtain scope from access token to fix parameters, setting scopes to 'openid email'",
            response.accessToken,
            error
          );
          // eslint-disable-next-line no-param-reassign
          parameters.scope = "openid email";
        }
      }

      return oldSaveAccessToken(response, authority, parameters, clientInfo);
    };
  }

  return app;
};

export const getLoginRequest = (identityScope, domainHint) => {
  return {
    scopes: identityScope,
    extraQueryParameters: { domain_hint: domainHint }
  };
};

export const getTokenRequest = identityScope => {
  return {
    scopes: identityScope
  };
};
