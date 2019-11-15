var jsonfile = require('jsonfile');
var fs = require('fs');
var mongoose = require('mongoose');
var xml = require('xml-js');
var csvToJson = require('convert-csv-to-json');

var { xsltProcess, xmlParse } = require('xslt-processor');


var print = (string) => console.log(string);
var Info = (string) => console.info(string);
var last = (a) => a[a.length - 1];
var head = (a) => a[0];

var is_format_x = (string) => (format_x) => last (string.split(".")) == format_x
var is_json = (string) => is_format_x (string) ("json")
var is_xml = (string) => is_format_x (string) ("xml")
var is_csv = (string) => is_format_x (string) ("csv")
var termination = (string) => last (string.split(".")) 

var isxslt = (string) => head (string.split("=")) == "--xslt"
var xslt = (string) => last (string.split("=")) 

var iseparator = (string) => head (string.split("=")) == "--separator"
var separator = (string) => last (string.split("=")) 



// TODO: create_dataBase
var create_dataBase = (name) => mongoose.createConnection("mongodb://127.0.0.1/" + name, {useNewUrlParser : true, useUnifiedTopology : true})
// TODO: schema
var schema = () => new mongoose.Schema({});
// TODO: create_collection
var create_collection = (db) => (name) => db.model(name,schema());

// TODO: is_Array
var is_Array = (content) => 0//Array.is_Array(content);
var insert_all = (list) =>(nameDB) => (model) => model.collection.insertMany(list);
var insert = (element) =>(nameDB) => (model) => {
                                            var object = new model(element);
                                            object.save().exec();
                                            }



// TODO: mongoimport
var mongoimport = (nameBD,nameC,content) => {
                                    //content = JSON.stringify(content);
                                    db = create_dataBase (nameBD);
                                    model = create_collection (db) (nameC);
                                    (is_Array (content))? insert_all (content) (nameBD) (model)
                                              : insert (content) (nameBD) (model);
                                    } 

var readFile = (filename) => fs.readFileSync(filename).toString(); var xml_to_json = (filename) => xml.xml2json(readFile(filename), {compact: true, spaces: 4}); var csv_to_json = (filename) => csvToJson.getJsonFromCsv(filename); var xml_to_json_with_xslt = (filename) => (xslt_file) => xsltProcess( xmlParse( readFile(filename) ), xmlParse( readFile(xslt_file) ));                                            

// TODO: jsonFile_to_mongo
var jsonFile_to_mongo = (filename) =>(nameDB) =>(nameC) => mongoimport( nameDB, nameC, jsonfile.readFileSync(filename) );
// TODO: xmlFile_to_mongo
var xmlFile_to_mongo = (filename)  =>(nameDB) =>(nameC) => mongoimport( nameDB, nameC, xml_to_json (filename) );
// TODO: xmlFile_to_mongo_with_xslt
var xmlFile_to_mongo_with_xslt = (filename) => (xslt_file) =>(nameDB) =>(nameC) => {
                                                            content = xml_to_json_with_xslt (filename) (xslt_file);
                                                            mongoimport( nameDB, nameC, content );
                                                            }

// TODO: xmlFile_to_mongo
var csvFile_to_mongo = (filename)  =>(nameDB) =>(nameC) => mongoimport( nameDB, nameC, csv_to_json (filename) );

function main (myArgs = process.argv.slice(2)){
    //myArgs = process.argv.slice(2);
    // node mongoimport.js <filename (json or xml or csv)> <databse name> <collection name> FLAGS
    // FLAGS 
    //      --xslt=<name.xsl>
    //      --separator=[<separatorLines>,<separatorColumns>>

    /* Required */ 
    file = myArgs[0]; if(file == undefined) return;
    db_name = myArgs[1]; if(db_name == undefined) return;

    /* Optional */
    c_name = myArgs[2]; if(c_name == undefined) c_name = db_name;
    
    /* Optinal (only used if imput file type is xml or csv) */
    flags = myArgs[3]; 
    if(flags != undefined){
        if(is_xml(file) && isxslt(flags)){
            var xsl = xslt;
        }else if(is_csv(file) && iseparator(flags)){
        }
    }

    print(myArgs);
    print(file)


    switch(termination(file)){
        case 'json':
            print("JSON FILE")
            jsonFile_to_mongo (file) (db_name) (c_name);
            break;
        case 'xml':
            (xsl != undefined)?
                 xmlFile_to_mongo_with_xslt (file) (xsl) (db_name) (c_name)
                :xmlFile_to_mongo (file) (db_name) (c_name);
            break;
        case 'json':
            csvFile_to_mongo (file) (db_name) (c_name);
            break;
        default:
            print("O programa ainda não esta preparado para processar este tipo de dados") 
    }
}
main()
/*
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

print(csvToJson.getJsonFromCsv(file));
*/
