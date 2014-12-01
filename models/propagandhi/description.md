propagandhi (draft)
========

you're doing it wrong

## model description

This model scans outgoing network requests for domains representing known
antiprivacy/centralized services. When one is detected (definitively, by a
login, perhaps), it sends a report recommending an equivalent
free/privacy-respecting/decentralized service.

### traffic definition

- Destination domain

### alert conditions

- Destination domain matches model blacklist

## report layout

Report returns:

- Service name
- Recommended equivalent
- Short vignette explaining why
- Link to recommended equivalent
