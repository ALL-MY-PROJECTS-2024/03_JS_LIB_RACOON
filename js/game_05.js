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
        this.monsters = [];
        this.gameOver = false;
        this.boostTrailMeshes = [];
        this.coins = [];
        this.coinsGot = 0;
        this.coinsTotal = 0;
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
        this.scene.background = new THREE.Color("#b5b5b5");
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
        const material = new THREE.MeshPhongMaterial({color : "#d0d0d0"});
        
        this.cube = new THREE.Mesh(geometry,material);
        
        //-----------------------------
        //03 바닥 만들기
        //-----------------------------
        //바닥구분
        var mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(5000,5000),
            new THREE.MeshPhongMaterial({color:0x888888,depthWrite : false})
        );
        mesh.rotation.x = -Math.PI /2;
        mesh.position.y = -30;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        //그리드효과
        var grid = new THREE.GridHelper(5000,50,0x333333,0x555555);
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
            game.setupHpBar();
            game.setupCoinHud();
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
            game.setupGameOverOverlay();
            game.setupBoostButton();
            game.setupBoostTrail();
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
        if(this.gameOver) return;
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
        if(!this.gameOver && this.player.action=='Walk' && this.player.move){
            const walkTime = Date.now()- this.player.actionTime;
            if(walkTime>800 && this.player.move.moveF>0){
                this.selAction='Run';
            }
        }




        if(!this.gameOver && this.player.move !==undefined) this.move(dt);

        if(!this.gameOver && this.player.hpDamageCooldown > 0){
            this.player.hpDamageCooldown -= dt;
        }

        if(!this.gameOver && this.monsters.length) this.updateMonsters(dt);

        if(!this.gameOver && this.player.object){
            this.resolvePlayerGrounding(dt);
        }

        if(!this.gameOver && this.player.object){
            this.updateCoinCollection(dt);
        }

        if(!this.gameOver && this.colliders && this.colliders.length){
            this.checkStaticObstacleDamage();
        }

        this.updateHpBar();

        if(!this.gameOver){
            if(this.boostTimeLeft > 0){
                this.boostTimeLeft -= dt;
                if(this.boostTimeLeft <= 0){
                    this.boostTimeLeft = 0;
                    this.boostCooldownLeft = this.boostCooldownDuration;
                }
            }
            if(this.boostCooldownLeft > 0){
                this.boostCooldownLeft -= dt;
                if(this.boostCooldownLeft < 0){
                    this.boostCooldownLeft = 0;
                }
            }
        }
        this.updateBoostButton();

        this.updateBoostTrail(dt);

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

        this.spawnMonsters();
        this.spawnCoins();
    }

    setupCoinHud(){
        const el = document.createElement("div");
        el.id = "coinHud";
        el.style.cssText = "position:fixed;right:12px;top:12px;z-index:1001;font-size:13px;font-weight:800;color:#111;background:#e8e8e8;border:2px solid #111;padding:8px 12px;box-shadow:3px 3px 0 #000;font-family:inherit;filter:grayscale(100%);user-select:none;pointer-events:none;";
        el.textContent = "획득 0 / 총 0";
        document.body.appendChild(el);
        this.coinHudEl = el;
    }

    updateCoinHud(){
        if(!this.coinHudEl) return;
        this.coinHudEl.textContent = "획득 " + this.coinsGot + " / 총 " + this.coinsTotal;
    }

    clearCoins(){
        if(!this.coins || !this.coins.length) return;
        for(let i = 0; i < this.coins.length; i++){
            const c = this.coins[i];
            if(c.mesh && c.mesh.parent){
                c.mesh.parent.remove(c.mesh);
            }
        }
        this.coins = [];
    }

    makeCoinMesh(){
        const geo = new THREE.TorusGeometry(13, 3.2, 10, 28);
        const mat = new THREE.MeshPhongMaterial({
            color: 0xf5e6a8,
            emissive: 0x2a2818,
            shininess: 70
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.castShadow = true;
        return mesh;
    }

    spawnCoins(){
        this.clearCoins();
        this.coinsGot = 0;
        const half = this.platformBoxHalf();
        const aboveTop = 16;
        for(let i = 0; i < this.colliders.length; i++){
            const c = this.colliders[i].position;
            const coin = this.makeCoinMesh();
            coin.position.set(c.x, c.y + half + aboveTop, c.z);
            this.scene.add(coin);
            this.coins.push({ mesh: coin, collected: false, spin: i * 0.7 });
        }
        for(let i = 0; i < this.monsters.length; i++){
            const coin = this.makeCoinMesh();
            coin.position.set(0, half + aboveTop, 0);
            this.monsters[i].root.add(coin);
            this.coins.push({ mesh: coin, collected: false, spin: i * 0.9 + 2 });
        }
        this.coinsTotal = this.coins.length;
        this.updateCoinHud();
    }

    updateCoinCollection(dt){
        if(!this.player.object || !this.coins.length) return;
        const p = this.player.object.position;
        const wp = new THREE.Vector3();
        const collectR = 42;
        const collectR2 = collectR * collectR;
        for(let i = 0; i < this.coins.length; i++){
            const c = this.coins[i];
            if(c.collected) continue;
            c.mesh.getWorldPosition(wp);
            const dx = p.x - wp.x;
            const dy = p.y - wp.y;
            const dz = p.z - wp.z;
            if(dx * dx + dy * dy + dz * dz <= collectR2){
                c.collected = true;
                c.mesh.visible = false;
                this.coinsGot++;
                this.updateCoinHud();
            }else{
                c.mesh.rotation.y += dt * 3.2;
                c.mesh.rotation.z = Math.sin(performance.now() * 0.003 + c.spin) * 0.15;
            }
        }
    }

    isPlayerOnBoxTop(px, py, pz, cx, cy, cz, half){
        const topY = cy + half;
        if(Math.abs(px - cx) >= half || Math.abs(pz - cz) >= half) return false;
        return py >= topY - 42 && py <= topY + 45;
    }

    pickMonsterDirection(m){
        const a = Math.random() * Math.PI * 2;
        m.vx = Math.cos(a);
        m.vz = Math.sin(a);
        m.nextChange = performance.now() + 1500 + Math.random() * 2500;
    }

    monsterBoxHalf(){
        return 75;
    }

    platformBoxHalf(){
        return 75;
    }

    getStandHeightAt(px, pz){
        const h = this.platformBoxHalf();
        let maxTop = 0;
        const consider = function(cx, cy, cz){
            const topY = cy + h;
            if(Math.abs(px - cx) < h && Math.abs(pz - cz) < h){
                if(topY > maxTop){
                    maxTop = topY;
                }
            }
        };
        if(this.colliders){
            for(let i = 0; i < this.colliders.length; i++){
                consider(this.colliders[i].position.x, this.colliders[i].position.y, this.colliders[i].position.z);
            }
        }
        if(this.monsters){
            for(let i = 0; i < this.monsters.length; i++){
                const r = this.monsters[i].root.position;
                consider(r.x, r.y, r.z);
            }
        }
        return maxTop;
    }

    tryLandOnObstacleTop(px, pz, yFrom, yTo){
        const h = this.platformBoxHalf();
        let best = null;
        const test = function(cx, cy, cz){
            const topY = cy + h;
            if(!(yFrom > topY && yTo <= topY)) return;
            if(Math.abs(px - cx) >= h - 0.001 || Math.abs(pz - cz) >= h - 0.001) return;
            if(best === null || topY > best){
                best = topY;
            }
        };
        if(this.colliders){
            for(let i = 0; i < this.colliders.length; i++){
                const c = this.colliders[i].position;
                test(c.x, c.y, c.z);
            }
        }
        if(this.monsters){
            for(let i = 0; i < this.monsters.length; i++){
                const r = this.monsters[i].root.position;
                test(r.x, r.y, r.z);
            }
        }
        return best;
    }

    resolvePlayerGrounding(dt){
        if(!this.player.object || this.gameOver) return;
        if(this.GamePad && this.GamePad.isJumping) return;
        if(this.player.jumping) return;
        const p = this.player.object.position;
        const stand = this.getStandHeightAt(p.x, p.z);
        if(stand <= 0){
            if(p.y > 0.01){
                p.y -= 460 * dt;
                if(p.y < 0){
                    p.y = 0;
                }
            }
            return;
        }
        if(Math.abs(p.y - stand) < 32){
            p.y = stand;
        }
    }

    xzAabbOverlap(ax, az, bx, bz, halfA, halfB){
        return Math.abs(ax - bx) < halfA + halfB && Math.abs(az - bz) < halfA + halfB;
    }

    xzOverlapsAnyStatic(x, z){
        const h = this.monsterBoxHalf();
        if(!this.colliders || !this.colliders.length) return false;
        for(let i = 0; i < this.colliders.length; i++){
            const c = this.colliders[i].position;
            if(this.xzAabbOverlap(x, z, c.x, c.z, h, h)) return true;
        }
        return false;
    }

    xzOverlapsSpawnMonster(x, z){
        const h = this.monsterBoxHalf();
        for(let j = 0; j < this.monsters.length; j++){
            const o = this.monsters[j].root.position;
            if(this.xzAabbOverlap(x, z, o.x, o.z, h, h)) return true;
        }
        return false;
    }

    separateMonsterFromStatics(m){
        const h = this.monsterBoxHalf();
        const sep = h * 2;
        const p = m.root.position;
        const maxIter = 8;
        for(let iter = 0; iter < maxIter; iter++){
            let adjusted = false;
            if(!this.colliders) break;
            for(let i = 0; i < this.colliders.length; i++){
                const c = this.colliders[i].position;
                if(!this.xzAabbOverlap(p.x, p.z, c.x, c.z, h, h)) continue;
                const dx = p.x - c.x;
                const dz = p.z - c.z;
                const penX = sep - Math.abs(dx);
                const penZ = sep - Math.abs(dz);
                if(penX > 0 && penZ > 0){
                    if(penX < penZ){
                        p.x += Math.sign(dx || 1) * (penX + 0.5);
                    }else{
                        p.z += Math.sign(dz || 1) * (penZ + 0.5);
                    }
                    adjusted = true;
                }
            }
            if(!adjusted) break;
        }
    }

    spawnMonsters(){
        const count = 7;
        const bounds = 950;
        const size = 150;
        const half = size / 2;
        const geom = new THREE.BoxGeometry(size, size, size);
        const palette = ["#BDBDBD", "#E6E6E6", "#d3d3d3"];
        const fallbacks = [
            [400, -400], [-400, 400], [600, 200], [-600, -200],
            [200, 600], [-200, -600], [750, -750]
        ];
        for(let i = 0; i < count; i++){
            const mat = new THREE.MeshBasicMaterial({color: palette[i % palette.length]});
            const mesh = new THREE.Mesh(geom, mat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const edges = new THREE.EdgesGeometry(geom);
            const line = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({color: 0x000000})
            );
            const root = new THREE.Group();
            root.add(mesh);
            root.add(line);
            let x = 0;
            let z = 0;
            let placed = false;
            for(let attempt = 0; attempt < 120; attempt++){
                x = (Math.random() - 0.5) * bounds * 1.6;
                z = (Math.random() - 0.5) * bounds * 1.6;
                if(this.xzOverlapsAnyStatic(x, z)) continue;
                if(this.xzOverlapsSpawnMonster(x, z)) continue;
                placed = true;
                break;
            }
            if(!placed){
                if(i < fallbacks.length){
                    const fb = fallbacks[i];
                    x = fb[0];
                    z = fb[1];
                }else{
                    x = 300 + i * 120;
                    z = -400 - i * 90;
                }
                let tries = 0;
                while(tries < 40 && (this.xzOverlapsAnyStatic(x, z) || this.xzOverlapsSpawnMonster(x, z))){
                    x += 95;
                    z -= 75;
                    tries++;
                }
            }
            root.position.set(x, half, z);
            this.separateMonsterFromStatics({root});
            this.scene.add(root);
            const m = {
                root,
                mesh,
                speed: 70 + Math.random() * 130,
                vx: 0,
                vz: 0,
                nextChange: 0
            };
            this.pickMonsterDirection(m);
            this.monsters.push(m);
        }
    }

    updateMonsters(dt){
        const bounds = 950;
        const now = performance.now();
        for(const m of this.monsters){
            if(now > m.nextChange){
                this.pickMonsterDirection(m);
            }
            m.root.position.x += m.vx * m.speed * dt;
            m.root.position.z += m.vz * m.speed * dt;
            if(Math.abs(m.root.position.x) > bounds){
                m.vx *= -1;
                m.root.position.x = Math.sign(m.root.position.x) * bounds;
            }
            if(Math.abs(m.root.position.z) > bounds){
                m.vz *= -1;
                m.root.position.z = Math.sign(m.root.position.z) * bounds;
            }
            this.separateMonsterFromStatics(m);
        }
        this.resolvePlayerMonsterCollision();
    }

    resolvePlayerMonsterCollision(){
        if(!this.player.object) return;
        const p = this.player.object.position;
        const minDist = 138;
        const half = this.platformBoxHalf();
        let hit = false;
        for(const m of this.monsters){
            const cx = m.root.position.x;
            const cy = m.root.position.y;
            const cz = m.root.position.z;
            if(this.isPlayerOnBoxTop(p.x, p.y, p.z, cx, cy, cz, half)){
                continue;
            }
            const dx = p.x - cx;
            const dz = p.z - cz;
            const d = Math.sqrt(dx * dx + dz * dz);
            if(d < minDist && d > 1e-6){
                const push = ((minDist - d) / d) * 1.08;
                p.x += dx * push;
                p.z += dz * push;
                hit = true;
            }
        }
        if(hit){
            this.tryObstacleDamage(14);
        }
    }

    checkStaticObstacleDamage(){
        if(!this.player.object) return;
        const p = this.player.object.position;
        const touchDist = 132;
        const half = this.platformBoxHalf();
        for(let i = 0; i < this.colliders.length; i++){
            const c = this.colliders[i].position;
            if(this.isPlayerOnBoxTop(p.x, p.y, p.z, c.x, c.y, c.z, half)){
                continue;
            }
            const dx = p.x - c.x;
            const dz = p.z - c.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if(dist >= touchDist) continue;
            const topY = c.y + half;
            if(p.y > topY + 30){
                continue;
            }
            if(p.y < c.y - half - 20){
                continue;
            }
            this.tryObstacleDamage(10);
            return;
        }
    }

    setupHpBar(){
        this.player.maxHp = 100;
        this.player.hp = 100;
        this.player.hpDamageCooldown = 0;
        this._hpProj = new THREE.Vector3();

        const wrap = document.createElement("div");
        wrap.id = "playerHpWrap";
        wrap.style.cssText = "position:fixed;left:0;top:0;transform:translate(-50%,-100%);margin-top:-14px;z-index:1000;pointer-events:none;width:88px;display:none;filter:grayscale(100%);";
        const bg = document.createElement("div");
        bg.style.cssText = "height:9px;background:#1a1a1a;border-radius:0;overflow:hidden;box-shadow:0 1px 0 #000; border:1px solid #333;";
        const fill = document.createElement("div");
        fill.id = "playerHpFill";
        fill.style.cssText = "height:100%;width:100%;background:linear-gradient(90deg,#f5f5f5,#b0b0b0);transform-origin:left center;transition:width .12s ease,background .15s ease;";
        bg.appendChild(fill);
        wrap.appendChild(bg);
        document.body.appendChild(wrap);
        this.hpBarWrap = wrap;
        this.hpBarFill = fill;
    }

    setupGameOverOverlay(){
        const self = this;
        const overlay = document.createElement("div");
        overlay.id = "gameOverOverlay";
        overlay.style.cssText = "display:none;position:fixed;inset:0;z-index:10050;flex-direction:column;align-items:center;justify-content:center;background:rgba(240,240,240,.92);color:#111;font-family:inherit;filter:grayscale(100%);";

        const title = document.createElement("div");
        title.textContent = "GAME OVER";
        title.style.cssText = "font-size:clamp(28px,6vw,48px);font-weight:900;letter-spacing:0.12em;margin-bottom:28px;border:4px solid #111;padding:16px 32px;background:#e8e8e8;box-shadow:6px 6px 0 #000;";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "다시 하기";
        btn.style.cssText = "font-size:16px;font-weight:800;padding:12px 36px;cursor:pointer;border:3px solid #111;background:#fff;color:#111;box-shadow:4px 4px 0 #000;border-radius:0;";
        btn.addEventListener("click", function(){
            self.restartGame();
        });

        overlay.appendChild(title);
        overlay.appendChild(btn);
        document.body.appendChild(overlay);
        this.gameOverOverlay = overlay;
    }

    triggerGameOver(){
        if(this.gameOver) return;
        this.gameOver = true;
        if(this.gameOverOverlay){
            this.gameOverOverlay.style.display = "flex";
        }
        if(this.orbCtrl){
            this.orbCtrl.enabled = false;
        }
    }

    restartGame(){
        this.gameOver = false;
        if(this.gameOverOverlay){
            this.gameOverOverlay.style.display = "none";
        }
        if(this.orbCtrl){
            this.orbCtrl.enabled = true;
        }

        this.player.hp = this.player.maxHp;
        this.player.hpDamageCooldown = 0;
        if(this.player.object){
            this.player.object.position.set(0, 0, 0);
            this.player.object.rotation.set(0, 0, 0);
        }
        delete this.player.move;
        this.player.jumping = false;
        this.player.resumeRunAfterLand = false;
        if(this.player.mixer && this.animations.Idle){
            this.selAction = "Idle";
        }

        this.boostTimeLeft = 0;
        this.boostCooldownLeft = 0;

        if(this.GamePad){
            this.GamePad.resetForRestart();
        }

        this.clearCoins();

        while(this.monsters.length){
            const m = this.monsters.pop();
            if(m && m.root){
                this.scene.remove(m.root);
            }
        }
        this.spawnMonsters();
        this.spawnCoins();
    }

    updateHpBar(){
        if(!this.hpBarWrap || !this.hpBarFill || !this.player.object) return;
        this._hpProj.copy(this.player.object.position);
        this._hpProj.y += 265;
        this._hpProj.project(this.camera);
        const x = (this._hpProj.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-this._hpProj.y * 0.5 + 0.5) * window.innerHeight;
        this.hpBarWrap.style.left = Math.round(x) + "px";
        this.hpBarWrap.style.top = Math.round(y) + "px";
        this.hpBarWrap.style.display = "block";

        const pct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
        this.hpBarFill.style.width = pct + "%";
        if(pct <= 0){
            this.hpBarFill.style.background = "linear-gradient(90deg,#333,#222)";
        }else if(pct < 30){
            this.hpBarFill.style.background = "linear-gradient(90deg,#666,#444)";
        }else if(pct < 55){
            this.hpBarFill.style.background = "linear-gradient(90deg,#b0b0b0,#808080)";
        }else{
            this.hpBarFill.style.background = "linear-gradient(90deg,#f5f5f5,#b0b0b0)";
        }
    }

    tryObstacleDamage(amount){
        if(this.gameOver) return;
        if(!this.player.object || this.player.hp <= 0) return;
        if(this.player.hpDamageCooldown > 0) return;
        this.player.hp = Math.max(0, this.player.hp - amount);
        this.player.hpDamageCooldown = 0.55;
        if(this.player.hp <= 0){
            this.triggerGameOver();
        }
    }

    setupBoostButton(){
        this.boostTimeLeft = 0;
        this.boostCooldownLeft = 0;
        this.boostDuration = 2.6;
        this.boostCooldownDuration = 3;
        this.boostSpeedMul = 1.62;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "BOOST [B]";
        btn.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:998;padding:10px 14px;font-size:11px;font-weight:800;border-radius:0;cursor:pointer;border:2px solid #111;background:#e8e8e8;color:#111;box-shadow:3px 3px 0 #000;pointer-events:auto;letter-spacing:0.04em;filter:grayscale(100%);font-family:inherit;";
        const self = this;
        btn.addEventListener("click", function(){
            self.tryStartBoost();
        });
        const onBoostKey = function(e){
            if(e.repeat) return;
            const k = e.key;
            if(k === "b" || k === "B"){
                e.preventDefault();
                self.tryStartBoost();
            }
        };
        window.addEventListener("keydown", onBoostKey);
        this._boostKeyHandler = onBoostKey;
        document.body.appendChild(btn);
        this.boostButton = btn;
    }

    tryStartBoost(){
        if(this.gameOver) return;
        if(this.boostTimeLeft > 0 || this.boostCooldownLeft > 0) return;
        this.boostTimeLeft = this.boostDuration;
    }

    isBoostActive(){
        return this.boostTimeLeft > 0;
    }

    setupBoostTrail(){
        if(!this.player.object) return;
        const group = new THREE.Group();
        group.name = "boostTrail";
        const bases = [0.32, 0.24, 0.17, 0.12, 0.075, 0.045];
        for(let i = 0; i < bases.length; i++){
            const w = 32 + i * 5;
            const h = 42 + i * 6;
            const d = 26 + i * 12;
            const geo = new THREE.BoxGeometry(w, h, d);
            const mat = new THREE.MeshBasicMaterial({
                color: 0xf0f0f0,
                transparent: true,
                opacity: bases[i],
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(0, 32 + i * 3, -22 - i * 28);
            mesh.renderOrder = 950;
            group.add(mesh);
            this.boostTrailMeshes.push({
                mesh: mesh,
                phase: i * 1.05,
                baseOp: bases[i],
                baseZ: mesh.position.z
            });
        }
        this.player.object.add(group);
        this.boostTrailGroup = group;
        group.visible = false;
    }

    updateBoostTrail(dt){
        if(!this.boostTrailGroup || !this.player.object) return;
        const active = !this.gameOver && this.isBoostActive();
        this.boostTrailGroup.visible = active;
        if(!active) return;
        const moving = this.player.move && this.player.move.moveF > 0.05;
        const t = performance.now() * 0.007;
        const moveMul = moving ? 1.25 : 0.65;
        for(let i = 0; i < this.boostTrailMeshes.length; i++){
            const o = this.boostTrailMeshes[i];
            const mesh = o.mesh;
            const pulse = 0.82 + 0.18 * Math.sin(t * 2.6 + o.phase);
            const flick = 0.92 + 0.08 * Math.sin(t * 4.2 + o.phase * 1.3);
            mesh.material.opacity = Math.min(0.95, o.baseOp * pulse * flick * moveMul);
            const stretch = 1.0 + 0.12 * Math.sin(t * 3.1 + o.phase);
            mesh.scale.set(stretch, pulse, 1.05 + 0.1 * Math.sin(t * 2 + o.phase));
            mesh.position.z = o.baseZ - 6 * Math.sin(t * 3.5 + o.phase);
        }
        this.boostTrailGroup.rotation.y = 0.04 * Math.sin(t * 5);
    }

    updateBoostButton(){
        if(!this.boostButton) return;
        const btn = this.boostButton;
        const base = "position:fixed;right:12px;bottom:12px;z-index:998;padding:10px 14px;font-size:11px;font-weight:800;border-radius:0;cursor:pointer;border:2px solid #111;box-shadow:3px 3px 0 #000;pointer-events:auto;letter-spacing:0.04em;filter:grayscale(100%);font-family:inherit;";
        if(this.gameOver){
            btn.disabled = true;
            btn.style.cssText = base + "background:#ccc;color:#666;opacity:0.5;cursor:not-allowed;";
            btn.textContent = "BOOST";
            return;
        }
        if(this.boostTimeLeft > 0){
            btn.disabled = false;
            btn.style.cssText = base + "background:#d0d0d0;color:#000;opacity:1;";
            btn.textContent = "BOOST " + Math.ceil(this.boostTimeLeft) + "s";
        }else if(this.boostCooldownLeft > 0){
            btn.disabled = true;
            btn.style.cssText = base + "background:#9a9a9a;color:#111;opacity:0.85;cursor:not-allowed;";
            btn.textContent = "COOL " + Math.ceil(this.boostCooldownLeft) + "s";
        }else{
            btn.disabled = false;
            btn.style.cssText = base + "background:#e8e8e8;color:#111;opacity:1;cursor:pointer;";
            btn.textContent = "BOOST [B]";
        }
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
        const monsterMeshes = this.monsters && this.monsters.length
            ? this.monsters.map(function(m){ return m.mesh; })
            : [];
        const obstacles = colliders ? colliders.concat(monsterMeshes) : monsterMeshes;
        if(obstacles.length > 0){
            const distance = raycast.intersectObjects(obstacles);
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
                const useRunSpeed = this.player.action === "Run"
                    || (this.player.jumping && this.player.resumeRunAfterLand);
                let speed = useRunSpeed ? 700 : 200;
                if(this.isBoostActive()){
                    speed *= this.boostSpeedMul;
                }
                this.player.object.translateZ(dt*speed);
            }else{
                this.player.object.translateZ(-dt*100);
            }
            
        }
        this.player.object.rotateY(this.player.move.moveTurn*dt);
        //-----------------------------

    }

    playerCtrl(moveF,moveTurn){

        if(this.gameOver) return;

        if(this.player.jumping){
            if(moveF===0 && moveTurn===0){
                delete this.player.move;
            }else{
                this.player.move = {moveF,moveTurn};
            }
            return;
        }

        if(moveF>0.1){
            if(this.player.resumeRunAfterLand){
                this.selAction = "Run";
                delete this.player.resumeRunAfterLand;
            }else if(this.player.action!='Walk'&&this.player.action!='Run'){
                this.selAction='Walk';
            }
        }else if(moveF<-0.3){
            if(this.player.resumeRunAfterLand){
                delete this.player.resumeRunAfterLand;
            }
            if(this.player.action!='BackWard') this.selAction='BackWard';
        }
        else{
            moveF = 0;
            if(this.player.resumeRunAfterLand){
                delete this.player.resumeRunAfterLand;
            }
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
 
