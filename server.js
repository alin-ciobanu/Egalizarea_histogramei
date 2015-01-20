var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var multer  = require('multer');

var exec = require('child_process').exec;

GLOBAL.app = express();

var PORT = 9066;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.query());
app.use(multer({ dest: './uploads/'}))

app.use(function (req, res, next) {
    // url decoding middleware
    req.url = req.url
        .replace(/\&/gi, '%26')
        .replace(/=/gi, '%3D')
        .replace(/\+/gi, '%2B')
        .replace(/@/gi, '%40')
        .replace(/:/gi, '%3A')
        .replace(/\$/g, '%24')
        .replace(/,/gi, '%2C');
    try {
        req.url = decodeURIComponent(req.url);
    }
    catch (err) {
        console.log(req.url);
    }
    req.url = req.url.replace(/[/]+/g, '/');
    next();
});

app.post('/api/uploadImage', function (req, res) {

    var file = req.files.file;

    if (!file) {
        res.status(500).json({
            message: "Please upload a file."
        }).end();
    }

    if (!(file.extension == 'jpg' || file.extension == 'jpeg') && file.mimetype != 'image/jpeg') {
        res.status(500).json({
            message: "Please upload a JPEG image."
        }).end();
    }

    exec('java Main ' + file.path, function (err, stdout, stderr) {

        if (stdout.indexOf("OK") >= 0) {
            res.status(200).json({
                file: file.path,
                histFile: stdout.substring(3, stdout.length)
            }).end();
        }
        else if (stdout == "ERR-READ" || stdout == "ERR-WRITE") {
            res.status(500).json({
                message: "Error processing the image. Please try again."
            }).end();
            fs.unlink(file.path);
        }
        else if (stdout == "ERR-NOT-GREY") {
            res.status(500).json({
                message: "You uploaded a colored image. Please upload a greyscale JPEG image."
            }).end();
            fs.unlink(file.path);
        }

    });

});

app.post('/api/downloadImage', function (req, res) {

    res.sendfile(req.body.path, function () {
        fs.unlink(req.body.path);
    });

});

// resolve statics
// use client folder as root path /
app.use('/', express.static(path.resolve('client/')));

// START THE SERVER
app.listen(PORT);
console.log('Server started on port ' + PORT);
