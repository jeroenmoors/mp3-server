var BinaryServer 	= require('binaryjs').BinaryServer,
	fs 				= require('fs'),
	mp3Parser 		= require("mp3-parser"),
	util			= require('util');


console.log("mp3 Parser version: " + mp3Parser.version);;

var mp3File = 'Jahzzar_-_03_-_Heartbreaker.mp3';
var mp3 = fs.createReadStream(mp3File);
var mp3Buffer = fs.readFileSync(mp3File);

var toArrayBuffer = function (buffer) {
	var bufferLength = buffer.length;
	var i = 0;
	var uint8Array = new Uint8Array(new ArrayBuffer(bufferLength));
	for (; i < bufferLength; ++i) { 
		uint8Array[i] = buffer[i]; 
	}
	return uint8Array.buffer;
};

fs.readFile(mp3File, function (error, buffer) {
    if (error) {
        console.log("Oops: " + error);
        process.exit(1);
    }
    buffer = new DataView(toArrayBuffer(buffer));

    var tags = mp3Parser.readTags(buffer);
    
    var frameOffset;
    tags.forEach(function(section) {
		if(section._section.type == 'frame') {
			frameOffset = section._section.offset;
		}
	});
    console.log("First frame offset : " + frameOffset);
	
	fs.writeFileSync("/tmp/test000000.mp3", mp3Buffer.slice(0, frameOffset));
		
	// Loop over all frames...
	var i = 0;
	var result = new Buffer(80000);
	while(i < 1000) {
		i++;
		var frame = mp3Parser.readFrame(buffer, frameOffset);
		var frameLength 	= frame._section.byteLength;
		var frameNextIndex 	= frame._section.nextFrameIndex;
		console.log("Frame offset: " + frameOffset + " // Frame length: " + frameLength + " // Next frame index: " + frameNextIndex);
		var frameBuffer = mp3Buffer.slice(frameOffset, frameOffset + frameLength);
		
		frameBuffer.copy(result, result.length, 0, frameBuffer.length);
		//console.log(frameBuffer.length); return;
		//fs.writeFileSync("/tmp/test" + frameOffset + ".mp3", frameBuffer);
		frameOffset = frameNextIndex;
    }
    
    fs.writeFileSync("/tmp/test.mp3", result);
});

/*
var server = new BinaryServer({
  host: '127.0.0.1',
  port: 66600
});

server.on('connection', function (client) {
  mp3.pipe(client.createStream());
});
*/
