import * as Rollbar from "rollbar";

const environment = process.env.RAILS_ENV;
console.log("env", environment);
export default new Rollbar({
  enabled: environment === "production",
  accessToken: "086ed6a0d2f14f30aa2fa02588ef150f",
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: { environment }
});
