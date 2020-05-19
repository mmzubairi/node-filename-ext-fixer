// Author: Moosa Zubairi
// Dated: 05/05/2020


var fs = require('fs');
var path = require('path');
const FileType = require('file-type');

console.log('/--------------------------------------------------------------\\');
console.log(' File Extention Renamer');
console.log(' Written for SF File Types');
//console.log(' ');
console.log('\\--------------------------------------------------------------/');


const { COPYFILE_EXCL } = fs.constants;

// read the input directoryPath into a string/source
var args = process.argv.slice(2);
if (args.length === 0 ) {
  console.error('ERROR: \t No input directory defined ...\t use node filename-ext-fix /temp where temp is the input directory containing files');
  process.exit();
}

// read all files in a directory
var directoryPath  = path.join('/', args[0]);
console.log('Input direcotry: ', directoryPath);
fs.readdir(directoryPath, (err, files) => {
  if(err) {
    return console.error('\tError: Unable to scan direcotry: ' + err);
  }

  // make an archive directory
  var archiveDir = directoryPath + "/archive";
  fs.mkdir(archiveDir, err => {
   if(err) {
     console.error("\tError: Couldn't create the archive directory ", archiveDir, err);
     process.exit();
   }
  });

  // for each file in a directory
  files.forEach((file, i) => {
    var fullyQualifiedFilePath = directoryPath + '/'+ file;
    
    // copy the file into the archive directory
    let archiveFile = archiveDir + '/' + file;
    fs.copyFile(fullyQualifiedFilePath, archiveFile, COPYFILE_EXCL, fileCopyCallback);
    
    // rename existing file
    (async () => {
      
      let fileExt = await FileType.fromFile(fullyQualifiedFilePath);
      let newFileName = fullyQualifiedFilePath + '.' + fileExt.ext;
      fs.renameSync(fullyQualifiedFilePath, newFileName);
      let logstmt = 'Renamed ' + file + ' to ' + newFileName
      console.log(logstmt);
    	//=> {ext: 'png', mime: 'image/png'}
    })();
  });
})

function fileCopyCallback(err, file) {
  if (err) throw err;
}