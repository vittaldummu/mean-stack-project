const mongoose= require("mongoose");
const countrySchema= new mongoose.Schema({
country_code :String,
country_name : String,
});

module.exports=mongoose.model("country",countrySchema);