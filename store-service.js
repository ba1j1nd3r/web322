const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data');

let items = [];
let categories = [];

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(dataPath, 'items.json'), 'utf8', (err, itemsData) => {
      if (err) {
        reject('Unable to read items file');
        return;
      }
      
      items = JSON.parse(itemsData);
      
      fs.readFile(path.join(dataPath, 'categories.json'), 'utf8', (err, categoriesData) => {
        if (err) {
          reject('Unable to read categories file');
          return;
        }
        
        categories = JSON.parse(categoriesData);
        
        resolve();
      });
    });
  });
}

function getAllItems() {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject('No items available');
      return;
    }
    
    resolve(items);
  });
}

function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = items.filter(item => item.published == true);
    
    if (publishedItems.length === 0) {
      reject('No published items available');
      return;
    }
    
    resolve(publishedItems);
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject('No categories available');
      return;
    }
    
    resolve(categories);
  });
}


function addItem(itemData) {
    return new Promise((resolve, reject) => {
        itemData.published==undefined ? itemData.published = false : itemData.published = true;
      itemData.id = items.length + 1;
  
      items.push(itemData);
      resolve(itemData);
    });
  }


  function getItemsByCategory(category) {
    return new Promise((resolve,reject) => {
      var found = items.filter(items => items.category == category);
      if (found.length == 0) {
          reject('no results');
      }
      resolve(found);


  })
  }
  
  function getItemsByMinDate(minDateStr) {
    return new Promise((resolve,reject) =>
    {
       var found = items.filter(items => items.postDate >= minDateStr);
       if (found.length == 0) {
           reject('no results');
       }
       resolve(found);
    })
  }
  
  function getItemById(id) {
    return new Promise((resolve,reject) =>
         {
            var found = items.filter(items => items.id == id);
            const uniquePost = found[0];
         //    if (found.length == 0) {
         //        reject('no results');
         //    }
         //    
         //    resolve(found);
         if (uniquePost) {
          
            resolve(uniquePost);
        }
        else {
            reject("no result returned");
        }
          }
         
         
         )
  }
module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  addItem,
  getItemsByCategory,
  getItemsByMinDate,
  getItemById
};
