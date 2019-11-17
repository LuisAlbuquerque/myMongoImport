import xmltodict, json, sys

file = sys.argv[1]
name, ext = file.split(".")

with open(sys.argv[1]) as inFh:
	with open(name+'.json','w') as outFh:
		json.dump(xmltodict.parse(inFh.read()), outFh)

with open(name + '.json') as fd:
    print(fd.read())
