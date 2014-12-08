# model specification (draft)

## path ##

Models should be placed within `backend/modeler/models/<modelname>/`. The
following two files are required:

- `description.md`
- `model.js`: this is the actual model file

## content ##

### model ###

`model.js` should contain at least a function with the same name as the model,
e.g. `socialbeacon`. Helper functions should support this function.

The main model function should take as argument the output of whatever backend
it relies on. This is probably going to be a single JSON object in all cases.

### description ###

Model descriptions should contain the following sections:

1. tagline (lol no problem)
2. model description
3. technical specification
4. alert conditions
5. report layout

Descriptions follow.

#### tagline ####

Self-explanatory.

#### model description ####

This should be a short paragraph explaining in a non-technical way what the
model is doing.

#### technical specification ####

This is the most important part. It should contain at a minimum a JSON object
with the below subsections, but a short paragraph explaining how it works is
highly recommended.

##### backend #####

Models need to specify what backend they are drawing on. Currently this is only
`node-pcap`, but others are planned.

##### fields #####

Models should specify what fields/protocols they need from Parser. This limits
the amount of memory and processing time needed.

Field format is in JSON, matching the field format of the required
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

##### alert conditions #####

Explain the alert conditions for the model here in a short paragraph.

##### report layout #####

The report layout should give the output written to the `alerts` collection in
JSON.
