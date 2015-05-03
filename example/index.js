var
  spriter = require('..');
  files = [
    './example/svgs/github.svg',
    './example/svgs/github2.svg'
  ],
  fs = require('fs'),
  ws = fs.createWriteStream(__dirname + '/test.svg');

spriter({files: files, output: ws});
