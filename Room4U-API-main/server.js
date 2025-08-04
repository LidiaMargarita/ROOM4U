const express = require('express');
const cors = require('cors');
const auth = require('./auth');
const data = require('./data');
const upload = require('./upload');
const path = require('path');


const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/login', auth.login);
app.post('/register-student', auth.registerStudent);
app.post('/register-owner', auth.registerOwner);
app.post('/register-property', auth.verifyToken, upload.array('images', 10), auth.registerProperty);
app.post('/updateProperty', auth.verifyToken, upload.array('images', 10), auth.updateProperty);
app.post('/deleteProperty', auth.verifyToken, auth.deleteProperty);
app.post('/setfavorite',auth.verifyToken,auth.setFavorite);
app.post('/setcontact',auth.verifyToken,auth.setContact);
app.post('/getstudentinterested',auth.verifyToken,auth.getstudentinterested);
app.post('/modifyStatusOfProperty',auth.verifyToken,auth.modifyStatusOfProperty);
app.post('/userHasRentedProperty',auth.verifyToken,auth.userHasRentedProperty);
app.post('/addComment',auth.verifyToken,auth.addComment);
app.get('/getmyfavorites',auth.verifyToken,auth.getmyfavorites);

app.post('/getcontactnotifications',auth.verifyToken,auth.getcontactnotifications);
app.post('/getpostrating',auth.verifyToken,auth.getpostrating);
app.post('/getcontactownernotifications',auth.verifyToken,auth.getcontactownernotifications);



//general data
app.get('/schoolslist',data.getSchoolsList);
app.get('/gettypesofproperty',data.getTypesOfProperty);
app.get('/gettownhalls',data.getTownhalls);
app.get('/getallproperties',data.getallproperties);
app.get('/getmaxminprices',data.getmaxminprices);
app.get('/getdetailsofproperty/:propertie_id', data.getdetailsofproperty);
app.get('/getcommentsofproperty/:propertie_id', data.getcommentsofproperty);
app.get('/getrateofproperty/:propertie_id', data.getrateofproperty);
app.get('/getgeneraldataofproperty/:propertie_id', data.getgeneraldataofproperty);

//Personal data
app.get('/getusertype', auth.verifyToken, auth.getusertype);
app.get('/getmyproperties',auth.verifyToken,auth.getmyproperties);
app.get('/protected', auth.verifyToken, (req, res) => {
  res.json({ message: 'Acceso a datos protegidos', userId: req.userId });
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
