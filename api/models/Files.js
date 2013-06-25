/*---------------------
	:: Files
	-> model
---------------------*/
module.exports = {

	attributes: {
		fileId: 'INT',
		filename: 'STRING',
		isDirectory:'INT',
		mediaType: 'STRING',
		path: 'STRING'
		// Simple attribute:
		// name: 'STRING',

		// Or for more flexibility:
		// phoneNumber: {
		//	type: 'STRING',
		//	defaultsTo: '555-555-5555'
		// }
		
	}

};
