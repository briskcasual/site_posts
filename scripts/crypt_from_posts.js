// Create an incripted collection of files from the _posts folder
// The _posts folder should be in the .gitignore file and the _crypto
// folder should be public

// This is just to hide the markdown source from google bot,
// so the key and iv is in the source here

// using the node.js crypto module
let crypto = require('crypto'),
	fs = require('fs'),
	path = require('path'),
	
	key = Buffer.alloc(32), // key should be 32 bytes
    iv = Buffer.alloc(16), // iv should be 16
	
	a = 'aes-256-cbc',
	
	// this should point to the _posts folder
	dir_posts = path.join(__dirname,'../_posts'),
	dir_crypto = path.join(__dirname,'../_crypto');

    // not so secure (just want to hide from google index anyway)
    key = Buffer.concat([Buffer.from('1234-spaceballs')], key.length);
    iv = Buffer.from(Array.prototype.map.call(iv, () => {return 128;}));
	
//let cipher = crypto.createCipheriv(a, key, iv);

let readDir = (dir) =>{
	return new Promise((resolve,reject)=>{
        fs.readdir(dir_posts, function(e,files){
		    if(e){
			    reject(e);
			}else{
			    resolve(files)
			}
        });
	});
};

// open the file and crypto it
let nextFile = function(fileDir,next){

	fs.readFile(fileDir, function(e,data){
	
		console.log(data);
		next();
		
	});
	
};
					   
readDir(dir_posts).then((files)=>{

	let i = 0,
		
		read = (fileDir)=>{
		
			let outfile = path.join(dir_crypto, files[i]),
				writer = fs.createWriteStream(outfile),
				cipher = crypto.createCipheriv(a, key, iv);
			
			writer.on('close', function(){
			    console.log('cypher for '+ files[i] + ' done.');
			});
			
            fs.createReadStream(fileDir)
			.pipe(cipher)
			.on('data',(data)=>{
			    console.log('writing...');
				writer.write(data);
			})
			.on('end', ()=>{
				writer.end(()=>{
				   nextFile();
				});
			})
		},
		
		nextFile = ()=>{
		   i += 1;
		   if(i<files.length){
		      read(path.join(dir_posts, files[i]));
		   
		   }
		};
	
	read(path.join(dir_posts, files[0]));
	
}).catch((e)=>{
    console.log(e.message);
})


//let cipher = crypto.createCipheriv(a, key, iv);