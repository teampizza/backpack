# model specification (draft)

## backend

Models need to specify what backend they are drawing on. Currently this is only
`node-pcap`, but others are planned.

## fields

Models should specify what fields/protocols they need from Parser. This limits
the amount of memory and processing time needed.

## format

Specification format is in JSON, matching the field format of the required
backend listener, with array objects as endpoints. For example, the
proof-of-concept Social Beacon detector needs only:

    {
	  "backend": "node-pcap",
      "link": {
        "ip": {
		  "tcp": ["data"]
		}
      }
    }

since it inspects `data` for the `Referrer` heading in the HTTP request it
should contain, from output produced by `node-pcap`.

(In the future we want everything in the JSON spec, even things that Parser
can't parse in the initial packet. Parser should warn and continue.)
