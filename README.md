# Mongo import

Smart and simple version of mongo import

Usage:
 node mongoimport <file> <database name> <collection name> <options>

Import CSV, XML or JSON data into MongoDB


Options
  --xslt=<name.xsl>                      use stylesheet to turn xml into json file
  --separatorR=<separator rows>          specify separator for rows
  --separatorC=<separator columns>       specify separator for columns
  --host=<hostname>                      mongodb host to change connect to (setname/host1,host2 for replica sets)
  --port=<port>                          server port
