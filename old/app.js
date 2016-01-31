var express = require('express')
var server = express()
var bodyParser = require('body-parser')
var formidable = require('formidable')
var util = require('util')
var fs = require('fs')
var mkdirp = require('mkdirp')

server.use(bodyParser.json({limit: "100000000kb"}))
server.use(bodyParser.urlencoded({ extended: true, limit: "100000000kb" }))

server.post('/upload', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = __dirname + '/tmp';
  form.maxFieldsSize = 10 * 1024 * 1024
  form.maxFields = 10000;
  form.parse(req, function(err, fields, files) {
    for(var i in files) {
      moveFiles(files[i])
    }
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));
  });
})

server.listen(8088, function() {
  console.log('run')
})


function moveFiles(file) {
  fs.exists(file.path, function(exists) {
    if(!exists) {
      console.log(s, ' is not exists!')
      return
    } else {
      var temp = file.name.split('/')
      var oldPath = file.path
      var newPath = __dirname + "/uploads/" + temp.slice(0, temp.length - 1).join('/')
      var newFilePath = __dirname + "/uploads/" + file.name
      fs.stat(newPath, function(err, stat) {
        if(!stat) {
          mkdirp(newPath, function(err) {
            if(!err) {
              fs.rename(file.path, newFilePath, function(err) {
                if(err) console.log(err)
              })
            }
          })
        } else {
          fs.rename(oldPath, newFilePath, function(err) {
            if(err) console.log(err)
          })
        }
      })
    }
  })
}
