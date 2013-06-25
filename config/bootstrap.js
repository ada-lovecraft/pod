// App bootstrap
// Code to run before launching the app
//
// Make sure you call cb() when you're finished.
	var util = require('util');
	var fs = require('fs.extra');

var FILE_DIR = '.'

module.exports.bootstrap = function (cb) {
	//check for files
	Files.findAll().done(function(err,files) {
		if (err)
			throw err;
		else {
			if (files.length == 0) {
				fs.watch(FILE_DIR, modifyFile);
			}
		}
			
	});
	populateFileList();
  	cb();
};

function populateFileList() {
	
	var drillDown = function(currentPath) {
		var fileParts = currentPath.split('/');
		var filename = fileParts[fileParts.length-1];
		console.log(filename);
		Files.create({filename: filename, isDirectory: true, path: currentFile }).done(function(err,file) {
       				if (err)
       					throw err;
       				else
       					console.log('added: ' + file.filename);
       			});
		var files = fs.readdirSync(currentPath);
		for (var i in files) {
       		var currentFile = currentPath + '/' + files[i];
       		var stats = fs.statSync(currentFile);
       		if (stats.isFile()) {
       			console.log('addingFile: ' + files[i]);
       			Files.create({filename: files[i] }).done(function(err,file) {
       				if (err)
       					throw err;
       				else
       					console.log('added: ' + file.filename);
       			});
       		}
      		else if (stats.isDirectory()) {
            	drillDown(currentFile);
           }
     	}
   	};

   	drillDown(FILE_DIR);

   
}

function modifyFile(event, filename) {
	console.log('event is: ' + event);
	if (filename) {
		console.log('filename: ' + filename);
	} else {
		console.log('filename not provided')
	}
}