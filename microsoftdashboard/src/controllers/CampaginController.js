const CampaginModel = require("../models/CampaginModel");
const apiResponse = require("../helpers/apiResponse");


exports.createCampagin = [
    async (req, res) => {
        try {
            console.log("Request body:", req.body);

            const { 
                year, 
                datasolution, 
                quarter, 
                cycle, 
                namehtml, 
                zip_file_name, 
                updated_excel_sheet 
            } = req.body;

            if (!year || !datasolution || !quarter || !cycle || !namehtml || !zip_file_name || !updated_excel_sheet) {
                return apiResponse.ErrorResponse(res, "All fields are required.");
            }

            if (!req.files || !req.files.file) {
                return apiResponse.ErrorResponse(res, "Please upload an Excel file.");
            }

            const file = req.files.file;
            console.log("Uploaded file details:", file);

            const filePath = `uploads/${Date.now()}-${file.name}`;
            await file.mv(filePath); 

            const campagin = new CampaginModel({
                year,
                datasolution,
                quarter,
                cycle,
                namehtml,
                file: filePath, 
                zip_file_name,
                updated_excel_sheet, 
            });

            const savedcampagin = await campagin.save();

            if (savedcampagin) {
                return apiResponse.successResponseWithData(res, "Campaign created successfully.", savedcampagin);
            }
            return apiResponse.ErrorResponse(res, "Not able to create Campaign.");
        } catch (error) {
            console.error("Error during campaign creation:", error);
            return apiResponse.ErrorResponse(res, error.message);
        }
    }
];

  
exports.getAllCampagin = [
    async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;

            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            const skip = (pageNumber - 1) * limitNumber;

            const campaigns = await CampaginModel.find()
                .skip(skip)
                .limit(limitNumber)
                .exec();

            const total = await CampaginModel.countDocuments();

            const responseData = {
                campaigns, 
                currentPage: pageNumber, 
                totalPages: Math.ceil(total / limitNumber), 
                totalCampaigns: total 
            };

            return apiResponse.successResponseWithData(res, "Success.", responseData);
        } catch (error) {
            console.error("Error during fetching campaigns:", error);
            return apiResponse.ErrorResponse(res, error.message);
        }
    }
];

