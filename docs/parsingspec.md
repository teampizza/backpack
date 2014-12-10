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

At a minimum, the following keys will always be returned if present:

- Timestamp `pcap_header.time_ms`
- Protocol `link_type`, `link.ip.protocol_name`
- Destination Address `link.ip.daddr`, `link.dhost` (MAC)
- Destination Port `link.ip.tcp.dport`
- Source Address `link.ip.saddr`, `link.shost` (MAC)
- Source Port `link.ip.tcp.sport`

### example complete packet

Here is an example from testing with a complete packet, as stored in the
`netdata` db:

    { 
    	"event" : "newpacket", 
    	"message" : { 
    		"backend" : "node_pcap", 
    		"link_type" : "LINKTYPE_ETHERNET", 
    		"link" : { 
    			"dhost" : "70:18:8b:ee:0a:1b", 
    			"shost" : "e4:f4:c6:09:17:8b", 
    			"ethertype" : 2048, 
    			"ip" : { 
    				"version" : 4, 
    				"header_length" : 5, 
    				"header_bytes" : 20, 
    				"diffserv" : 0, 
    				"total_length" : 1500, 
    				"identification" : 42999, 
    				"flags" : { 
    					"reserved" : 0, 
    					"df" : 1, 
    					"mf" : 0 }, 
    				"fragment_offset" : 0, 
    				"ttl" : 57, 
    				"protocol" : 6, 
    				"header_checksum" : 37871, 
    				"saddr" : "54.230.6.223", 
    				"daddr" : "192.168.1.200", 
    				"protocol_name" : "TCP", 
    				"tcp" : { 
    					"sport" : 443,
    					"dport" : 42000,
    					"seqno" : 3136537175,
    					"ackno" : 4195954928,
    					"data_offset" : 66,
    					"header_bytes" : 32,
    					"reserved" : 0,
    					"flags" : { "cwr" : 0,
    											"ece" : 0,
    											"urg" : 0,
    											"ack" : 1,
    											"psh" : 0,
    											"rst" : 0,
    											"syn" : 0,
    											"fin" : 0 },
    					"window_size" : 139,
    					"checksum" : 8493,
    					"urgent_pointer" : 0,
    					"options" : { "timestamp" : 2705917084,
    												"echo" : 2135524 },
    					"data_end" : 1514,
    					"data_bytes" : 1448,
    					"data" : "NULL",
    					"pcap_header" : { "tv_sec" : 1418170200,
    														"tv_usec" : 740632,
    														"caplen" : 1514,
    														"len" : 1514,
    														"link_type" : "LINKTYPE_ETHERNET",
    														"time_ms" : 1418170200740.632},
    					"_id" : "NULL"
    				}
    			}
    		}
    	}
    }
