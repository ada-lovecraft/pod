
(function($) {

	var FileModel = Backbone.Model.extend({
		urlRoot:'/files',
		filename: null,
		isDirectory: null,
		mediaType: null,
		path: null
	});

	var SailsCollection = Backbone.Collection.extend({
		sailsCollection: "",
		socket: null,
		sync: function(method, model, options){
			var where = {};
			if (options.where) {
				where = {
					where: options.where
				}
			}		
			if(typeof this.sailsCollection === "string" && this.sailsCollection !== "") {
				this.socket = io.connect();			
				this.socket.on("connect", _.bind(function(){
					console.log('connected');
					this.socket.request("/" + this.sailsCollection, where, _.bind(function(files){
						this.set(files);
					}, this));

					this.socket.on("file", _.bind(function(file){
						var m = file.uri.split("/").pop();
							console.log(m);
							if (m === "create") {
								this.add(file.data);
							} else if (m === "update") {
								this.get(file.data.id).set(file.data);
							} else if (m === "destroy") {
								this.remove(this.get(file.data.id));
							}
					}, this));
				}, this));
			} else {
				console.error("Error: Cannot retrieve models because property 'sailsCollection' not set on collection");
			}
		}
	});
	
	var FileCollection = SailsCollection.extend({
		sailsCollection: 'files',
		model: FileModel
	})

	var FilesView = Backbone.View.extend({
		el: $('#filesContainer'),
		initialize: function() {
			this.collection.on('add', this.render,this);
			this.render();
		},
		directoryTemplate: _.template("<div><h3><%= filename %></h3><ul></ul></div>"),
		fileTemplate: _.template("<li><%= filename %></li>"),
		render: function() {
			this.collection.each(function(file) {
				console.log('file: ' + JSON.stringify(file));
				if(file.isDirectory == true) {
					this.$el.append(this.directoryTemplate(file));
				} else {
					this.$el.find('div:last').append(this.fileTemplate(file.toJSON()));
				}
			},this);
		}
	});

	window.AppView= Backbone.View.extend({
		el: $('body'),
		initilialize: function() {
			this.files = new Files(null, {view: this});
		},
		events: {
			"click #dumpButton": 'dumpFiles'
		},
		dumpFiles: function() {
			console.log('getting file dump');
			files.create({filename:'boobs.jpg', isDirectory: false, path:'nopath'},{wait: true});
		}
	});


	var files = new FileCollection();
	files.fetch();
	var appView = new AppView();

	var filesView = new FilesView({collection: files});
})(jQuery);

