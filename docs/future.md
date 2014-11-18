# future goals

## minimum privilege execution

Directly analyzing the network data with TShark requires root privileges.
This is a potential security risk as TShark scripts and dissectors may include hazardous code that we don't want to be responsible for.

A potential workaround from Wikipedia:

> Elevated privileges are not needed for all operations. For example, an alternative is to run tcpdump or the dumpcap utility that comes with Wireshark with superuser privileges to capture packets into a file, and later analyze the packets by running Wireshark with restricted privileges. To emulate near realtime analysis, each captured file may be merged by `mergecap` into growing file processed by Wireshark. On wireless networks, it is possible to use the Aircrack wireless security tools to capture IEEE 802.11 frames and read the resulting dump files with Wireshark.
