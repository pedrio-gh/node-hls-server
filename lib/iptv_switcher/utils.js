const fs = require('fs');
const pt = require('path');
const M3U8FileParser = require('m3u8-file-parser');

/**
 * Load single m3u m3u8 file
 * @param {*} filePath
 */
const loadFromFile = async (filePath) => {
  const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const reader = new M3U8FileParser();

  reader.read(file);
  const iptv = reader.getResult();

  return iptv;
};

/**
 * Load all files in a folder containing .m3u m3u8 files
 * @param {*} folderPath
 */
const loadFromFolder = (folderPath) => {
  const files = fs.readdirSync(folderPath);
  const reader = new M3U8FileParser();

  const lists = files.map((file) => {
    reader.read(file);
    const list = reader.getResult();
    reader.reset();
    return list;
  });

  return lists;
};

const isFolder = (path) => fs.lstatSync(path).isDirectory();

const isValidPath = (path) => fs.existsSync(path);

const fileName = (filePath) => pt.basename(filePath);

module.exports = {
  fileName,
  isFolder,
  loadFromFile,
  loadFromFolder,
  isValidPath,
};
