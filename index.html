<html>

	<head>
		<title>Planet Madness - Three.js</title>
		<link rel="stylesheet" href="css/style.css" type="text/css" />
	</head>

	<body>

		<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
		<script src="js/link.json"></script>
		<script src="js/three.min.js"></script>
		<script src="js/OrbitControls.js"></script>
		<script src="js/stats.min.js"></script>

		<!-- VERTEX SHADER -->

		<script id="vertexShader" type="x-shader/x-vertex">

		uniform sampler2D noiseTexture;
		uniform float noiseScale;

		uniform sampler2D bumpTexture;
		uniform float bumpSpeed;
		uniform float bumpScale;

		uniform float time;
		varying vec3 vNormal;
		varying vec2 vUv;

		void main() 
		{ 
			vUv = uv;
			
			vec2 uvTimeShift = vUv + vec2( 1.1, 1.9 ) * time * bumpSpeed;
			vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );
			vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.g );

			vec4 bumpData = texture2D( bumpTexture, uvTimeShift );

			// move the position along the normal but displace the vertices at the poles by the same amount
			float displacement = ( vUv.y > 0.999 || vUv.y < 0.001 ) ? 
				bumpScale * (0.3 + 0.02 * sin(time)) :  
				bumpScale * bumpData.r;
			vec3 newPosition = position + normal * displacement;
			
			vNormal = normal;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
		}
		</script>


		<!-- FRAGMENT SHADERS -->

		<script id="fragmentShader" type="x-shader/x-vertex">

		uniform sampler2D baseTexture;
		uniform float baseSpeed;
		uniform float repeatS;
		uniform float repeatT;

		uniform sampler2D noiseTexture;
		uniform float noiseScale;

		uniform sampler2D blendTexture;
		uniform float blendSpeed;
		uniform float blendOffset;

		uniform float time;
		uniform float alpha;

		varying vec2 vUv;

		void main() 
		{
			vec2 uvTimeShift = vUv + vec2( -0.7, 1.5 ) * time * baseSpeed;	
			vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );
			vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.b );
			vec4 baseColor = texture2D( baseTexture, uvNoiseTimeShift * vec2(repeatS, repeatT) );

			vec2 uvTimeShift2 = vUv + vec2( 1.3, -1.7 ) * time * blendSpeed;	
			vec4 noiseGeneratorTimeShift2 = texture2D( noiseTexture, uvTimeShift2 );
			vec2 uvNoiseTimeShift2 = vUv + noiseScale * vec2( noiseGeneratorTimeShift2.g, noiseGeneratorTimeShift2.b );
			vec4 blendColor = texture2D( blendTexture, uvNoiseTimeShift2 * vec2(repeatS, repeatT) ) - blendOffset * vec4(1.0, 1.0, 1.0, 1.0);

			vec4 theColor = baseColor + blendColor;
			theColor.a = alpha;

			gl_FragColor = theColor;
		}  
		</script>

		<script id="fragmentShader2" type="x-shader/x-vertex">

		uniform sampler2D baseTexture;
		uniform float baseSpeed;
		uniform float repeatS;
		uniform float repeatT;

		uniform sampler2D noiseTexture;
		uniform float noiseScale;

		uniform sampler2D blendTexture;
		uniform float blendSpeed;
		uniform float blendOffset;

		uniform float time;
		uniform float alpha;

		varying vec3 vNormal;
		varying vec2 vUv;

		void main() 
		{
			vec2 uvTimeShift = vUv + vec2( -0.7, 1.5 ) * time * baseSpeed;	
			vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );
			vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.b );
			vec4 baseColor = texture2D( baseTexture, uvNoiseTimeShift * vec2(repeatS, repeatT) );

			vec2 uvTimeShift2 = vUv + vec2( 1.3, -1.7 ) * time * blendSpeed;	
			vec4 noiseGeneratorTimeShift2 = texture2D( noiseTexture, uvTimeShift2 );
			vec2 uvNoiseTimeShift2 = vUv + noiseScale * vec2( noiseGeneratorTimeShift2.g, noiseGeneratorTimeShift2.b );
			vec4 blendColor = texture2D( blendTexture, uvNoiseTimeShift2 * vec2(repeatS, repeatT) ) - blendOffset * vec4(1.0, 1.0, 1.0, 1.0);

			vec4 theColor = baseColor + blendColor;
			theColor.a = alpha;

			// calc the dot product and clamp
			vec3 light = vec3(20, -2, 0.0);

			// ensure it's normalized
			light = normalize(light);

			// calculate the dot product of the light to the vertex normal
			float dProd = max(0.03,
							dot(vNormal, light));
			
			gl_FragColor = theColor * vec4(dProd, // R
							  dProd, // G
							  dProd, // B
							  1.0);  // A;
		}  
		</script>

		<!-- MAIN ANIMATION -->

		<script src="js/main.js"></script>

		<div id="info">Planet Madness<br/>
			By <a id="website" target="_blank"></a><br/>
			<a id="music">Turn off music</a>
			<p>Press "i" for info</p>
		</div>

		<div id="about">
			<p>A little 3D-animation made in WebGL using Three.js</p>
			<p>Solar system obviously not scaled or correct in any way whatsoever!</p>
			<p>Music by Cabbibo - https://soundcloud.com/cabbibo<p/><br/>
			<p>Drag your mouse to rotate the camera and zoom in/out by using your scroll</p>
		</div>

		<audio id="audio" autoplay loop>
			<source src="audio/cabbibo.mp3" type="audio/mpeg">
			Your browser does not support the audio element.
		</audio>

		<!-- MUSIC DISABLING / JSON CALLS -->

		<script>

			// set the volume to 30%
			var audio = document.getElementById('audio');
			audio.volume = 0.3;

			// toggle music - play or pause
			$('#music').click(function() {
				if (audio.paused == false) {
					audio.pause();
					$('#music').html("Turn on music");
				} else {
					audio.play();
					$('#music').html("Turn off music");
				}
			});

			// show div on keydown
			$(document).keydown(function(event){
				if (event.which == 73) {
					$("#about").show();
				} 
			});

			// hide div on keyup
			$(document).keyup(function(event){
				if (event.which == 73) {
					$("#about").hide();
				} 
			});

			// load name and url from external json file
			$.getJSON("js/link.json", function(json) {
				var name = json.data[0].name;
				var url = json.data[0].url;

				document.getElementById('website').innerHTML = name,
				document.getElementById('website').href = url;
			});
			
		</script>

	</body>

</html>