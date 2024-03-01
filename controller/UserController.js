const UserModel = require('../model/user')
const bcrypt = require('bcrypt')
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
                        if (user.role == "admin") {
                            // token gen.
                            let token = jwt.sign({ ID: user.id }, "nakulpalqpeisf124kskffl")
                            // console.log(token);
                            res.cookie("token", token)


                            res.redirect('/admin/dashboard')
                        } else {
                            // token gen.
                            let token = jwt.sign({ ID: user.id }, "nakulpalqpeisf124kskffl")
                            // console.log(token);
                            res.cookie("token", token)


                            res.redirect('/dashboard')
                        }

                    }
                    else {
                        req.flash("error", "You are not a register User");
                        res.redirect("/");
                    }
                }

                else {
                    req.flash("error", "All Field are required");
                    res.redirect("/");
                }


            }

        } catch (error) {
            console.log('error')

        }
    }

    static logout = async (req, res) => {
        try {
            res.clearCookie("token")
            res.redirect('/')

        } catch (error) {
            console.log('error')

        }
    }

    static updatepassword = async (req, res) => {
        try {
            const { op, np, cp } = req.body;
            const { id } = req.userdata;
            if (op && np && cp) {
                const user = await UserModel.findById(id);
                const isMatched = await bcrypt.compare(op, user.password);
                console.log(isMatched);
                if (!isMatched) {
                    req.flash("error", "current password is incorrect");
                    res.redirect("/profile");
                } else {
                    if (np != cp) {
                        req.flash("error", "password does not match");
                        res.redirect("/profile");
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10);
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword,
                        });
                        req.flash("success", "password updated successfully");
                        res.redirect("/");
                    }
                }
            } else {
                req.flash("error", "all fields are required");
                res.redirect("/profile");
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
                    folder: "profileImage"
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

            await UserModel.findByIdAndUpdate(id, data)
            req.flash("success", "Update Successfully");
            res.redirect("/profile");

        } catch (error) {

        }
    }


}



module.exports = UserController