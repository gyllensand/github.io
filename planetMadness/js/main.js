window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

/***************************************************************************************** GLOBAL VARIABLES */

var container, camera, scene, renderer, stats, cameraControls;

var clock = new THREE.Clock();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

/***** PARTICLES VARIABLES *****/

// create the particle variables
var particleCount = 1000,
	particles = new THREE.Geometry(),
	pMaterial = new THREE.PointCloudMaterial({
		color: 0xFFFFFF,
		size: 10,
		map: THREE.ImageUtils.loadTexture('img/spark1.png'),
		blending: THREE.AdditiveBlending,
		transparent: true
	});

// create the particle system
var particleSystem = new THREE.PointCloud(
	particles,
	pMaterial);

/***** ASTEROIDS VARIABLES *****/

// create the asteroid variables
var particleCount2 = 200,
	particles2 = new THREE.Geometry(),
	pMaterial2 = new THREE.PointCloudMaterial({
		color: 0xFFFFFF,
		size: 20,
		map: THREE.ImageUtils.loadTexture('img/asteroid.png'),
		blending: THREE.AdditiveBlending,
		transparent: true
	});

// create the asteroid system
var particleSystem2 = new THREE.PointCloud(
	particles2,
	pMaterial2);

// create #wrapper in document
container = document.createElement( 'div' );
container.id = 'wrapper';
document.body.appendChild( container );

init(); // Initializing
animate(); // Start animations

function init() {

/****************************************************************************************************** SCENE */

	scene = new THREE.Scene();

/****************************************************************************************************** CAMERA */

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000 );
	camera.position.x = 0;
	camera.position.y = 10;
	camera.position.z = 300;

/**************************************************************************************************** RENDERER */

	var webglAvailable = ( function () {

		try { 

			return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' );

		}
		catch( e )
		{ 

			return false;
		}
	})();

	try {

		if ( webglAvailable != true ) {

			throw "error";

		} else {

			renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			renderer.setSize( window.innerWidth, window.innerHeight );
			container.appendChild( renderer.domElement );
			renderer.shadowMapType = THREE.PCFSoftShadowMap;
			renderer.shadowMapEnabled = true;
			renderer.autoClear = false;

		}

	}
	catch (e)
	{
	
		switch(e)

		{
			case "error":

				alert("Your browser doesn't seem to support WebGL.");
				window.location.assign("http://www.computeremotions.com");

			break;

		}

	}

/*********************************************************************************************** LIGHTS */

	scene.add( new THREE.AmbientLight( /*0x111111*/ 0x0a0a0a ) );

	sunLight = new THREE.PointLight( 0xffdea4, 1, 0 );
	sunLight.position.set( 500, 200, -300 );
	scene.add(sunLight);

	/***** LENS FLARES *****/

	var textureFlare0 = THREE.ImageUtils.loadTexture( 'img/lensflare0.png' );
	var textureFlare2 = THREE.ImageUtils.loadTexture( 'img/lensflare2.png' );
	var textureFlare3 = THREE.ImageUtils.loadTexture( 'img/lensflare3.png' );

	addLight( 0.55, 0.9, 0.5, 5000, 0, -1000 );
	addLight( 0.08, 0.8, 0.5, 0, 0, -1500 );
/*	addLight( 0.995, 0.5, 0.9, 5000, 5000, -1000 );*/

	function addLight( h, s, l, x, y, z ) {

		var light = new THREE.PointLight( 0xffffff, 0, 4500 );
		light.color.setHSL( h, s, l );
		light.position.set( -700, y, -1200 );
		scene.add( light );

		var flareColor = new THREE.Color( 0xffffff );
		flareColor.setHSL( h, s, l + 0.3 );

		var lensFlare = new THREE.LensFlare( textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor );

		lensFlare.add( textureFlare2, 256, 0.0, THREE.AdditiveBlending );
		lensFlare.add( textureFlare2, 256, 0.0, THREE.AdditiveBlending );
		lensFlare.add( textureFlare2, 256, 0.0, THREE.AdditiveBlending );

		lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

		lensFlare.customUpdateCallback = lensFlareUpdateCallback;
		lensFlare.position.copy( light.position );

		scene.add( lensFlare );

	}

	function lensFlareUpdateCallback( object ) {

		var f, fl = object.lensFlares.length;
		var flare;
		var vecX = -object.positionScreen.x ;
		var vecY = -object.positionScreen.y ;


		for( f = 0; f < fl; f++ ) {

			   flare = object.lensFlares[ f ];

			   flare.x = object.positionScreen.x + vecX * flare.distance;
			   flare.y = object.positionScreen.y + vecY * flare.distance;

			   flare.rotation = 1;

		}

		object.lensFlares[ 2 ].y += 0.025;
		object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );

	}

