const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://SWMS:smart@cluster0.hgiqt0x.mongodb.net/?appName=Cluster0")
.then(() => {
    console.log("✅ Connected");
    process.exit(0);
})
.catch(err => {
    console.log(err);
    process.exit(1);
});