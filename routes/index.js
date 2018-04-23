module.exports = function(app){
	app.route("/").get(function(req,res){
		res.render("index",{title:"express-dine-pass"});
	});
	app.route("/login").get(function(req,res){
		res.render("login",{title:"express-dine-pass"});
	})
}
