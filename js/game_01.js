class Game{
    constructor(){

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
       
        //------------------------------
        //  fbx 캐릭터 로딩
        //------------------------------
        const fbxloader = new THREE.FBXLoader();
        const game = this;
        fbxloader.load(`./assets/Raccoon.fbx`,function(object){

            game.scene.add(object);
            object.position.y = -1;
            object.position.x = 0;
            object.scale.x = 0.5;
            object.scale.y = 0.5;
            object.scale.z = 0.5;
        });
        //------------------------------

        
        //
        this.scene.add(this.cube);
        this.scene.add(light);
        this.scene.add(ambient);
        this.animate();
        

    }

    animate(){
        const game = this;
        requestAnimationFrame(function(){game.animate();})
        this.cube.rotation.x +=0.01;
        this.cube.rotation.y +=0.01;
        this.cube.rotation.z +=0.01;
        this.cube.position.x -=0.01;
        this.renderer.render(this.scene,this.camera);
        
    }


}