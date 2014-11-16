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
    packetlines = [line = line.split('=', 1)[-1] for line in packetlines]
    ## 5. split on colons
    packetlinescolons = packetlines.split(':')
    ## 6. apply tab_level()
    packetlinescolonstabs = tab_level(packetlinescolons)
    ## 7. apply ttree_to_json(ttree, level=0)
    return ttree_to_json(packetlinescolonstabs)

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

### function: insert or append to dict
### http://stackoverflow.com/a/24966533/2023432
def dict_insert_or_append(adict,key,val):
    """Insert a value in dict at key if one does not exist
    Otherwise, convert value to list and append
    """
    if key in adict:
        if type(adict[key]) != list:
            adict[key] = [adict[key]]
        adict[key].append(val)
    else:
        adict[key] = val

def tab_level(astr):
    """Count number of leading tabs in a string
    """
    return len(astr)- len(astr.lstrip('\t'))

def ttree_to_json(ttree,level=0):
    result = {}
    for i in range(0,len(ttree)):
        cn = ttree[i]
        try:
            nn  = ttree[i+1]
        except:
            nn = {'level':-1}

        # Edge cases
        if cn['level']>level:
            continue
        if cn['level']<level:
            return result

        # Recursion
        if nn['level']==level:
            dict_insert_or_append(result,cn['name'],cn['value'])
        elif nn['level']>level:
            rr = ttree_to_json(ttree[i+1:], level=nn['level'])
            dict_insert_or_append(result,cn['name'],rr)
        else:
            dict_insert_or_append(result,cn['name'],cn['value'])
            return result
    return result

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

