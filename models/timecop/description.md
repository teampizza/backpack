timecop (draft)
========

police yourself (or don't)

## model description

This model performs time-correlation analysis over a set interval (day, week, month) by user domain. It looks for domains that are strongly associated with each other (or highly time-specific), and lets the user know that these patterns are apparent.

### traffic definition

timecop only needs TIME and DEST DOMAIN.

### alert conditions

Model alerts when a domain (pair) correlation is higher than a certain threshold.

## report layout

Report gives domains, time(s) of high correlation, and time period for which the correlation was computed.
