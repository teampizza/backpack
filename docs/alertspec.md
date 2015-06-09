# alert specification (draft)

## Backend

In the backend, alerts consist of documents contained in the `alerts` collection
in the database. They must include a specific set of elements to be used by the
UI+frontend.

### Elements ###

- User-controlled
    - User decision
    - Alert status
- Modeler-controlled
    - Model info
    - Source/referrer URL
    - Timestamp
    - Alert status

## Frontend

In the frontend, alerts are viewed in two ways: through a dynamically updated
vertical scrolling feed, and an aggregate digest over fixed time periods.

### Feed

The vertical feed displays the following info:

- Alert name
- Source URL
- Alert status
- (Expandable) detailed description w/ advice link

Additionally, it presents the following controls:

- Accept (on alert expand): deactivates this alert (i.e., acknowledge review)
- Ignore this alert type: deactivates alerts of this type permanently
- Ignore this domain

This translates to three values for the `status` key:

- "new": All alerts newly detected start this way
- "read": After alert is expanded
- "ignore": After alert is ignored

If a domain is ignored, the UserPrefs collection should update its `ignores.domains` array to include that domain. If an alert is ignored, the `ignores.models` array should include that model type.

### Digest

The digest feed displays the following aggregate statistics:

- Number of alerts by type
- Number of alerts by referring domain (as applicable)

These statistics are broken up into three periods:

- Current day
- Current month
- Lifetime
