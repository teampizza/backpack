#!/bin/sh

capture_group=wireshark

# first command might throw error if group exists, that's fine
sudo groupadd $capture_group || true
sudo usermod -a -G $capture_group $USER
sudo chgrp $capture_group $(pwd)/backend/parser/pcap_parser.js
sudo chmod 750 $(pwd)/backend/parser/pcap_parser.js
sudo setcap cap_net_raw,cap_net_admin=eip $(which node)

# if we just created the capture group
if ! echo $(groups) | grep -q $capture_group
then
		newgrp $capture_group
fi
