var mongoose=require("mongoose"),
bodyParser= require("body-parser"),
express=require("express"),
passport=require("passport"),
LocalStrategy=require("passport-Local"),
passportLocalMongoose=require("passport-local-mongoose"),
user=require("./model/user");

mongoose.connect("mongodb://127.0.0.1:27017/Mini-Project");
var app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require("express-session")({
    secret:"Rusty is a dog",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get("/",function(req,res)
{
    res.render("home");
});
app.get("/register",function(req,res)
{
    res.render("register");
});
app.post("/register",function(req,res){
    var username=req.body.username,
    password=req.body.password

    user.register(new user({username:username}),
    password,function(err,user){
        if (err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(
            req,res,(function(){
                res.render("profile");
            }));
        
    });
});

//showing login form
app.get("/login",function(req,res){
    res.render("login");
});

//handling user login
app.post("/login",passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login"
}),function(req,res){
});

app.get("/profile",isLoggedIn,(req, res, next) => {
        res.render("profile");
    })
function isLoggedIn (req,res,next){
    if (req.isAuthenticated())
        return next();
    res.redirect("login");
}
//Handling user logout
app.get("/logout",function(req,res,next){
req.logout(function(err){
    if (err) {
        return next(err);
    }
    res.redirect("/");
});
});
var port=process.env.port ||8008
app.listen(port,function(){
    console.log("server has started!");
});