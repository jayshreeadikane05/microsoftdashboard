var mongoose = require("mongoose");

var campaginSchema = new mongoose.Schema(
    {
        year: {
            type: String, // Assuming this is a string representation of a year
            required: true,
        },
        datasolution: {
            type: String,
            required: true,
        },
        quarter: {
            type: String,
            required: true,
        },
        cycle: {
            type: String, // Changed to String to match your request body
            required: true,
        },
        namehtml: {
            type: String, // Changed to String
            required: true,
        },
        file: {
            type: String, // Changed to String to store the file name
            required: true,
        },
        zip_file_name: {
            type: String, // Changed to String
            required: true,
        },
        updated_excel_sheet: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            required: true,
            default: "LP Generated", 
        },
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("CampaginDetails", campaginSchema);
