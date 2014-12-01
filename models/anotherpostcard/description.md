another postcard (draft)
========

unencrypted mail is *always* reply all

## model description

This model looks for unencrypted smtp/imap/pop traffic, if there is still any left out there. If it finds any, it sighs deeply and notifies the user.

### traffic definition

- protocols: smtp, imap, pop
- packet body of above

### alert condition

Model alerts if packet body of above protocols does not carry encrypted header.

## report layout

- source and destination domain
- offending protocol
- short explanation
- link to recommended alternatives
