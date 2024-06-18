const CartegoryModel = require('../model/cartegory')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dqqgdxtgx',
    api_key: '661387327716212',
    api_secret: 'aOQnvPghucWnXASKpR6AZu_i93Y'
});

class cartegoryController {

    static createCategory = async(req,res) =>{
        try {
            console.log(req.body)
            console.log(req.files.image)

            const file = req.files.image
            const uploadImage = await cloudinary.uploader.upload(file.tempFilePath,{
                folder: 'profileapiimage'
            })

            const {name} = req.body
            const data = new CartegoryModel({
                name:name,
                image: {
                    public_id: uploadImage.public_id,
                    url: uploadImage.secure_url,
                },
            })
            await data.save()
            res.status(201).json({ status: "success", message: "category added successfully ✔✔" })

            
        } catch (error) {
            console.log(error)
            
        }
    }

    static getAllCategories = async (req,res) =>{
        try {
            const allCategories = await CartegoryModel.find()
            res.status(200).json({success:true,allCategories})
            
        } catch (error) {
            console.log(error)

        }
    }

    static getCategoryDetail = async (req,res) =>{
        try {
            const CategoryDetail = await CartegoryModel.findById(req.params.id)
            res.status(200).json({success:true,CategoryDetail})
            
        } catch (error) {
            console.log(error)

        }
    }



}

module.exports = cartegoryController