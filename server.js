// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const fs = require( 'fs' );

// Sets up the Express App
// =============================================================
var app = express();
var PORT =  process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Notes Application (DATA)
// =============================================================
let data = require ("./db/db.json");

// Routes
// =============================================================


//avt.express.route
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});
app.get("/assets/js/index.js", function(req, res) {
    res.sendFile(path.join(__dirname, "public/assets/js/index.js"));
  });

app.get("/assets/css/styles.css", function(req, res) {
    res.sendFile(path.join(__dirname, "public/assets/css/styles.css"));
  });





// Displays all characters
app.get("/api/notes", function(req, res) {
  return res.json(data.map(function(pValue,pIndex){
    pValue.id = pIndex+1;  
    return pValue;
  }));
});

// Displays a single character, or returns false
app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    // //   var chosen = req.params.character;
    newNote.id = data.length;
    data.push (newNote);
    fs.promises.writeFile( 'db/db.json', JSON.stringify(data.map(function(pValue){
        // ? Delete eliminates the key of an object;
        delete pValue.id;
        return pValue;
    }),null,4), 'utf8' )
        .then( function( pValue ){
            console.log( 'File written successfully' );
            // return res.send(200);
            return res.json(newNote);
        } )
        .catch( function( pError ){
            console.error(pError);
            return res.sendStatus(500);
        } );
  
});
app.delete( '/api/notes/:id', function( req, res ){
    // TODO: Implement route logic
    let id = req.params.id;
    let index = id - 1;
    data.splice(index,1);
    fs.promises.writeFile( 'db/db.json', JSON.stringify(data.map(function(pValue){
        // ? Delete eliminates the key of an object;
        delete pValue.id;
        return pValue;
    }),null,4), 'utf8' )
        .then( function( pValue ){
            console.log( 'File written successfully' );
            return res.sendStatus(200);
        } )
        .catch( function( pError ){
            console.error(pError);
            return res.sendStatus(500);
        } );
} );
// !! WARNING: This route should be defined at the end of the file 
// !! because otherwise all routes below wil be overwritten
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
