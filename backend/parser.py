#!/usr/bin/env python
import pexpect
import json
# from utils import * # our util functions

### initialize socket client
host = 'localhost'
port = '3000'

## Client code:
## client = Client()

### function: count indent level of line
## http://stackoverflow.com/a/13241784/2023432
def indentation(s, tabsize=4):
    sx = s.expandtabs(tabsize)
    return 0 if sx.isspace() else len(sx) - len(sx.lstrip())

### function: parse whole tab-delimited Tshark packets, make JSON
## http://stackoverflow.com/a/12533983/2023432
## http://stackoverflow.com/a/16405619/2023432
## http://stackoverflow.com/a/3900089/2023432
def parsepacket(packetstring):
    ## 1. remove all brackets/parentheses
    packetstring = packetstring.translate(None,"()[]")
    ## 2. convert commas to newlines
    packetstring = packetstring.replace(",","\n")
    ## 3. prepend "name: " to string
    packetstring = "name: "+packetstring
    ## 4. remove everything before "= "
    packetlines = packetstring.split("\n")
    packetlines = [line.split('=', 1)[-1] for line in packetlines]
    ## 5. remove leading whitespace
    packetlinesstrip = [line.strip() for line in packetlines]
    ## 6. split on colons
    packetlinesstripcolon = [line.split(':') for line in packetlinesstrip]
    ## 7. flatten list
    packetlinesstripcolonflat = sum(packetlinesstripcolon, [])
    ## 8. strip again (ugh)
    packetlinesstripcolonflat = [line.strip() for line in packetlinesstripcolonflat]
    ## WORKAROUND for erroneous tokens (odd)
    ## TODO fix this, idiot
    if len(packetlinesstripcolonflat) % 2 != 0:
        packetlinesstripcolonflat = packetlinesstripcolonflat + [" "]

    ## 9. convert pairwise to dict
    return dict(packetlinesstripcolonflat[i:i+2] for i in range(0, len(packetlinesstripcolonflat), 2))

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

## bool to tell us when we're on a new packet (needed?)
## isnewpacket = True

## list for line by line
lines = []

## TODO later on we will want to get field spec from models at startup
## TODO is -t e redundant? seems like it maybe only works on summary
tsharkopts = "-V -l -p -t e" 
tsharkinterface = "-i wlan0"

## start tshark process
## http://stackoverflow.com/a/20509641/2023432
child = pexpect.spawn(" ".join(("tshark",tsharkinterface,tsharkopts)))
### skip a few warning lines
## TODO address later when privileges restricted
child.expect('\n')
child.expect('\n')
child.expect('\n')
child.expect('\n')
child.expect('\n')

for nextline in child:
    # print nextline,
    ## add next
    lines.append(nextline)

    nextline_level = indentation(nextline)
    if nextline_level == 0: # we reached a new packet
        print lines,

        ## that means that `lines` has a whole packet of data
        ## parse lines and make a JSON blob
        nextjson = parsepacket(" ".join(lines))

        ## send JSON blob through socket
        # sendresult = socketsend(nextjson)

        # if sendresult == True:
            ## throw away old traffic
        #    lines = []

child.close()




### function: send JSON blob over socket
def socketsend(jsonblob):
    client.connect(host, port).send(jsonblob)
    response = client.recv()
    client.close()
    return response

