# model specification (draft)

## fields

Models should specify what fields/protocols they need from Parser. This limits
the amount of memory and processing time needed.

### format

Specification format is in JSON, with arrays indicating required fields, by
protocol. For example, the proof-of-concept Social Beacon detector needs only:

    {
      "http": [
        "referer"
      ]
    }
