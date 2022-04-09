#!/bin/bash
sh /usr/local/tomcat/bin/startup.sh
supervisord -c /etc/supervisord.conf