/*********************************************************************************************** SKYBOX/SPACE */

	// create the geometry/vertices/shape for the skybox
	var spaceGeometry = new THREE.SphereGeometry(3000, 32, 100);

	// apply image as texture
	var spaceTexture = THREE.ImageUtils.loadTexture( 'img/space.jpg' );
	// repeat and wrap the texture around the sphere
	spaceTexture.wrapS = spaceTexture.wrapT = THREE.RepeatWrapping;
	spaceTexture.repeat.set( 2, 1 );
	spaceTexture.anisotropy = 5;

	// create a material from the texture
	var spaceMesh = new THREE.MeshBasicMaterial({
			map: spaceTexture,
			side: THREE.BackSide
		});

	// compund everything above into a mesh
	space = new THREE.Mesh( spaceGeometry, spaceMesh);

	space.position.set( 0, 0, 0);
	space.rotation.set( 0, 0, 0 );
	space.scale.set( 1, 1, 1 );

	// add the mesh to the scene
	scene.add( space );

/********************************************************************************************** PARTICLES */

	/***** PARTICLES *****/

	// create the individual particles
	for (var p = 0; p < particleCount; p++) {

		// create a particle with random position values
		var pX = Math.random() * 1500 - 750,
			pY = Math.random() * 1500 - 750,
			pZ = Math.random() * 3000 - 1500,
			particle = new THREE.Vector3(pX, pY, pZ);

		// add it to the geometry
		particles.vertices.push(particle);
	}

	// add it to the scene
	scene.add(particleSystem);

	/***** ASTEROIDS *****/

	// create the individual particles
	for (var p = 0; p < particleCount2; p++) {

		// create a particle with random position values
		var pX = Math.random() * 5000 - 2500,
			pY = Math.random() * 1500 - 750,
			pZ = Math.random() * 30000 - 15000,
			particle2 = new THREE.Vector3(pX, pY, pZ);

		// add it to the geometry
		particles2.vertices.push(particle2);
	}

	// add it to the scene
	scene.add(particleSystem2);

/******************************************************************************************************* SUN */

	/***** CUSTOM SHADER *****/

	// base image texture for mesh
	var lavaTexture = new THREE.ImageUtils.loadTexture( 'img/lava.jpg');
	lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping; 
	// multiplier for distortion speed 		
	var baseSpeed = 0.01;
	// number of times to repeat texture in each direction
	var repeatS = repeatT = 10.0;
	
	// texture used to generate "randomness", distort all other textures
	var noiseTexture = new THREE.ImageUtils.loadTexture( 'img/cloud.png' );
	noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
	// magnitude of noise effect
	var noiseScale = 0.5;
	
	// texture to additively blend with base image texture
	var blendTexture = new THREE.ImageUtils.loadTexture( 'img/lava.jpg' );
	blendTexture.wrapS = blendTexture.wrapT = THREE.RepeatWrapping; 
	// multiplier for distortion speed 
	var blendSpeed = 0.005;
	// adjust lightness/darkness of blended texture
	var blendOffset = 0.15;

	// texture to determine normal displacement
	var bumpTexture = noiseTexture;
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// multiplier for distortion speed 		
	var bumpSpeed   = 0.05;
	// magnitude of normal displacement
	var bumpScale   = 150.0;
	
	// use "this." to create global object
	this.customUniforms = {
		baseTexture: 	{ type: "t", value: lavaTexture },
		baseSpeed:		{ type: "f", value: baseSpeed },
		repeatS:		{ type: "f", value: repeatS },
		repeatT:		{ type: "f", value: repeatT },
		noiseTexture:	{ type: "t", value: noiseTexture },
		noiseScale:		{ type: "f", value: noiseScale },
		blendTexture:	{ type: "t", value: blendTexture },
		blendSpeed: 	{ type: "f", value: blendSpeed },
		blendOffset: 	{ type: "f", value: blendOffset },
		bumpTexture:	{ type: "t", value: bumpTexture },
		bumpSpeed: 		{ type: "f", value: bumpSpeed },
		bumpScale: 		{ type: "f", value: bumpScale },
		alpha: 			{ type: "f", value: 1.0 },
		time: 			{ type: "f", value: 1.0 },
	};
	
	// create custom material from the shader code above
	var sunMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: customUniforms,
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	});
		
	var sunGeometry = new THREE.SphereGeometry( 400, 64, 64 );
	sun = new THREE.Mesh( sunGeometry, sunMaterial );
	sun.position.set( 400, 200, -600 );
	scene.add( sun );

