const ProductModel = require("../model/product")

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dqqgdxtgx',
    api_key: '661387327716212',
    api_secret: 'aOQnvPghucWnXASKpR6AZu_i93Y'
});

class ProductController {

    // Admin
    static createProduct = async(req,res) => {
        try {
            // console.log(req.body)
           // console.log(req.body)
           const file = req.files.image
           const uploadImage = await cloudinary.uploader.upload(file.tempFilePath,{
            folder: 'profileapiimage'
           })

           const {name,description,price,stock,rating,category} = req.body
           const data = new ProductModel({
            name:name,
            description:description,
            price:price,
            stock:stock,
            rating:rating,
            category:category,
            image: {
                public_id: uploadImage.public_id,
                url: uploadImage.secure_url,
            },
           })
           const insertData = await data.save()
        //    console.log(insertData)
        res.status(201).json({ status: "success", message: "Product added successfully 🐧🐧 ",insertData })


        } catch (error) {
            console.log(error)
            
        }
    }

    static getProductDetail = async (req,res) =>{
        try {
            const productDetail = await ProductModel.findById(req.params.id)
            res.status(200).json({success:true, productDetail})
            
        } catch (error) {
            console.log(error)
            
        }
    }

    static getAdminProduct = async (req,res) =>{
        try {
            const data = await ProductModel.find()
            res.status(200).json({success:true,data})
            
        } catch (error) {
            console.log(error)
            
        }
    }

    static updateProduct = async (req,res) =>{
        try {
            

            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    static deleteProduct = async (req,res) =>{
        try {
            const data = await ProductModel.findByIdAndDelete(req.params.id)
            res.status(200).json({ status:"Success" , message: "Product has been deleted" })
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
}

module.exports = ProductController;