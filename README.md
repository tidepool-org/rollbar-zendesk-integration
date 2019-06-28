# Rollbar-Zendesk integration

Shows the 10 most recent Rollbar errors for a specific requester ticket in the right-hand.

Follow [these instructions](https://develop.zendesk.com/hc/en-us/articles/360001069347) to upload and install Rollbar-Zendesk integration as a private app in Zendesk Support. It will ask you for a token during installation - use a Project Access Token generated in Rollbar Settings.

### Packaging

- Install [zat](https://develop.zendesk.com/hc/en-us/articles/360001075048-Installing-and-using-the-Zendesk-apps-tools)
- Type `zat package` in the base directory to package up the app in the `tmp/` folder, from where it can be uploaded as a private app

### Notes

The Rollbar logo is © 2012-19 Rollbar, Inc.
