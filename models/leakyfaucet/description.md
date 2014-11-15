leaky faucet (draft)
========

the internet is soggy enough as it is

## model description

Another simple model that checks for sudden/sustained spikes in bandwidth throughput.

### traffic definition

### alert conditions

Two alerts are possible:

1. sudden uptick in outgoing/incoming transfer lasting more than N seconds
2. sustained increase in outgoing/incoming transfer lasting more than, say, 50 * N seconds


## report layout

Report gives offending protocols, outgoing destinations, duration, and average data rate.
