
var container, stats;

var camera, scene, renderer;

var cube;

var rotate = true;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

container = document.createElement( 'div' );
container.id = 'wrapper';
document.body.appendChild( container );

init(); // INITIALIZING
animate(); // START ANIMATIONS

function init() {

/**************************************************************************************************************************
****************************************************************************************************************** SCENE */

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xcce0ff, 0.07 );

/**************************************************************************************************************************
***************************************************************************************************************** CAMERA */

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 4;

/**************************************************************************************************************************
******************************************************************************************************************* CUBE */

	var materials = [
		new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/checkerboard.jpg')
		}),
		new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/sea.jpg')
		}),
		new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/sea.jpg')
		}),
		new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/sea.jpg')
		}),
		new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/sea.jpg')
		}),
		new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/sea.jpg')
		})
	];

	cube = new THREE.Mesh(
		   new THREE.BoxGeometry( 2, 2, 2, 2, 2, 2 ),
		   new THREE.MeshFaceMaterial( materials ) );
	cube.castShadow = true;
	scene.add( cube );

/**************************************************************************************************************************
***************************************************************************************************************** LIGHTS */

	var light;

	scene.add( new THREE.AmbientLight( 0x666666 ) );

	light = new THREE.DirectionalLight( 0xdfebff, 1 );
	light.position.set( 300, 200, 200 );
	light.position.multiplyScalar( 1.3 );

	light.castShadow = true;
	light.shadowCameraVisible = true;

	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;

	var d = 10;

	light.shadowCameraLeft = -d;
	light.shadowCameraRight = d;
	light.shadowCameraTop = d;
	light.shadowCameraBottom = -d;

	light.shadowCameraFar = 1000;
	light.shadowDarkness = 0.5;

	scene.add( light );

/**************************************************************************************************************************
****************************************************************************************************************** PLANE */

	var groundTexture = THREE.ImageUtils.loadTexture( 'img/ground.jpg' );
		groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
		groundTexture.repeat.set( 30, 30 );
		groundTexture.anisotropy = 5;

	geometry = new THREE.PlaneBufferGeometry(80, 80);
	 
	groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } )

	var ground = new THREE.Mesh( geometry, groundMaterial );
	ground.position.y = -3;
	ground.rotation.x = - Math.PI / 2;
	ground.receiveShadow = true;

	scene.add( ground );

/*	var groundTexture = THREE.ImageUtils.loadTexture( 'img/ground.jpg' );
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set( 30, 30 );
	groundTexture.anisotropy = 5;

	geometry = new THREE.PlaneBufferGeometry(80, 80);
	 
	groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture, side:THREE.DoubleSide } )

	var wall = new THREE.Mesh( geometry, groundMaterial );
	wall.position.y = 20;
	wall.position.z = 5;
	wall.rotation.x = - Math.PI / 40;
	wall.receiveShadow = true;

	scene.add( wall );*/

/**************************************************************************************************************************
*************************************************************************************************************** RENDERER */

	renderer = new THREE.WebGLRenderer({ antialias: true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	renderer.setClearColor( scene.fog.color );
	renderer.shadowMapType = THREE.PCFSoftShadowMap;
	renderer.shadowMapEnabled = true;

	stats = new Stats();
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

/**************************************************************************************************************************
****************************************************************************************************** RESPONSIVE WINDOW */

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

/**************************************************************************************************************************
***************************************************************************************************** CUBE ORBIT CONTROL */

/*controls = new THREE.OrbitControls(camera, renderer.domElement);*/
function onDocumentMouseDown( event ) {

	event.preventDefault();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;

}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;

	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;

}

function onDocumentMouseUp( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentMouseOut( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

	}

}

/**************************************************************************************************************************
************************************************************************************************************** ANIMATION */

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();
	}

/**************************************************************************************************************************
************************************************************************************************************** RENDERING */

function render() {

	// AUTO ROTATE CAMERA
	var timer = Date.now() * 0.0002;
	
	if ( rotate ) {

		camera.position.x = Math.cos( timer ) * 4;
		camera.position.z = Math.sin( timer ) * 4;
		camera.lookAt( cube.position );
	}

	// CUBE ROTATION
	cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;

/*  cube.rotation.x += 0.1 / 20;*/
/*	cube.rotation.y += 0.1 / 10;*/
/*	controls.update();*/

	renderer.render( scene, camera );
}
