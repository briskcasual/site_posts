let crypto = require('crypto'),
path = require('path'),
fs = require('fs');
 
// Cipher Suites, key, and the iv
let a = 'aes-256-cbc',
key = Buffer.alloc(32), // key should be 32 bytes
iv = Buffer.alloc(16), // iv should be 16
 
filename = process.argv[2] || 'test.txt',
bName = path.basename(filename, path.extname(filename)),
passwd = process.argv[3] || '1234-spaceballs',
outfile = bName + '.coded';
 
// make the key something other than a blank buffer
key = Buffer.concat([Buffer.from(passwd)], key.length);
 
// randomize the iv, for best results
iv = Buffer.from(Array.prototype.map.call(iv, () => {return Math.floor(Math.random() * 256)})),
 
// make the cipher with the current suite, key, and iv
cipher = crypto.createCipheriv(a, key, iv);
 
// read test.txt
fs.createReadStream(filename)
 
// pipe to cipher
.pipe(cipher)
 
// pipe to writer
.pipe(fs.createWriteStream(outfile)
 
.on('close', ()=> {
 
    console.log(outfile + ' has been coded with: ');
    console.log('key:');
    console.log(key.toString('hex'));
    console.log('iv');
    console.log(iv.toString('hex'));
 
    fs.writeFile(bName + '-keys.json',
 
        // this will be the json
        JSON.stringify({
            key: key.toString('hex'),
            iv: iv.toString('hex')
        }),
 
        // callback
        (e)=> {
 
            if (e) {
 
                console.log('error writing keys.json');
 
            } else {
 
                console.log('keys.josn written');
 
            }
 
        }
 
    );
 
}));