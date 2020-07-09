const fs = require('fs')
const connection = require('./connection')

fs.readFile('product.json', 'utf8', (err, content) => {
  if (err) {
    console.error(err)
  } else {
    const product = JSON.parse(content)
    connection.query('INSERT INTO product SET ?', [product], (err, stats) => {
      if (err) {
        console.error(err)
      } else {
        connection.query('SELECT * FROM product WHERE id = ?', [stats.insertId], (err, products) => {
          if (err) {
            console.error(err)
          }
          console.log(products[0]);
        })
      }
    })
  }
});