/************************************************************************************************** NEPTUNE */

	/***** CUSTOM SHADER *****/

	var waterTexture = new THREE.ImageUtils.loadTexture( 'img/neptune2.jpg' );
	var waterTexture2 = new THREE.ImageUtils.loadTexture( 'img/cloud.png' );

	waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
	waterTexture2.wrapS = waterTexture2.wrapT = THREE.RepeatWrapping; 

	// use "this." to create global object
	this.customUniforms2 = {
		baseTexture: 	{ type: "t", value: waterTexture },
		baseSpeed:		{ type: "f", value: 0.05 },
		repeatS:		{ type: "f", value: 3 },
		repeatT:		{ type: "f", value: 3 },
		noiseTexture:	{ type: "t", value: waterTexture2 },
		noiseScale:		{ type: "f", value: 1.05 },
		bumpTexture:	{ type: "t", value: waterTexture },
		bumpSpeed: 		{ type: "f", value: bumpSpeed },
		bumpScale: 		{ type: "f", value: 0 },
		alpha: 			{ type: "f", value: 1.0 },
		time: 			{ type: "f", value: 1.0 }
	};

	// create custom material from the shader code above
	var neptuneMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: customUniforms2,
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader2' ).textContent
	});

	// other material properties
	neptuneMaterial.side = THREE.DoubleSide;

	// apply the material to a surface
	var neptuneGeometry = new THREE.SphereGeometry(250, 32, 100);
	neptune = new THREE.Mesh( neptuneGeometry, neptuneMaterial );
	neptune.position.set( -1500, 100, -800 );
	neptune.rotation.set( 0, 0, 0 );
	neptune.scale.set( 1, 1, 1 );
	scene.add( neptune );

/*************************************************************************************************** EARTH */

	var earthGeometry = new THREE.SphereGeometry(100, 32, 100);
	var earthMesh = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/earth.jpg')
		});

	earth = new THREE.Mesh( earthGeometry, earthMesh);

	earth.position.set( -300, 0, -300 );
	earth.rotation.set( 0, 0, 0 );
	earth.scale.set( 1, 1, 1 );

	scene.add( earth );

	/***** MOON *****/

	var moonGeometry = new THREE.SphereGeometry(10, 32, 100);
	var moonMesh = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/moon.jpg')
		});

	moon = new THREE.Mesh( moonGeometry, moonMesh);

	moon.position.set( -100, 0, 100 );
	moon.rotation.set( 0, 0, 0 );
	moon.scale.set( 1, 1, 1 );

	earth.add( moon );


/************************************************************************************************* MARS */

	var marsGeometry = new THREE.SphereGeometry(50, 32, 100);
	var marsMesh = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/mars.jpg')
		});

	mars = new THREE.Mesh( marsGeometry, marsMesh);

	mars.position.set( -200, 200, -600 );
	mars.rotation.set( 0, 0, 0 );
	mars.scale.set( 1, 1, 1 );

	scene.add( mars );

/********************************************************************************************* VENUS */

	var venusGeometry = new THREE.SphereGeometry(100, 32, 100);
	var venusMesh = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/venus.jpg')
		});

	venus = new THREE.Mesh( venusGeometry, venusMesh);

	venus.position.set( 2000, -1000, 500 );
	venus.rotation.set( 0, 0, 0 );
	venus.scale.set( 1, 1, 1 );

	scene.add( venus );

	/***** ORBITING RINGS *****/

	var venusRingGeometry = new THREE.TorusGeometry( 120, 5, 5, 100 );

	var venusRingMesh = new THREE.MeshPhongMaterial({
			color: 0xffdea4
		});

	venusRing = new THREE.Mesh( venusRingGeometry, venusRingMesh);

	venus.add(venusRing);

	/**************************/

	var venusRing2Geometry = new THREE.TorusGeometry( 150, 5, 5, 100 );

	var venusRing2Mesh = new THREE.MeshPhongMaterial({
			color: 0x863232
		});

	venusRing2 = new THREE.Mesh( venusRing2Geometry, venusRing2Mesh);

	venus.add(venusRing2);

/************************************************************************************************* MERCURY */

	var mercuryGeometry = new THREE.SphereGeometry(200, 32, 100);
	var mercuryMesh = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/mercury.jpg')
		});

	mercury = new THREE.Mesh( mercuryGeometry, mercuryMesh);

	mercury.position.set( 1500, 200, -400 );
	mercury.rotation.set( 0, 0, 0 );
	mercury.scale.set( 1, 1, 1 );

	scene.add( mercury );

