class Game{
    constructor(){
        this.scene;
        this.player={};
        this.renderer;
        this.camera;
        this.orbCtrl;
        this.clock = new THREE.Clock();
        this.animations={};
        const game = this;
        this.aniInit();

    }
    aniInit(){
        this.scene= new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(100,window.innerWidth/window.innerHeight,0.1,1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        const geometry = new THREE.BoxGeometry(1,1,1);
        // const light = new THREE.DirectionalLight("#FF0000");
        const light = new THREE.DirectionalLight("#FFFFFF");
        light.position.set(0,20,10);
        const ambient = new THREE.AmbientLight("#FFFFFF");
        const material = new THREE.MeshPhongMaterial({color : "#FFFFFF"});
        
        this.cube = new THREE.Mesh(geometry,material);
        this.camera.position.z = 5;
       

        const fbxloader = new THREE.FBXLoader();
        // const game = this;
        fbxloader.load(`./assets/RaccoonAction.fbx`,function(object){

            //-----------------------------
            //Added - Action
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
            //Added - Action
            //-----------------------------
            game.player.object=object;
            game.nextAni(fbxloader);
            //-----------------------------



        });
  
        this.scene.add(this.cube);
        this.scene.add(light);
        this.scene.add(ambient);
        
        //-----------------------------
        //
        //-----------------------------
        //this.animate();
        //-----------------------------
        

    }


    //-----------------------------

    //-----------------------------
    nextAni(fbxLoader){
        const game = this;
        fbxLoader.load(`./assets/RaccoonAction.fbx`,function(object){
            game.selAction=0;
            console.log(object);
            game.animate();
        })

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
        //
        //-----------------------------
        const dt = this.clock.getDelta();
        //-----------------------------

        requestAnimationFrame(function(){game.animate();})
        this.cube.rotation.x +=0.01;
        this.cube.rotation.y +=0.01;
        this.cube.rotation.z +=0.01;
        this.cube.position.x -=0.01;
        //-----------------------------
        //
        //-----------------------------
        if(this.player.mixer!==undefined){
            this.player.mixer.update(dt);
        }

        //-----------------------------
        this.renderer.render(this.scene,this.camera);
        
    }

}