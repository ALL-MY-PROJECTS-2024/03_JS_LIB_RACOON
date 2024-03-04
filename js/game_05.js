class Game{
    constructor(){
        
        this.scene;
        this.player={};
        this.renderer;
        this.camera;
        this.orbCtrl;
        this.clock = new THREE.Clock();
        
        //--------------------------
        //04 움직이기
        //--------------------------        
        this.animations={};
        //--------------------------        
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

        //-----------------------------
        //04 변경
        //----------------------------- 
        this.camera = new THREE.PerspectiveCamera(100,window.innerWidth/window.innerHeight,0.1,10000);
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
        light.shadow.camera.top =250;
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
        grid.material.transparent = true;
        grid.material.opacity = .3;
        this.scene.add(grid);
        //-----------------------------


        //-----------------------------
        //04 주석
        //-----------------------------
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 0;
        //-----------------------------
        

        const fbxloader = new THREE.FBXLoader();
        // const game = this;
        fbxloader.load(`./assets/Raccoon_add_jump.fbx`,function(object){

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
            object.position.y = -10;
            object.position.x = 0;
            //-----------------------------
            //04 수정
            //-----------------------------
            object.scale.x = 40;
            object.scale.y = 40;
            object.scale.z = 40;

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
            
            //-----------------------------
            //04 움직이기
            //-----------------------------
            //game.player.object=object;

            game.player.object = new THREE.Object3D();
            game.scene.add(game.player.object);
            game.player.object.add(object);
            console.log(object.animations);
            console.log(object.animations[0].name);
            console.log(object.animations[1]);
            object.animations.forEach(element=>{
                if(element.name.includes("Idle")){
                    //console.log("Idle");
                    game.animations.Idle = element;
                }else if(element.name.includes("Walk")){
                    //console.log("Walk");
                    game.animations.Walk = element;
                }else if(element.name.includes("Run")){
                    //console.log("Run");
                    game.animations.Run = element;
                }else if(element.name.includes("BackWard")){
                    //console.log("BackWard");
                    game.animations.BackWard = element;
                }else if(element.name.includes("Jump")){
                    game.animations.Jump = element;
                }

            })
                //-----------------------------
            

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
            //-----------------------------
            //04 움직이기(변경 0->"Idle")
            //-----------------------------
            //game.selAction=0
            game.selAction="Idle";
            game.Cameras();
            //-----------------------------
            //05
            //-----------------------------
            game.Colliders();
            //-----------------------------
            //03 게임스틱
            //-----------------------------
            game.GamePad = new GamePad({
                //--------------------------
                //04 움직이기
                //--------------------------
                pc : game.playerCtrl,
                //--------------------------
                game : game
            });
            //-----------------------------
            game.animate();
        }); 

    }

    //-----------------------------
    //04 움직이기 (변경)
    //-----------------------------
    //set selAction(num)
    set selAction(name)
    {
        console.log('selAction',game);
        //const action = this.player.mixer.clipAction(game.player.object.animations[num]);
        const action = this.player.mixer.clipAction(this.animations[name]);
        this.player.mixer.stopAllAction();
        this.player.action = name;
        this.player.actionTime = Date.now();
        action.fadeIn(0.1);
        action.play();
    }


    changeAction(){
        game.selAction=document.getElementById('changeAction').value;
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
            //-----------------------------
            //04 움직이기 (변경)
            //-----------------------------
            this.shadow.position.x = this.player.object.position.x+70;
            this.shadow.position.y = this.player.object.position.y+70;
            this.shadow.position.z = this.player.object.position.z-70;
            this.shadow.target = this.player.object;

        }
        //-----------------------------

        //-----------------------------
        //04
        //-----------------------------
        if(this.player.action=='Walk'){
            const walkTime = Date.now()- this.player.actionTime;
            if(walkTime>800 && this.player.move.moveF>0){
                this.selAction='Run';
            }
        }




        if(this.player.move !==undefined) this.move(dt);

        if(this.player.camera!=undefined && this.player.camera.active!=undefined){
            this.camera.position.lerp(this.player.camera.active.getWorldPosition(new THREE.Vector3()),1)
            
            const cameraPosition = this.player.object.position.clone();

            cameraPosition.y +=200;
            cameraPosition.x +=50;
            this.camera.lookAt(cameraPosition);
        }
        //-----------------------------
        this.renderer.render(this.scene,this.camera);
        
    }



    //-----------------------------
    //05
    //-----------------------------
    Colliders(){
        let geometry = new THREE.BoxGeometry(150,150,150);
        let material = new THREE.MeshBasicMaterial({color:'#BDBDBD'});
        this.colliders = [];        
        const cube1 = new THREE.Mesh(geometry,material);
        cube1.position.set(-1200,75,-300);
        this.colliders.push(cube1);
        this.scene.add(cube1);
        //테두리
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        wireframe.position.set(-1200,75,-300);
        this.scene.add(wireframe);

        geometry = new THREE.BoxGeometry(150,150,150);
        material = new THREE.MeshBasicMaterial({color:'#E6E6E6'});
        const cube2 = new THREE.Mesh(geometry,material);
        cube2.position.set(1000,75,1200);
        this.colliders.push(cube2);
        this.scene.add(cube2);

         //테두리
         const edges2 = new THREE.EdgesGeometry(geometry);
         const lineMaterial2 = new THREE.LineBasicMaterial({ color: 0x000000 });
         const wireframe2 = new THREE.LineSegments(edges2, lineMaterial2);
         wireframe2.position.set(1000,75,1200);
         this.scene.add(wireframe2);       

        geometry = new THREE.BoxGeometry(150,150,150);
        material = new THREE.MeshBasicMaterial({color:'lightgray'});
        const cube3 = new THREE.Mesh(geometry,material);
        cube3.position.set(-500,75,800);
        this.colliders.push(cube3);
        this.scene.add(cube3);
         //테두리
         const edges3 = new THREE.EdgesGeometry(geometry);
         const lineMaterial3 = new THREE.LineBasicMaterial({ color: 0x000000 });
         const wireframe3 = new THREE.LineSegments(edges3, lineMaterial3);
         wireframe3.position.set(-500,75,800);
         this.scene.add(wireframe3);       
    }


    //-----------------------------
    //04
    //-----------------------------

    move(dt){

        //-----------------------------
        //05
        //-----------------------------
        const position = this.player.object.position.clone();
        let direction = new THREE.Vector3();

        this.player.object.getWorldDirection(direction);
        let raycast = new THREE.Raycaster(position,direction);
        let T_F = false;
        const colliders = this.colliders;
        if(colliders !== undefined){
            const distance = raycast.intersectObjects(colliders);
            if(distance.length>0){
                if(distance[0].distance<150){
                    T_F=true;
                }
            }else console.log(distance);
        }


        //-----------------------------

        //-----------------------------
        //05
        //-----------------------------
        if(!T_F){
            if(this.player.move.moveF>0){
                const speed = (this.player.action=='Run') ? 700 : 200;
                this.player.object.translateZ(dt*speed); //이동
            }else{
                this.player.object.translateZ(-dt*100);
            }
            
        }
        this.player.object.rotateY(this.player.move.moveTurn*dt);
        //-----------------------------

    }

    playerCtrl(moveF,moveTurn){
        
     
        if(moveF>0.1){
            if(this.player.action!='Walk'&&this.player.action!='Run') this.selAction='Walk';
        }else if(moveF<-0.3){
            if(this.player.action!='BackWard') this.selAction='BackWard';
        }
        else{
            moveF = 0;
            if(this.player.action!="Idle"){
                this.selAction = "Idle";
            }
        }


        if(moveF==0 && moveTurn==0 ){
            delete this.player.move;
        }else {
            this.player.move = {moveF,moveTurn};
        }

    }
    set activeCamera(object){
        this.player.camera.active = object;

    }
    Cameras(){
        const back = new THREE.Object3D();
        back.position.set(0,1000,-700);
        back.parent = this.player.object;
        this.player.camera = {back};
        game.activeCamera = this.player.camera.back;
    }
    //-----------------------------


}
 