/************************************************************************************************ SATURN */

	var saturnGeometry = new THREE.SphereGeometry(200, 32, 100);
	var saturnMesh = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/saturn3.jpg')
		});

	saturn = new THREE.Mesh( saturnGeometry, saturnMesh);

	saturn.position.set( -1500, -200, 700 );
	saturn.rotation.set( 0, 0, -0.5 );
	saturn.scale.set( 1, 1, 1 );
	saturn.receiveShadow = true;
	saturn.castShadow = true;

	scene.add( saturn );

	/***** ORBITING RINGS *****/

	var ringGeometry = new THREE.TorusGeometry( 300, 50, 2, 100 );
	var ringTexture = THREE.ImageUtils.loadTexture( 'img/saturn_ring.jpg' );
	ringTexture.wrapS = ringTexture.wrapT = THREE.RepeatWrapping;
	ringTexture.repeat.set( 20, 5 );

	var ringMesh = new THREE.MeshBasicMaterial({
			map: ringTexture
		});

	ring = new THREE.Mesh( ringGeometry, ringMesh);

	ring.rotation.x = - Math.PI / 2;

	saturn.add(ring);

	/***** ORBITING PLANET *****/

	var saturn2Geometry = new THREE.SphereGeometry(30, 32, 100);
	var saturn2Mesh = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/sun.jpg')
		});

	saturn2 = new THREE.Mesh( saturn2Geometry, saturn2Mesh);

	saturn2.position.set( -400, 100, 200 );
	saturn2.rotation.set( 0, 0, 0 );
	saturn2.scale.set( 1, 1, 1 );
	saturn2.receiveShadow = true;
	saturn2.castShadow = true;

	saturn.add( saturn2 );

/**************************************************************************************************** JUPITER */

	var jupiterGeometry = new THREE.SphereGeometry(200, 32, 100);
	var jupiterMesh = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/jupiter.jpg')
		});

	jupiter = new THREE.Mesh( jupiterGeometry, jupiterMesh);

	jupiter.position.set( 1000, 0, 1000 );
	jupiter.rotation.set( 0, 0, 0 );
	jupiter.scale.set( 1, 1, 1 );

	scene.add( jupiter );

/*********************************************************************************************** ORBIT CONTROLS */

	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );

	cameraControls.noKeys = true;
	cameraControls.noPan = true;
	cameraControls.rotateSpeed = 0.5;
	cameraControls.zoomSpeed = 0.5;
	cameraControls.minPolarAngle = 0.8;
	cameraControls.maxPolarAngle = 2.2;
	cameraControls.minAzimuthAngle = - 2;
	cameraControls.maxAzimuthAngle = 2;
	cameraControls.maxDistance = 1900;

	stats = new Stats();
	container.appendChild( stats.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}; // End init

/***************************************************************************************** RESPONSIVE WINDOW */

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

/************************************************************************************************* ANIMATION */

function animate() {

	requestAnimationFrame( animate );

	render();
	update();

}


function update() {

	var delta = clock.getDelta(); // seconds.

	customUniforms.time.value += delta;
	customUniforms2.time.value += delta;

	cameraControls.update();
	stats.update();

	/***** UPDATE PARTICLES *****/

	// add some rotation to the system
	particleSystem.rotation.y += 0.005;

	var pCount = particleCount;
	while (pCount--) {

	// get the particle
	var particle =
	  particles.vertices[pCount];

	}

	// flag to the particle system
	// that we've changed its vertices.
	particleSystem.
	geometry.
	__dirtyVertices = true;


	/***** UPDATE ASTEROIDS *****/

	// add some rotation to the system
	particleSystem2.rotation.y -= 0.01;

	var pCount2 = particleCount2;
	while (pCount2--) {

	// get the particle
	var particle2 =
	  particles2.vertices[pCount];

	}

	// flag to the particle system
	// that we've changed its vertices.
	particleSystem2.
	geometry.
	__dirtyVertices = true;

}

/********************************************************************************************** RENDERING */

function render() {

	sun.rotation.y += 0.1 / 100;

	earth.rotation.y += 0.1 / 50;

	moon.rotation.y += 0.1 / 10;

	mars.rotation.y -= 0.1 / 30;

	venus.rotation.y -= 0.1 / 20;
	venusRing.rotation.x += 0.1 / 5;
	venusRing2.rotation.y += 0.1 / 5;

	mercury.rotation.y += 0.1 / 70;

	saturn.rotation.y += 0.1 / 70;
	saturn2.rotation.x += 0.1 / 10;

	jupiter.rotation.y -= 0.1 / 70;

	renderer.render( scene, camera );

}