const UserModel = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dqqgdxtgx',
    api_key: '661387327716212',
    api_secret: 'aOQnvPghucWnXASKpR6AZu_i93Y'
});

class UserController {

    static getalluser = async (req, res) => {
        try {
            res.send('hello User')

        } catch (error) {
            console.log(error)

        }
    }

    static registerUser = async (req, res) => {
        // console.log(req.body)
        // console.log(req.files.image)

        try {

            //  console.log(req.files.image)

            const file = req.files.image;
            // image upload
            const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "profileapiimage"
            })
            // console.log(req.body)
            const { name, email, password, confirmpassword } = req.body
            const user = await UserModel.findOne({ email: email });
            // console.log(user)

            if (user) {
                res.status(401).json({ status: "failed", message: "email already exist" })
            } else {
                if (name && email && password && confirmpassword) {
                    if (password == confirmpassword) {
                        const hashpassword = await bcrypt.hash(password, 10)
                        const result = new UserModel({
                            name: name,
                            email: email,
                            password: hashpassword,
                            confirmpassword: confirmpassword,
                            image: {
                                public_id: uploadImage.public_id,
                                url: uploadImage.secure_url,
                            },

                        })
                        await result.save()
                        res.status(201).json({ status: "success", message: "Thanks! For Registratation" })
                    } else {
                        res.status(401).json({ status: "failed", message: "password or confirm password are not same" })


                    }
                } else {
                    res.status(401).json({ status: "failed", message: "All Field require" })
                }
            }



        } catch (error) {
            console.log(error)
        }

     }

    static loginuser = async (req, res) => {
        try {
            // console.log(req.body)
            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({ email: email })

                if (user != null) {
                    const isMatched = await bcrypt.compare(password, user.password)
                    if (isMatched) {

                        // token gen.
                        const token = jwt.sign({ ID: user._id }, "nakulpalqpeisf124kskffl")
                        // console.log(token);
                        res.cookie("token", token)

                        res.status(201).json({ status: "success", message: "Login OK Report", token: token, user })


                    }
                    else {
                        res.status(401).json({ status: "failed", message: "Email pr password are not same" })
                    }
                }
                else {
                    res.status(401).json({ status: "failed", message: "you are not a regis user" })
                }


            } else {
                res.status(401).json({ status: "failed", message: "All field require" })

            }

        }

        catch (error) {
            console.log('error')

        }
    }

    static logout = async (req, res) => {
        try {
            res.clearCookie("token", null,)
            res.status(201).json({ status: "success", message: "Logout Buddy" })
        } catch (error) {
            console.log('error')

        }
    }

    static updatepassword = async (req, res) => {
        try {
            // console.log(req.userdata)
            const { oldpassword, newpassword, confirmpassword } = req.body;
            const { id } = req.userdata
            if (oldpassword && newpassword && confirmpassword) {
                const user = await UserModel.findById(id);
                const isMatched = await bcrypt.compare(oldpassword, user.password);
                // console.log(isMatched)
                if (!isMatched) {
                    res.status(401).json({ status: "failed", message: "current password is incorrect" })
                } else {
                    if (newpassword != confirmpassword) {
                        res.status(401).json({ status: "failed", message: "password does not match" })
                    } else {
                        const newHashPassword = await bcrypt.hash(newpassword, 10);
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword,
                        });
                        res.status(201).json({ status: "success", message: "password updated successfully" })
                    }
                }
            } else {
                res.status(401).json({ status: "failed", message: "all fields are required" })
            }
        } catch (error) {
            console.log(error);
        }
    };

    static updateProfile = async (req, res) => {
        try {
            const { id } = req.userdata
            const { name, email, image } = req.body
            if (req.files) {
                const user = await UserModel.findById(id)
                const imageID = user.image.public_id

                // delete image from cloudnary
                await cloudinary.uploader.destroy(imageID)
                // new image
                const imagefile = req.files.image
                const imageupload = await cloudinary.uploader.upload(imagefile.tempFilePath, {
                    folder: "profileapiimage"
                })

                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageupload.public_id,
                        url: imageupload.secure_url,
                    }
                }
            } else {

                var data = {
                    name: name,
                    email: email,

                }

            }

            const updateuserProfile = await UserModel.findByIdAndUpdate(id, data)
            res.status(200).json({
                succes: true,
                updateuserProfile,
            })

        } catch (error) {

        }
    }

    static getALLUser = async (req, res) => {
        try {
            const data = await UserModel.find()
            res.status(200).json({ data })
        } catch (error) {
            console.log(error)
        }
    }

    static getSinleUser = async (req, res) => {
        try {
            const data = await UserModel.findById(req.params.id)
            res.status(200).json({ success: true, data })
        } catch (error) {
            console.log(error)
        }
    }

}


module.exports = UserController