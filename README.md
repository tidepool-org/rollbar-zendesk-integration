# Rollbar-Zendesk integration

Shows the 10 most recent Rollbar errors for a specific requester ticket in the right-hand.

Follow [these instructions](https://develop.zendesk.com/hc/en-us/articles/360001069347) to upload and install Rollbar-Zendesk integration as a private app in Zendesk Support. It will ask you for the following during installation:

- `token`: Project Access Token generated in Rollbar Settings
- `account_name`: Rollbar account name

### Packaging

- Install [zat](https://develop.zendesk.com/hc/en-us/articles/360001075048-Installing-and-using-the-Zendesk-apps-tools)
- Type `zat validate` in the base directory to check that the app is ready to be uploaded
- Type `zat package` to package up the app in the `tmp/` folder, from where it can be uploaded as a private app

### Notes

The Rollbar logo is © 2012-19 Rollbar, Inc.
