var
  vsvg = require('vsvg'),
  streamArray = require('stream-array'),
  through = require('through2'),
  fs = require('fs'),
  path = require('path');

/*
  getSvgTree
  -------------
  takes a filepath, read file contents and attempts to parse it.

  - @param fileName {String} - the location of the file relative to process
  - @param callback {Function} - function to call once file is done processing
*/

function getSvgTree(fileName, callback) {
  var filePath = path.resolve(process.cwd(), fileName);
  fs.stat(filePath, function(err, stat) {
    if(err || !stat.isFile()) {
      return callback(new Error(filePath + ' is not a file'));
    }
    fs.readFile(filePath, 'utf8', function(err, content) {
      if (err) {
        callback(err);
      }
      var contentTree;
      try {
        contentTree = vsvg.parse(content);
      } catch(e) {
        return callback(e);
      }
      callback(null, contentTree);
    });
  });

}

module.exports = function(options, done) {

  if (!options) {
    options = {};
  }

  var output = options.output;

  // start of svg
  output.write(new Buffer('<svg namespace="http://www.w3.org/2000/svg" version="1.1" style="display:none;">'));

  streamArray(options.files)
    // reads file and parses it
    .pipe(through.obj(function(chunk, enc, callback) {
      var
        _this = this,
        fileName = chunk.toString('utf8');
      getSvgTree(fileName, function(err, tree) {
        if (!err) {
          _this.push({
            fileName: fileName,
            els: tree
          });
        }
        callback();
      });
    }))
    // closes svg
    .on('end', function() {
      output.write(new Buffer('</svg>'));
    })
    // converts ast to correct structure
    .pipe(through.obj(function(chunk, enc, callback) {
      function convertToSymbol(fileName) {
        return function(el) {
          var symbol = vsvg.symbol({
              viewBox: el.attributes.viewBox,
              id: fileName
          });
          el._children.forEach(symbol.appendChild.bind(symbol));
          return symbol;
        };
      }

      chunk.fileName = chunk.fileName
        .split('/')
        .pop()
        .split('.')
        .shift();

      chunk.els = chunk.els.map(convertToSymbol(chunk.fileName));
      this.push(chunk.els[0].toHTML());
      callback();
    }))
    // output to file
    .pipe(output);
};
