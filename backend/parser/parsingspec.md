# parsing outline (draft)

## inputs

### necessary fields

Parser will take a field list from Modeler and enable them in the `node-pcap`
call options. Specifically, Parser accepts a list of key names to parse from
analyzed packets, organized by protocol, in JSON.

TODO: example

### environment vars

Parser looks for `$NET_INTERFACE` and brings up a `pcap` session on that
interface.

## output format

Parser will return an object in JSON with keys named according to conventions
established by `pcap` and `node_pcap` unless not applicable. Specifically, it
will parse and return keys as required by Modeler at startup (i.e., according to
the needs of installed models).

At a minimum, the following keys will always be returned:

- Timestamp
- Protocol
- Destination Address
