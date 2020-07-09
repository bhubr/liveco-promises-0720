const fs = require('fs')
const Promise = require('bluebird')
const connection = require('./connection')

// SPECIFIQUE a bluebird
// "promisifier" toutes les methodes du module fs
// par exemple on aura acces a fs.readFileAsync, fs.writeFileAsync, etc
Promise.promisifyAll(fs)
Promise.promisifyAll(connection)

fs.readFileAsync('product.json', 'utf8')
  .then(content => {
    console.log('success', content)
    const product = JSON.parse(content)
    return product;
  })
  .then(product => {
    return connection.queryAsync('INSERT INTO product SET ?', [product])
  })
  .then(stats => {
    return connection.queryAsync('SELECT * FROM product WHERE id = ?', [stats.insertId])
  })
  .then(products => {
    console.log(products[0])
  })
  .catch(err => {
    console.error(err)
    if (err.code === 'ENOENT') {
      console.error('File not found')
    }
  })

// fs.readFile('product.json', 'utf8', (err, content) => {
//   if (err) {
//     console.error(err)
//   } else {
//     const product = JSON.parse(content)
//     connection.query('INSERT INTO product SET ?', [product], (err, stats) => {
//       if (err) {
//         console.error(err)
//       } else {
//         connection.query('SELECT * FROM product WHERE id = ?', [stats.insertId], (err, products) => {
//           if (err) {
//             console.error(err)
//           }
//           console.log(products[0]);
//         })
//       }
//     })
//   }
// });