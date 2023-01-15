The Airtable API key should be set using `wrangler secret`, a subcommand of `wrangler` for setting _encrypted environment varibles_. Run `wrangler secret put` as seen below, and paste in your API key:

```sh
$ wrangler secret put AIRTABLE_API_KEY
Enter the secret text you would like assigned to the variable AIRTABLE_API_KEY on the script named airtable-form-handler:
******
🌀  Creating the secret for script name airtable-form-handler
✨  Success! Uploaded secret AIRTABLE_API_KEY.
```
