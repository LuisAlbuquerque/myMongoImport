var jsonfile = require('jsonfile');
var fs = require('fs');
var mongoose = require('mongoose');
var xml = require('xml-js');
var csvToJson = require('convert-csv-to-json');
var xmlParser = require('xml2json');
var execSync = require('child_process').execSync;

var { xsltProcess, xmlParse } = require('xslt-processor');


var print = (string) => console.log(string);
var Info = (string) => console.info(string);
var Error = (string) => console.error(string);
var last = (a) => a[a.length - 1];
var head = (a) => a[0];

var is_format_x = (string) => (format_x) => last (string.split(".")) == format_x
var is_json = (string) => is_format_x (string) ("json")
var is_xml = (string) => is_format_x (string) ("xml")
var is_csv = (string) => is_format_x (string) ("csv")
var termination = (string) => last (string.split(".")) 

var isxslt = (string) => head (string.split("=")) == "--xslt"
var xslt = (string) => last (string.split("=")) 

var separatorR = (string) => head (string.split("=")) == "--separatorR"
var separatorC = (string) => head (string.split("=")) == "--separatorC"

var value = (string) => last (string.split("=")) 
var options = (string) => head (string.split("=")) 



// TODO: create_dataBase
var create_dataBase = (name) => (OPTIONS) => mongoose.createConnection("mongodb://127.0.0.1/" + name, {useNewUrlParser : true, useUnifiedTopology : true})
// TODO: schema
var schema = () => new mongoose.Schema({});
// TODO: create_collection
var create_collection = (db) => (name) => db.model(name,schema());

// TODO: is_Array
var is_Array = (content) =>  Array.isArray(content);
var insert_all = (list) => (model) => model.collection.insertMany(list);
var insert = (element) => (model) => model.collection.insertMany([element]);



// TODO: mongoimport
var mongoimport = (nameBD,nameC,content,OPTIONS) => {
                                    print(content);
                                    db = create_dataBase (nameBD) (OPTIONS);
                                    model = create_collection (db) (nameC);
                                    (is_Array (content))? insert_all (content) (model)
                                              : insert (content) (model);

                                    } 

var readFile = (filename) => fs.readFileSync(filename).toString(); 
//var xml_to_json = (filename) => xml.xml2json(readFile(filename), {compact: true, spaces: 4});
//var xml_to_json = (filename) => xmlParser.toJson(readFile(filename)); 
var xml_to_json = (filename) => execSync('python3 xml2json.py ' + filename).toString(); 
var csv_to_json = (filename) => csvToJson.getJsonFromCsv(filename); 
var xml_to_json_with_xslt = (filename) => (xslt_file) => xsltProcess( xmlParse( readFile(filename) ), xmlParse( readFile(xslt_file) ));                                            

// TODO: jsonFile_to_mongo
var jsonFile_to_mongo = (filename) =>(nameDB) =>(nameC) => (OPTIONS) => {
                                                        let content = jsonfile.readFileSync(filename)
                                                        print(content);
                                                        mongoimport( nameDB, nameC, content, OPTIONS );
                                                        }
// TODO: xmlFile_to_mongo
var xmlFile_to_mongo = (filename)  =>(nameDB) =>(nameC) => (OPTIONS) => mongoimport( nameDB, nameC, xml_to_json (filename), OPTIONS );
// TODO: xmlFile_to_mongo_with_xslt
var xmlFile_to_mongo_with_xslt = (filename) => (xslt_file) =>(nameDB) =>(nameC) => (OPTIONS) => {
                                                            content = xml_to_json_with_xslt (filename) (xslt_file);
                                                            mongoimport( nameDB, nameC, content );
                                                            }

// TODO: xmlFile_to_mongo
var csvFile_to_mongo = (filename)  =>(nameDB) =>(nameC) => (OPTIONS) => mongoimport( nameDB, nameC, csv_to_json (filename), OPTIONS );

function main (myArgs = process.argv.slice(2)){
    //myArgs = process.argv.slice(2);
    // node mongoimport.js <filename (json or xml or csv)> <databse name> <collection name> FLAGS
    // FLAGS 
    //      --xslt=<name.xsl>
    //      --separator=[<separatorLines>,<separatorColumns>>
    //
    if(myArgs[0] =="--help"){
        print("Usage:")
        print(" node mongoimport <file> <database name> <collection name> <options>")
        print("")
        print("Import CSV, XML or JSON data into MongoDB")
        print("")
        print("")
        print("Options")
        print("  --xslt=<name.xsl>                      use stylesheet to turn xml into json file")
        print("  --separatorR=<separator rows>          specify separator for rows")
        print("  --separatorC=<separator columns>       specify separator for columns")
        print("  --host=<hostname>                      mongodb host to change connect to (setname/host1,host2 for replica sets)")
        print("  --port=<port>                          server port")
        return;
    }

    /* Required */ 
    file = myArgs[0]; if(file == undefined) return;
    db_name = myArgs[1]; if(db_name == undefined) return;

    /* Optional */
    c_name = myArgs[2]; if(c_name == undefined) c_name = db_name;
    
    /* Optinal (only used if imput file type is xml or csv) */
    let i=3;
    while(flags = myArgs[i]){
        switch( options(flags) ){

            case "--xslt":
                var xsl = value (flags);
                break;

            case "--separatorR":
                var separa_r = value(flags);
                break;

            case "--separatorC":
                var separa_c = value(flags);
                break;

            case "--host":
                var host_name = value(flags);
                break;

            case "--port":
                var port_name = value(flags);
                break;
            default:
                end=1;
        }
        if(end)break;
    }
    var OPTIONS = { xslt : xsl,
                    seprarator : [separa_r,separa_c],
                    host : host_name,
                    port : port_name
                  };

    print(myArgs);
    print(file)


    switch(termination(file)){
        case 'json':
            print("JSON FILE")
            jsonFile_to_mongo (file) (db_name) (c_name) (OPTIONS);
            break;
        case 'xml':
            execSync('python3 xml2json.py ' + file);            
            name_file = head (file.split("."));
            (xsl != undefined)?
                 xmlFile_to_mongo_with_xslt (file) (xsl) (db_name) (c_name) (OPTIONS)
                //:xmlFile_to_mongo (file) (db_name) (c_name) (OPTIONS);
                : jsonFile_to_mongo (name_file + '.json') (db_name) (c_name) (OPTIONS);
            break;
        case 'csv':
            csvFile_to_mongo (file) (db_name) (c_name) (OPTIONS);
            break;
        default:
            print("O programa ainda não esta preparado para processar este tipo de dados") 
    }
    return;
}
main();
