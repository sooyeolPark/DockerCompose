#FROM pietvandongen/docker-tomcat-development:latest
FROM tomcat:latest
MAINTAINER sooyeolPark

# timezone set
RUN apt-get update && apt-get install -y supervisor
COPY supervisord.conf /etc/supervisord.conf
COPY tomcatStart.sh ./
#ENTRYPOINT ["supervisord","-c","/etc/supervisord.conf"]
#ENTRYPOINT ["sh","/usr/local/tomcat/bin/startup.sh"]
ENTRYPOINT ["sh", "tomcatStart.sh"]

#docker exec dockercompose-proxy-1 tar Ccf /etc/nginx/ - . | tar Cxf d/etc
# ADD tomcat/catalina.sh $CATALINA_HOME/bin/
#ADD tomcat/run.sh $CATALINA_HOME/bin/run.sh
#RUN chmod +x $CATALINA_HOME/bin/run.sh

# add MySQL JDBC driver jar
#ADD tomcat/mysql-connector-java-5.1.36-bin.jar $CATALINA_HOME/lib/

# create mount point for volume with application
# RUN mkdir $CATALINA_HOME/webapps/UserSignup

# add tomcat jpda debugging environmental variables
#ENV JPDA_OPTS="-agentlib:jdwp=transport=dt_socket,address=8000,server=y,suspend=n"
#ENV JPDA_ADDRESS="8000"
#ENV JPDA_TRANSPORT="dt_socket"

# start tomcat7 with remote debugging
#EXPOSE 8080
#CMD ["run.sh"]