exports.getBydataSolution = [
    async (req, res) => {
      try {
        const { datasolution } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const { year, quarter, cycle, namehtml, status } = req.body;
  
        if (!datasolution) {
          return apiResponse.ErrorResponse(res, "Data solution is required.");
        }
  
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
  
        const searchFilter = {};
  
        if (year) searchFilter.year = { $regex: year, $options: "i" };
        if (quarter) searchFilter.quarter = { $regex: quarter, $options: "i" };
        if (cycle) searchFilter.cycle = { $regex: cycle, $options: "i" };
        if (namehtml) searchFilter.namehtml = { $regex: namehtml, $options: "i" };
        if (status) searchFilter.status = { $regex: status, $options: "i" };
  
        const filter = { datasolution, ...searchFilter };
  
        const campaigns = await CampaginModel.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNumber);
  
        const totalCampaigns = await CampaginModel.countDocuments(filter);
  
        if (!campaigns.length) {
          const responseData1 = {
            campaigns,
            currentPage: pageNumber,
            totalCampaigns,
            totalPages: Math.ceil(totalCampaigns / limitNumber),
          };
          return apiResponse.successResponseWithData(
            res,
            "No campaigns found for this data solution.",
            responseData1
          );
        }
  
        const responseData = {
          campaigns,
          currentPage: pageNumber,
          totalCampaigns,
          totalPages: Math.ceil(totalCampaigns / limitNumber),
        };
  
        return apiResponse.successResponseWithData(
          res,
          "Campaigns retrieved successfully.",
          responseData
        );
      } catch (error) {
        console.error("Error during fetching campaigns by data solution:", error);
        return apiResponse.ErrorResponse(res, error.message);
      }
    },
  ];
  
  exports.getCampaignCounts = [
    async (req, res) => {
      try {
        // Define filters for different data solutions
        const azureFilter = { datasolution: 'azure' };
        const bizzFilter = { datasolution: 'bizzapps'};
        const modernworkFilter = { datasolution: 'modernwork' };
        const securityFilter = { datasolution: 'security' };
        const surfaceFilter = { datasolution: 'surface' };
        const powerplatformFilter = { datasolution: 'power-platform' };
  
        // Count campaigns by data solution
        const azureCount = await CampaginModel.countDocuments(azureFilter);
        const bizzCount = await CampaginModel.countDocuments(bizzFilter);
        const modernworkCount = await CampaginModel.countDocuments(modernworkFilter);
        const securityCount = await CampaginModel.countDocuments(securityFilter);
        const surfaceCount = await CampaginModel.countDocuments(surfaceFilter);
        const powerplatformCount = await CampaginModel.countDocuments(powerplatformFilter);
  
        // Year-wise aggregation by data solution
        const yearSolutionAggregation = await CampaginModel.aggregate([
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },      // Group by year
                datasolution: "$datasolution"        // Group by data solution
              },
              count: { $sum: 1 }                
            }
          },
          {
            $sort: {
              "_id.year": 1,                       
              "_id.datasolution": 1               
            }
          }
        ]);
        console.log('Year Solution Aggregation:', yearSolutionAggregation); // Log the results to verify

        const solutionMap = {
          'azure': 'azureCount',
          'bizzapps': 'bizzCount',
          'modernwork': 'modernworkCount',
          'security': 'securityCount',
          'surface': 'surfaceCount',
          'power-platform': 'powerplatformCount'
        };
        
        const yearDataCounts = {};
        yearSolutionAggregation.forEach(item => {
          const year = item._id.year;
          const solution = item._id.datasolution;
        
          // Initialize the year object if it doesn't exist
          if (!yearDataCounts[year]) {
            yearDataCounts[year] = {
              azureCount: 0,
              bizzCount: 0,
              modernworkCount: 0,
              securityCount: 0,
              surfaceCount: 0,
              powerplatformCount: 0,
            };
          }
        
          // Map the solution to the corresponding count key and add the count
          const solutionKey = solutionMap[solution];
          if (solutionKey) {
            yearDataCounts[year][solutionKey] += item.count;
          } else {
            console.log(`Unknown solution: ${solution}`);  // This will help track if there are any unexpected solution names
          }
        });
        
        // Convert the year data counts to an array for yearMonthData
        const yearMonthData = Object.entries(yearDataCounts).map(([year, counts]) => ({
          year: Number(year),
          ...counts,
        }));
        
        console.log('Year Month Data:', yearMonthData);
        const responseData = {
          azureCount,
          bizzCount,
          modernworkCount,
          securityCount,
          surfaceCount,
          powerplatformCount,
          yearMonthData // Year data with counts for each data solution
        };
  
        return apiResponse.successResponseWithData(
          res,
          "Campaign counts and year data by solution retrieved successfully.",
          responseData
        );
      } catch (error) {
        console.error("Error during fetching campaign counts:", error);
        return apiResponse.ErrorResponse(res, error.message);
      }
    }
  ];
  
  
  
  

exports.updateCampagin = [
    async (req, res) => {
        const { id } = req.params;  
        const { status } = req.body; 
  
        try {
            const updatedCampaign = await CampaginModel.findByIdAndUpdate(
                id,
                { status },  
                { new: true } 
            );
  
            if (!updatedCampaign) {
                return apiResponse.ErrorResponse(res, "Campaign not found");
            }
  
            return apiResponse.successResponseWithData(res, "campaigns Updated Successfully", updatedCampaign);
        } catch (error) {
            console.error("Error during updating campaign:", error);
            return apiResponse.ErrorResponse(res, error.message);
        }
    }
];