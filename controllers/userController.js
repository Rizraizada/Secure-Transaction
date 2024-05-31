const multer = require('multer');
const path = require('path');

 
 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Specify the destination directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
    }
});

 const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // Limit file size if needed
}).single('photo'); // Accept only one file with the field name 'photo'

 const User = require('../models/user');

exports.profile = (req, res) => {
    res.render('user/profile', { user: req.user });
};

 

exports.register = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error('Error occurred during file upload:', err);
                return res.status(500).send(`An error occurred during file upload: ${err.message}`);
            }

            console.log('Uploaded file:', req.file);

            const {
                username, last_name, date_of_birth, gender,
                father_name, mother_name, initial_deposit_amount,
                national_id, password, mobile_number, email_address,
                city, state, country, postal_Code, village_address,
                residential_address
            } = req.body;

            let photoPath = req.file ? req.file.path.replace(/\\/g, '/') : null;

            console.log('Photo path:', photoPath);

             const newUser = await User.create({
                username, last_name, date_of_birth, gender,
                father_name, mother_name, initial_deposit_amount,
                national_id, password, mobile_number, email_address,
                city, state, country, postal_code: postal_Code,
                village_address, residential_address,
                photo: photoPath 
            });

            console.log('New user created:', newUser);

             res.redirect('/login');
        });
    } catch (error) {
        console.error('Error occurred during registration:', error);
        res.status(500).send(`An error occurred during registration: ${error.message}`);
    }
};