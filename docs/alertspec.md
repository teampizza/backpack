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
    - Source URL
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

- Ignore: deactivates this alert (i.e., acknowledge review)
- Reject: deactivates alerts of this type permanently

