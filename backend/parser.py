#!/usr/bin/env python
import pexpect
jsonsocket = import_path("/home/sobakasu/projects/privacy/backpack/backend/submodules/jsonsocket/jsonsocket.py")
from jsonsocket import Client, Server

### initialize socket client
host = 'localhost'
port = '3000'

# Client code:
client = Client()


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
## list of packets (needed?)
## packets = []

## TODO later on we will want to get field spec from models at startup
## TODO is -t e redundant? seems like it maybe only works on summary
tsharkopts = "-V -l -p -t e" 
tsharkinterface = "-i wlan0"

## start tshark process
## http://stackoverflow.com/a/20509641/2023432
child = pexpect.spawn(" ".join(("tshark",tsharkinterface,tsharkopts)))

for nextline in child:
    # print nextline,
    ## add next
    lines.append(nextline)

    nextline_level = indentation(nextline)
    if nextline_level == 0: # we reached a new packet
        print lines,

        ## that means that `lines` has a whole packet of data
        ## parse lines and make a JSON blob
        nextjson = parsepacket(lines)

        ## send JSON blob through socket
        sendresult = socketsend(nextjson)

        if sendresult == True:
            ## throw away old traffic
            lines = []

child.close()


### function: count indent level of line
## http://stackoverflow.com/a/13241784/2023432
def indentation(s, tabsize=4):
    sx = s.expandtabs(tabsize)
    return 0 if sx.isspace() else len(sx) - len(sx.lstrip())

### function: parse whole tab-delimited Tshark packets, make JSON
## http://stackoverflow.com/a/12533983/2023432
def parsepacket(packetlines):
    ## join all lines together since it's easy to split again
    ## TODO remove that redundancy later, it's idiotic
    joinedpacket = "\n".join(packetlines)
    splitpacket = [s.strip().split(': ') for s in joinedpacket.splitlines()]
    
    ## do extra processing on first line to split ugly 3-string
    ## splitpacket[0] = "name: "+": ".join(splitpacket[0])
    ## splitpacket[0] = [s.split(': ') for s in splitpacket[0].split(', ')]
    

### function: send JSON blob over socket
def socketsend(jsonblob):
    client.connect(host, port).send(jsonblob)
    response = client.recv()
    client.close()
    return response

### function: chunk lists by length
### http://stackoverflow.com/a/16004505/2023432
def chunks(seq, n):
    return (seq[i:i+n] for i in xrange(0, len(seq), n))

### function: import packages from rel paths
### http://stackoverflow.com/a/1083169/2023432
def import_path(fullpath):
    """ 
    Import a file with full path specification. Allows one to
    import from anywhere, something __import__ does not do. 
    """
    path, filename = os.path.split(fullpath)
    filename, ext = os.path.splitext(filename)
    sys.path.append(path)
    module = __import__(filename)
    reload(module) # Might be out of date
    del sys.path[-1]
    return module

