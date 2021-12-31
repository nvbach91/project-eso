/* generates a set of js language files from the input TSV file in the same folder */
/* $> node translate.js input.tsv */
/*    0    1            2       */
var fs = require('fs');
var readline = require('readline');

// the language codes to translate, must be sorted alphabetically,
// columns in the input file must correspond to these codes in this order
var langContents = { en: '', cs: ''/*, da: '', de: '', 'de-at': '', fi: '', no: '', sv: ''*/ };

var generateIndent = function(field) {
  var fieldLength = field.length;
  var space = '';
  while (space.length < 40 - fieldLength) {
    space += ' ';
  }
  return space;
};
var translate = function(line) {
  var fields = line.split('\t');
  var field = fields[0].trim();
  var langs = {};
  Object.keys(langContents).forEach(function(code, index) {
    langs[code] = fields[index + 1];
  });
  if (field.length) {
    var langValues = JSON.parse(JSON.stringify(langs));
    var endComma = field === '__END_OF_FILE__' ? '' : ',';
    Object.keys(langValues).forEach(function(code) {
      if (langValues[code]) {
        langValues[code] = '"' + langs[code].slice(0, langs[code].length) + '"' + endComma;
      }
    });
    Object.keys(langContents).forEach(function(code) {
      if (langValues[code]) {
        langContents[code] += '  "' + field + '"' + generateIndent(field) + ': ' + (langValues[code][1] !== '"' ? langValues[code] : langValues['en']) + '\n';
      }
    });
  } else {
    Object.keys(langContents).forEach(function(code) {
      langContents[code] += '\n';
    });
  }
};
var inputFileName = process.argv[2];
var lineCnt = -1;

Object.keys(langContents).forEach(function(code) {
  fs.writeFileSync(code + '.js', 'App.GLocale' + code.toUpperCase() + ' = {\n', { encoding: 'utf8', flag: 'w' });
});

var lineReader = readline.createInterface({
  input: fs.createReadStream(inputFileName),
});

lineReader.on('line', function(line) {
  lineCnt++;
  if (lineCnt > 0) {
    translate(line);
  }
});

lineReader.on('close', function() {
  Object.keys(langContents).forEach(function(code) {
    fs.writeFileSync(code + '.js', langContents[code] + '};\n', { encoding: 'utf8', flag: 'a' });
  });
});