#!/usr/bin/env python
import pexpect

### Tshark opts of interest:
## -D: list capture interfaces
## -2: 2-pass analysis
## -V: display protocol details
## -b: ring buffer opts, e.g.: -b filesize:1000 -b files:5
## -l: line buffering
## -p: disable promiscuous mode
## -t: time format (e is epoch, ad absolute with date)
## -e <field>:  Add a field to the list of fields to display if -T fields is selected.
## -T fields|pdml|ps|psml|text:
##     Set the format of the output when viewing decoded packet data. The options are one of:
## 
##     fields The values of fields specified with the -e option, in a form specified by the -E option. For example,
## 
##       -T fields -E separator=, -E quote=d
## 
##     would generate comma-separated values (CSV) output suitable for importing into your favorite spreadsheet program.
## -E <field print option>
## 
##     Set an option controlling the printing of fields when -T fields is selected.
## 
##     Options are:
## 
##     header=y|n If y, print a list of the field names given using -e as the first line of the output; the field name will be separated using the same character as the field values. Defaults to n.
## 
##     separator=/t|/s|<character> Set the separator character to use for fields. If /t tab will be used (this is the default), if /s, a single space will be used. Otherwise any character that can be accepted by the command line as part of the option may be used.
## 
##     aggregator=,|/s|<character> Set the aggregator character to use for fields that have multiple occurrences. If , a comma will be used (this is the default), if /s, a single space will be used. Otherwise any character that can be accepted by the command line as part of the option may be used.
## -x: print hex/ASCII dump of packet data (needed in future)

tsharkopts = "-V -l -p -t e"
tsharkinterface = "-i wlan0"

child = pexpect.spawn(" ".join(("tshark",tsharkinterface,tsharkopts)))
for line in child:
    print line,
child.close()
