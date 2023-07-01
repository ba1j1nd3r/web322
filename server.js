const express = require('express');
const storeService = require('./store-service');
const app = express();
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const upload = multer(); 
var path = require('path');
const port = process.env.PORT || 8080;

app.use(express.static('public'));

cloudinary.config({
    cloud_name: "dhobpx4ek",
    api_key: "742724157688558",
    api_secret: "WX4ZV2hlLAYbZpyWFc9MTVlC5Wo",
    secure: true
  });
app.get('/', (req, res) => {
    res.redirect('/about');
  });

  
  app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
  });


  
  // Route: /shop
app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
      .then(items => {
        res.json(items);
      })
      .catch(error => {
        res.status(500).json({ message: error });
      });
  });
  app.get('/items/add',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','addItem.html'));
  
  });
  
  app.get("/items/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
  
    storeService
      .getItemById(itemId)
      .then((item) => {
        if (item) {
          res.json(item);
        } else {
          res.status(404).json({ message: "Item not found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error });
      });
  });
  
  // Route: /items
  app.get("/items", (req, res) => {
    const { category, minDate } = req.query;
  
    if (category) {
      storeService
        .getItemsByCategory(category)
        .then((items) => {
          res.json(items);
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
    } else if (minDate) {
      storeService
        .getItemsByMinDate(minDate)
        .then((items) => {
          res.json(items);
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
    } else {
      storeService
        .getAllItems()
        .then((items) => {
          res.json(items);
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
    }
  });



  
  
  // Route: /categories
  app.get('/categories', (req, res) => {
    storeService.getCategories()
      .then(categories => {
        res.json(categories);
      })
      .catch(error => {
        res.status(500).json({ message: error });
      });
  });
  
  // Route: POST /items/add
  app.post('/items/add', upload.single('featureImage'), (req, res) => {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
  
      async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
      }
  
      upload(req)
        .then((uploaded) => {
          processItem(uploaded.url);
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
          processItem('');
        });
    } else {
      processItem('');
    }
  
    function processItem(imageUrl) {
      req.body.featureImage = imageUrl;
      
      storeService.addItem(req.body).then(() =>
      {
    
        res.redirect("/items");
    
      })
    
  
    }
  });







  
  // Route: 404 - Page Not Found
  app.get('*', (req, res) => {
    res.status(404).json({ message: 'Page Not Found' });
  });
  
  

  storeService.initialize()
  .then(() => {
   
    app.listen(port, () => {
      console.log(`Express http server listening on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Error initializing store service:', error);
  });