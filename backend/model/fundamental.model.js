 import mongoose  from "mongoose";

 const fundamentalSchema = new mongoose.Schema({
    symbol:{
        type: String,
        unique: true,
    },
    data:{
        type: Object,
        required: true,
    },
    lastUpdated:{
        type: Date,
        default: Date.now,
    }
 })

 export default mongoose.model("Fundamental", fundamentalSchema);