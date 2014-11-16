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
