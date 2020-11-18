const User = require("../../Config/user");
const UserData = require("../../Config/userdata");
const { cloudinary } = require('../../Config/cloudinary');

const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const router = require("express").Router();
const jwt = require('jsonwebtoken');

const fs = require('fs');

router.post("/signup", async (req, res) => {

   try { if (!req.body.email) {
        return res.status(200).send({
            success: false,
            message: 'Error:email is not valid'
        })
    };
    if (!req.body.password) {
        return res.status(200).send({
            success: false,
            message: 'Error:password is not valid'
        })
    }
    if (!req.body.username) {
        return res.status(200).send({
            success: false,
            message: 'Error:name can not be blank'
        })
    };
    let finduser = await User.findOne({ where: { email: `${req.body.email}` } });
    if (finduser !== null) {
        return res.status(200).send({
            success: false,
            message: 'Error:Account alredy exist.',
            finduser
        })

    }
    const salt = genSaltSync(10);
    return await User.create({
        username: req.body.username,
        password: hashSync(req.body.password, salt),
        email: req.body.email,
    }).then((users) => {
        if (users) {
            res.send({
                success: true,
                message: 'Signing Up.',
            })
        } else {
            response.status(200).send('Error in insert new record');
        }

    }) }
    catch (err) {
        res.status(500).send({message:err.message});}
})

router.post("/signin", async (req, res) => {
    if (!req.body.email) {
        return res.status(200).send({
            success: false,
            message: 'Error:email cannot be blank'
        })
    };
    if (!req.body.password) {
        return res.status(200).send({
            success: false,
            message: 'Error:password cannot be blank'
        })
    }
    req.body.email = req.body.email.toLowerCase();

    await User.findOne({ where: { email: req.body.email } })
        .then((us) => {
           
            if (us) {
                if (compareSync(req.body.password, us.dataValues.password)) {

                    const user = {
                        email: req.body.email,
                        password: req.body.password
                    }
                    jwt.sign({ user }, 'secret',  (err, token) => {
                        return res.send({
                            token,
                            username:us.username,
                            isAdmin:us.isAdmin,
                            success: true,
                            message: 'ok'
                        })
                    });
                } else {
                    return res.status(200).send({
                        success: false,
                        message: 'Error:Invalid email or password'
                    })
                }
            } else {
                return res.status(200).send({
                    success: false,
                    message: 'Error:Invalid email or password'
                })
            }
        })
        .catch((err) => {
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: 'Error:Server Error'
                })

            }
        })

})


router.get('/verify', async (req,res,next) =>{
    const {query} = req;
    const {token} = query;
    await jwt.verify(token, 'secret', (err, authData) => {
        if (err){
            return res.send({
                success:false,
                message:'Error',
                authData
            })
        }
         if (!authData){
            return res.send({
                success:false,
                message:'Error:Invalid',
              
            })
         } else {
             return res.send({
                 success:true,
                 message:"Good",
                 authData,
                 len:authData.length
             })
         }
    })
})

// router.post('/upload/:id', async (req, res) => {
//     try {
//         if (!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded',
//             });
//         } else {
//             let data = [];
//             {
//                 let photo = await req.files.photo;

//                 UserData.create({
//                     img: photo.name,
//                     userid: req.params.id
//                 })
//                 data.push({
//                     name: photo.name,
//                     mimetype: photo.mimetype,
//                     size: photo.size
//                 });
//             };
//             res.send({
//                 status: true,
//                 message: 'Files are uploaded',
//                 data: data
//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.get('/upload/:id/:limit', async (req, res) => {
    try {
        await UserData.findAndCountAll({
            where: {
                userid: req.params.id
            },
            offset: 0,
            limit: parseInt(req.params.limit)
        })
            .then(result => {
                res.send(result)
            })
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/upload/:email',async (req,res)=>{
    try {
        await User.findOne({ where: { email: req.params.email } }).then((us) =>
        (res.send({ username: us.username }))
        )
    }
    catch {
        (err) => res.send({ err })
    }
} )

router.delete('/upload/:id', async (req, res) => {
    try {
        await UserData.destroy({
            where: {
                userid: req.params.id
            }
        }).then(res.send({ deleted: 'true' }))
    }
    catch {
        (err) => res.send({ err })
    }
})

router.put('/upload/:id', async (req, res) => {
    try {
        await UserData.update({ img: req.body.img }, {
            where: {
                userid: req.params.id
            }
        }).then(res.send({ update: 'true' }))
    }
    catch {
        (err) => res.send({ err })
    }
})

router.delete('/admin/:email', async (req, res) => {
    try {
        await User.findOne({ where: { email: req.params.email } }).then((us) =>
            UserData.destroy({
                where: {
                    userid: us.id
                }
            }).then(User.destroy({
                where: {
                    id: us.id
                }
            })).then(res.send({ deleted: 'ok' }))
        )
    }
    catch {
        (err) => res.send({ err })
    }
})

router.delete('/admin/data/:email', async (req, res) => {
    try {
        await User.findOne({ where: { email: req.params.email } }).then((us) =>
            UserData.destroy({
                where: {
                    userid: us.id
                }
            }).then(res.send({ deleted: 'ok' }))
        )
    }
    catch {
        (err) => res.send({ err })
    }
})

router.delete('/admin/data/user/:email', async (req, res) => {
    try {
        await User.findOne({ where: { email: req.params.email } }).then((us) =>
            User.destroy({
                where: { email: req.params.email }
            }).then(res.send({ deleted: 'ok' }))
        )
    }
    catch {
        (err) => res.send({ err })
    }
})


// router.post('/upload', (req, res) => {

//     if (!req.files) {
//         return res.status(500).send({ msg: "file is not found" })
//     }
       
//     const myFile = req.files.file;
//     myFile.mv(`${__dirname}/../../client/public/photos/${myFile.name}`, function (err) {
//         if (err) {
//             console.log(err)
//             return res.status(500).send({ msg: "Error occured" });
//         }
//         return res.send({name: myFile.name, path: `/${myFile.name}`});
//     });
// })

router.get('/images', async (req, res) => {
    const { resources } = await cloudinary.search
        .expression('folder:test')
        .sort_by('public_id')
        .max_results(30)
        .execute();
        

    const publicIds = resources.map((file) => file.url);
    res.status(200).send( {link:publicIds});
});

router.post('/upload', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            const fileStr  =  req.files.avatar
            
             fs.writeFile('test.jpg', fileStr.data, (err)  => {
                if (err) console.log(err)
            })
            await cloudinary.uploader.upload('test.jpg', {
                upload_preset: "ghdexqjy",
                eager: [
                    { width: 40, height: 40,}]
            });
            res.json({ msg: 'yaya' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;