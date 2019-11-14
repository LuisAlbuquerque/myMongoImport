var jsonfile = require('jsonfile');
var fs = require('fs');
var mongoose = require('mongoose');
var xml = require('xml-js');


var print = (string) => console.log(string);
var Info = (string) => console.info(string);
var last = (a) => a[a.length - 1];
var head = (a) => a[0];

var is_format_x = (string) => (format_x) => last (string.split(".")) == format_x
var is_json = (string) => is_format_x (string) ("json")
var is_xml = (string) => is_format_x (string) ("xml")



// TODO: create_dataBase
var create_dataBase = (name) => mongoose.connect("mongodb://127.0.0.1/" + name)
// TODO: schema
var schema = () => new mongoose.Schema({});
// TODO: create_collection
var create_collection = (name) => mongoose.model(name,schema());

// TODO: is_Array
var is_Array = (content) => Array.is_Array(content);
var insert_all = (list) =>(nameDB) => (nameC) => nameDB.nameC.insertMany(list);
var insert = (element) =>(nameDB) => (nameC) => nameDB.nameC.insert(element);



// TODO: mongoimport
var mongoimport = (nameBD,nameC,content) => {
                                    create_dataBase (nameDB);
                                    create_collection (nameC);
                                    (is_Array (content))? insert_all (content) (nameDB) (nameC)
                                              : insert (content) (nameDB) (nameC);
                                    }

var readFile = (filename) => fs.readFileSync(filename).toString();
var xml_to_json = (content) => xml.xml2json(content, {compact: true, spaces: 4});

// TODO: jsonFile_to_mongo
var jsonFile_to_mongo = (filename) => mongoimport( readFile(filename) );
// TODO: xmlFile_to_mongo
var xmlFile_to_mongo = (filename) => mongoimport( xml_to_json ( readFile(filename) ));

var myArgs = process.argv.slice(2);
file = myArgs[0]

print(myArgs);
print(file)


if(is_json (file)){
    //jsonFile_to_mongo(file);
}else
    if(is_xml){
        //xmlFile_to_mongo(file);
    }else{
        print("O programa ainda não esta preparado para processar este tipo de dados") 
    }


//content_file = fs.readFile(file, (err, data) => { if(!err) console.log(data.toString()); });
content_file = fs.readFileSync(file).toString();
print(content_file);
print(is_json(file))
print(last(file.split(".")))
var xml_content =
'<?xml version="1.0" encoding="utf-8"?>' +
'<note importance="high" logged="true">' +
'    <title>Happy</title>' +
'    <todo>Work</todo>' +
'    <todo>Play</todo>' +
'</note>';
print(xml_to_json(xml_content))
//var result1 = xml.xml2json(xml_content, {compact: true, spaces: 4});
//var result2 = xml.xml2json(xml_content, {compact: false, spaces: 4});
//console.log(result1, '\n', result2);

