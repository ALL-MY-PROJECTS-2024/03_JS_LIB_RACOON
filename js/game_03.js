class Game{
    constructor(){
        this.scene;
        this.player={};
        this.renderer;
        this.camera;
        this.orbCtrl;
        this.clock = new THREE.Clock();
        this.animations={};
        //-----------------------------
        // 03 배경색 지정위함
        //-----------------------------
        this.container;
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        //-----------------------------
        const game = this;
        this.aniInit();

    }
    aniInit(){
        this.scene= new THREE.Scene();
        //-----------------------------
        //03 배경색 지정위함
        //-----------------------------
        this.scene.background = new THREE.Color("#D5D5D5");
        //-----------------------------

        this.camera = new THREE.PerspectiveCamera(100,window.innerWidth/window.innerHeight,0.1,1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        const geometry = new THREE.BoxGeometry(1,1,1);
        // const light = new THREE.DirectionalLight("#FF0000");
        const light = new THREE.DirectionalLight("#FFFFFF");
        light.position.set(0,20,10);

        //-----------------------------
        //03 그림자
        //-----------------------------
        light.castShadow = true;
        light.shadow.camera.top =50;
        light.shadow.camera.bottom =-50;
        light.shadow.camera.left =-50;
        light.shadow.camera.right =50;
        this.shadow = light;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        //-----------------------------

        const ambient = new THREE.AmbientLight("#FFFFFF");
        const material = new THREE.MeshPhongMaterial({color : "#FFFFFF"});
        
        this.cube = new THREE.Mesh(geometry,material);
        
        //-----------------------------
        //03 바닥 만들기
        //-----------------------------
        //바닥구분
        var mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(5000,5000),
            new THREE.MeshPhongMaterial({color:0x999999,depthWrite : false})
        );
        mesh.rotation.x = -Math.PI /2;
        mesh.position.y = -30;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        //그리드효과
        var grid = new THREE.GridHelper(5000,50,0x000000,0x000000);
        grid.position.y = -30;
        //grid.material.transparent = true;
        grid.material.opacity = 0.3;
        this.scene.add(grid);
        //-----------------------------

        this.camera.position.z = 5;
       

        const fbxloader = new THREE.FBXLoader();
        // const game = this;
        fbxloader.load(`./assets/RaccoonAction.fbx`,function(object){

            //-----------------------------
            //02 Added - Action
            //-----------------------------
            object.mixer = new THREE.AnimationMixer(object);
            object.name="Raccoon";
            game.player.mixer = object.mixer;
            game.player.root = object.mixer.getRoot();
            console.log(object.mixer.getRoot());
            //-----------------------------

            game.scene.add(object);
            object.position.y = -1;
            object.position.x = 0;
            object.scale.x = 0.5;
            object.scale.y = 0.5;
            object.scale.z = 0.5;

            //-----------------------------
            //03 그림자
            //-----------------------------
            object.traverse(function(child){
                if(child.isMesh){
                    child.castShadow = true;
                }
            });


            //-----------------------------


            //-----------------------------
            //02 Added - Action
            //-----------------------------
            game.player.object=object;
            game.nextAni(fbxloader);
            //-----------------------------



        });
  
        this.scene.add(this.cube);
        this.scene.add(light);
        this.scene.add(ambient);

        //-----------------------------
        // 03   마우스 클릭시 카메라 시점이동
        //-----------------------------
        this.orbCtrl = new THREE.OrbitControls(this.camera,this.renderer.domElement);
        this.orbCtrl.target.set(0,0,0);
        this.orbCtrl.update();
        //-----------------------------



        //-----------------------------
        // 02 
        //-----------------------------
        //this.animate();
        //-----------------------------
        

    }


    //-----------------------------
    // 02 
    //-----------------------------
    nextAni(fbxLoader){
        const game = this;
        fbxLoader.load(`./assets/RaccoonAction.fbx`,function(object){
            game.selAction=0
            //-----------------------------
            //03 게임스틱
            //-----------------------------
            game.GamePad = new GamePad({
                game : game
            });
            //-----------------------------
            game.animate();
        }); 

    }
    set selAction(num){
        console.log('selAction',game);
        const action = this.player.mixer.clipAction(game.player.object.animations[num]);
        this.player.mixer.stopAllAction();
        action.fadeIn(0.5);
        action.play();
    }
    changeAction(){
        game.selAction=document.getElementById('changeAction').value;;
    }
    //-----------------------------
    
    animate(){
        const game = this;
        //-----------------------------
        // 02 
        //-----------------------------
        const dt = this.clock.getDelta();
        //-----------------------------

        requestAnimationFrame(function(){game.animate();})
        this.cube.rotation.x +=0.01;
        this.cube.rotation.y +=0.01;
        this.cube.rotation.z +=0.01;
        this.cube.position.x -=0.01;
        
        
        //-----------------------------
        // 02 
        //-----------------------------
        if(this.player.mixer!==undefined){
            this.player.mixer.update(dt);
        }
        //-----------------------------


        //-----------------------------
        // 03 그림자
        //-----------------------------
        if(this.shadow !=undefined){
            this.shadow.position.x = this.player.object.position.x+50;
            this.shadow.position.y = this.player.object.position.y+100;
            this.shadow.position.z = this.player.object.position.z+200;
            this.shadow.target = this.player.object;

        }
        //-----------------------------

        this.renderer.render(this.scene,this.camera);
        
    }

}