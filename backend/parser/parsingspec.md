# parsing outline (draft)

## inputs

### necessary fields

the parser should take a field list from the enabled models and enable them in the `node-pcap` call options.

### interface

Parser looks for `$NET_INTERFACE` and uses that where needed.

## output format

we're currently using `-V -l -p -t e`, which gives output like this:


    Internet Protocol Version 4, Src: 192.168.0.81 (192.168.0.81), Dst: 224.0.0.1 (224.0.0.1)
        Version: 4
        Header length: 20 bytes
        Differentiated Services Field: 0x00 (DSCP 0x00: Default; ECN: 0x00: Not-ECT (Not ECN-Capable Transport))
            0000 00.. = Differentiated Services Codepoint: Default (0x00)
            .... ..00 = Explicit Congestion Notification: Not-ECT (Not ECN-Capable Transport) (0x00)
        Total Length: 44
        Identification: 0xeab1 (60081)
        Flags: 0x00
            0... .... = Reserved bit: Not set
            .0.. .... = Don't fragment: Not set
            ..0. .... = More fragments: Not set
        Fragment offset: 0
        Time to live: 1
        Protocol: UDP (17)
        Header checksum: 0x2e15 [validation disabled]
            [Good: False]
            [Bad: False]
        Source: 192.168.0.81 (192.168.0.81)
        Destination: 224.0.0.1 (224.0.0.1)
        [Source GeoIP: Unknown]
        [Destination GeoIP: Unknown]

### breakdown

Each subheader is split by a tab indent. Contents (flat) within that indent are bulleted.

#### simple packet info: protocol proper name, source, destination

##### packet contents
- version
- header length
- differentiated services

###### differentiated services field
- codepoint
- congestion notification

#### packet contents
- total length
- identification

##### flags: hex
- reserved bit
- don't fragment
- more fragments

#### packet contents
- fragment offset
- TTL
- protocol

##### header checksum: hex, validation status
- good
- bad

#### packet contents
- source
- destination
- source geoip
- destination geoip
