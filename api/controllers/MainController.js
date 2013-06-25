/*---------------------
	:: Main 
	-> controller
---------------------*/
var MainController = {
	index: function(req,res) {
		res.view();
		Files.findAll().done(function( err, files) {
			if (err) 
				throw err;
			console.log("files found: " + files.length);
		});
	}
};
module.exports = MainController;