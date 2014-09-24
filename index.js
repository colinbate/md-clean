#!/usr/bin/env node
var toml = require('toml');

process.stdin.setEncoding('utf8');

var delimCount = 0;
var tomlDone = false;
var tomlStr = '';
var delimMatch = /^\+{3}$/gm;

var handle = function (chunk) {
  var parts, meta;

  while (!tomlDone && delimMatch.exec(chunk) !== null) {
    delimCount += 1;
  }
  if (delimCount < 2) {
    tomlStr += chunk;
  } else if (tomlDone) {
    console.log(chunk);
  } else {
    tomlStr += chunk;
    parts = tomlStr.split('+++');
    if (parts.length && !parts[0]) {
      parts.shift();
    }
    meta = toml.parse(parts[0].trim());
    if (meta.title) {
      console.log('# ' + meta.title);
    }
    console.log(parts[1]);
    tomlDone = true;
  }
};

process.stdin.on('readable', function() {
  var chunk;
  while ((chunk = process.stdin.read()) !== null) {
    handle(chunk);
  }
});

process.stdin.on('end', function () {
  if (!tomlDone) {
    console.log(tomlStr);
  }
});