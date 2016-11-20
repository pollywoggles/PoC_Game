var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {
    // scene

    var scene = new BABYLON.Scene(engine);
    var bgcolor = BABYLON.Color3.FromHexString('#101230');
    scene.clearColor = bgcolor;
    scene.ambientColor = bgcolor;
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = bgcolor;
    scene.fogDensity = 0.03;
    scene.fogStart = 10.0;
    scene.fogEnd = 70.0;
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    scene.collisionsEnabled = true;

    // camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 30, new BABYLON.Vector3(0, 3, 0), scene);

    // lights
    var torch = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
    torch.intensity = 0.7;
    torch.diffuse = BABYLON.Color3.FromHexString('#ff9944');

    var sky = new BABYLON.HemisphericLight("sky", new BABYLON.Vector3(0, 1.0, 0), scene);
    sky.intensity = 0.5;
    sky.diffuse = bgcolor;

    // shadow
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, torch);
    shadowGenerator.setDarkness(0.2);
    //shadowGenerator.usePoissonSampling = true;
    shadowGenerator.useBlurVarianceShadowMap = true;
    shadowGenerator.blurBoxOffset = 1.0;
    shadowGenerator.blurScale = 20.0;
    //shadowGenerator.bias = 0.00001;

    // materials
    var brickTexture = new BABYLON.BrickProceduralTexture(name + "text", 512, scene);
    brickTexture.numberOfBricksHeight = 5;
    brickTexture.numberOfBricksWidth = 5;
    var wallMat = new BABYLON.StandardMaterial("wmat", scene);
    wallMat.diffuseTexture = brickTexture;

    var customProcTextmacadam = new BABYLON.RoadProceduralTexture("customtext", 512, scene);
    var groundMat = new BABYLON.StandardMaterial("gmat", scene);
    groundMat.diffuseTexture = customProcTextmacadam;
    groundMat.diffuseTexture.uScale = 10;
    groundMat.diffuseTexture.vScale = 10;
    groundMat.specularPower = 5;

    var player1Mat = new BABYLON.StandardMaterial("pmat", scene);
    player1Mat.emissiveColor = BABYLON.Color3.FromHexString('#ff9900');
    player1Mat.specularPower = 128;

    var playereMat = new BABYLON.StandardMaterial("pemat", scene);
    playereMat.emissiveColor = BABYLON.Color3.FromHexString('#ffffff');
    playereMat.specularPower = 128;

    var playerbMat = new BABYLON.StandardMaterial("pbmat", scene);
    playerbMat.diffuseColor = BABYLON.Color3.Black();

    //player ----
    var player = BABYLON.Mesh.CreateSphere("playerbody", 8, 1.8, scene);
    player.material = player1Mat;
    player.position.y = 0.9;

    var playere1 = BABYLON.Mesh.CreateSphere("eye1", 8, 0.5, scene);
    playere1.material = playereMat;
    playere1.position.y = 0.5;
    playere1.position.z = 0.5;
    playere1.position.x = -0.3;
    playere1.parent = player;

    var playere2 = BABYLON.Mesh.CreateSphere("eye2", 8, 0.5, scene);
    playere2.material = playereMat;
    playere2.position.y = 0.5;
    playere2.position.z = 0.5;
    playere2.position.x = 0.3;
    playere2.parent = player;

    var playereb1 = BABYLON.Mesh.CreateSphere("eye1b", 8, 0.25, scene);
    playereb1.material = playerbMat;
    playereb1.position.y = 0.5;
    playereb1.position.z = 0.7;
    playereb1.position.x = -0.3;
    playereb1.parent = player;

    var playereb2 = BABYLON.Mesh.CreateSphere("eye2b", 8, 0.25, scene);
    playereb2.material = playerbMat;
    playereb2.position.y = 0.5;
    playereb2.position.z = 0.7;
    playereb2.position.x = 0.3;
    playereb2.parent = player;

    shadowGenerator.getShadowMap().renderList.push(player);
    player.checkCollisions = true;
    player.applyGravity = true;
    player.ellipsoid = new BABYLON.Vector3(0.9, 0.45, 0.9);
    player.speed = new BABYLON.Vector3(0, 0, 0.08);
    player.nextspeed = new BABYLON.Vector3.Zero();
    player.nexttorch = new BABYLON.Vector3.Zero();

    var lightImpostor = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.1, scene);
    var lightImpostorMat = new BABYLON.StandardMaterial("mat", scene);
    lightImpostor.material = lightImpostorMat;
    lightImpostorMat.emissiveColor = BABYLON.Color3.Yellow();
    lightImpostorMat.linkEmissiveWithDiffuse = true;
    lightImpostor.position.y = 4.0;
    lightImpostor.position.z = 0.7;
    lightImpostor.position.x = 1.2;
    lightImpostor.parent = player;

    // ground

    var ground = BABYLON.Mesh.CreatePlane("g", 120, scene);
    ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.rotation.x = Math.PI / 2;
    ground.material = groundMat;
    ground.receiveShadows = true;
    ground.checkCollisions = true;

    for (var i = 0; i < 100; i++) {
        var px = Math.random() * 100 - 50;
        var pz = Math.random() * 100 - 50;
        if ((px > 4 || px < -4) && (pz > 4 || pz < -4)) {
            var wall = BABYLON.Mesh.CreateBox("w" + i, 3, scene);
            wall.position = new BABYLON.Vector3(px, 1.5, pz);
            if (Math.random() > 0.5) {
                wall.scaling.x = 3;
            } else {
                wall.scaling.z = 3;
            }
            wall.material = wallMat;
            shadowGenerator.getShadowMap().renderList.push(wall);
            //wall.receiveShadows = true;
            wall.checkCollisions = true;
        }
    }

    //keypress events
    window.keyisdown = {};
    window.addEventListener('keydown', function (event) {
        window.keyisdown[event.keyCode] = true;
    });

    window.addEventListener('keyup', function (event) {
        window.keyisdown[event.keyCode] = false;
    });

    window.addEventListener('blur', function (event) {
        for (var k in window.keyisdown) {
            window.keyisdown[k] = false;
        }
    });

    window.tempv = new BABYLON.Vector3.Zero();

    scene.registerBeforeRender(function () {

        //player speed
        var v = 0.5;
        player.nextspeed.x = 0.0;
        player.nextspeed.z = 0.00001;
        if (window.keyisdown[37]) { player.nextspeed.x = -v; }
        if (window.keyisdown[39]) { player.nextspeed.x = v; }
        if (window.keyisdown[38]) { player.nextspeed.z = v; }
        if (window.keyisdown[40]) { player.nextspeed.z = -v; }
        player.speed = BABYLON.Vector3.Lerp(player.speed, player.nextspeed, 0.1);

        //turn to dir
        if (player.speed.length() > 0.01) {
            tempv.copyFrom(player.speed);
            var dot = BABYLON.Vector3.Dot(tempv.normalize(), BABYLON.Axis.Z);
            var al = Math.acos(dot);
            if (tempv.x < 0.0) { al = Math.PI * 2.0 - al; }
            if (window.keyisdown[9]) {
                console.log("dot,al:", dot, al);
            }
            if (al > player.rotation.y) {
                var t = Math.PI / 30;
            } else {
                var t = -Math.PI / 30;
            }
            var ad = Math.abs(player.rotation.y - al);
            if (ad > Math.PI) {
                t = -t;
            }
            if (ad < Math.PI / 15) {
                t = 0;
            }
            player.rotation.y += t;
            if (player.rotation.y > Math.PI * 2) { player.rotation.y -= Math.PI * 2; }
            if (player.rotation.y < 0) { player.rotation.y += Math.PI * 2; }
        }

        player.moveWithCollisions(player.speed);

        if (player.position.x > 60.0) { player.position.x = 60.0; }
        if (player.position.x < -60.0) { player.position.x = -60.0; }
        if (player.position.z > 60.0) { player.position.z = 60.0; }
        if (player.position.z < -60.0) { player.position.z = -60.0; }

        player.nexttorch = lightImpostor.getAbsolutePosition();
        torch.position.copyFrom(player.nexttorch);
        torch.intensity = 0.7 + Math.random() * 0.1;
        torch.position.x += Math.random() * 0.125 - 0.0625;
        torch.position.z += Math.random() * 0.125 - 0.0625;
        camera.target = BABYLON.Vector3.Lerp(camera.target, player.position.add(player.speed.scale(15.0)), 0.05);
        camera.radius = camera.radius * 0.95 + (25.0 + player.speed.length() * 25.0) * 0.05;

    });

    return scene;

};

var scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});