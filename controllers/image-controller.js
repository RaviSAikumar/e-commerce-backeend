const Image = require("../models/Images");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const uploadImageController = async (req, res) => {
  try {
    //check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required, please upload an image",
      });
    }
    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    //store the image url and publicid along with the uploaded userId
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    res.status(200).json({
      success: true,
      message: "image uploaded",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};

module.exports = {
  uploadImageController,
};
