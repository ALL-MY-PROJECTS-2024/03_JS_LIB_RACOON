class GamePad{
    constructor(param){
        console.log("GAMEPAD...",param);
        //--------------------------
        //04
        //--------------------------
        this.game = param;
        this.pc = param.pc;
        
        //--------------------------
        const padHole = document.createElement("div");
        padHole.style.cssText
        ="position:absolute;width:120px;height:120px;bottom:10vh;left:10vw !important;"
        +"background-color:#dcdcdc;border:#111 solid 2px; border-radius:50%;left:50%;filter:grayscale(100%);";
        const stick = document.createElement("div");
        stick.style.cssText="position:absolute;left:30px;top:30px;width:60px;height:60px; border-radius:50%; background-color:#888888;border:1px solid #222;";
        

        padHole.appendChild(stick);
        document.body.appendChild(padHole);
        

        this.domElement = stick;
        this.maxRadius = 60*60;
        this.game = param.game;
        this.location = {left:this.domElement.offsetLeft, top:this.domElement.offsetTop};
        const pad = this;

        if('ontouchstart' in window){
            this.domElement.addEventListener('touchstart',function(e){
                e.preventDefault();
                pad.touch(e);
                e.stopPropagation();
               
            });
        }
        else
        {
            this.domElement.addEventListener('mousedown',function(e){
                console.log(e);
                e.preventDefault();
                pad.touch(e);
                e.stopPropagation();
            });

        }

        //---------------------------
        // 키보드 스타일링 추가
        //---------------------------

        //---------------------------
        // 키보드 이벤트 리스너 추가
        //---------------------------
        this.pressedKeys = [];
        this.stickDragging = false;
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        //-----------------------------
        //JUMP
        //-----------------------------
        this.isJumping = false;
        this.jumpHeight = 2.0;
        this._jumpRiseIv = null;
        this._jumpFallIv = null;

    }

    resetForRestart(){
        if(this._jumpRiseIv){
            clearInterval(this._jumpRiseIv);
            this._jumpRiseIv = null;
        }
        if(this._jumpFallIv){
            clearInterval(this._jumpFallIv);
            this._jumpFallIv = null;
        }
        this.isJumping = false;
        this.pressedKeys = [];
        this.stickDragging = false;
        this.syncStickToKeyboard();
    }

    syncStickToKeyboard(){
        if(this.stickDragging) return;
        const mv = this.getKeyboardMoveFromPressedKeys();
        this.applyStickVisual(mv.moveF, mv.moveT);
    }

    applyStickVisual(moveF, moveT){
        const h2 = this.domElement.clientHeight / 2;
        const w2 = this.domElement.clientWidth / 2;
        let mf = moveF;
        let mt = moveT;
        const mag = Math.sqrt(mf * mf + mt * mt);
        if(mag > 1e-6){
            mf /= mag;
            mt /= mag;
        }else{
            this.domElement.style.top = `${this.location.top}px`;
            this.domElement.style.left = `${this.location.left}px`;
            return;
        }
        const lim = 58;
        const t = this.location.top - h2 - mf * lim;
        const l = this.location.left - w2 - mt * lim;
        this.domElement.style.top = `${t + h2}px`;
        this.domElement.style.left = `${l + w2}px`;
    }

    getKeyboardMoveFromPressedKeys() {
        let moveF = 0;
        let moveT = 0;
        this.pressedKeys.forEach((keyCode) => {
            switch (keyCode) {
                case 87: moveF += 1; break;
                case 83: moveF -= 1; break;
                case 65: moveT += 1; break;
                case 68: moveT -= 1; break;
            }
        });
        return { moveF, moveT };
    }

    getMousePosition(e){
        let Xvalue = e.targetTouches ? e.targetTouches[0].pageX : e.clientX;
        let Yvalue = e.targetTouches ? e.targetTouches[0].pageY : e.clientY;
        console.log({x:Xvalue , y:Yvalue});
        return {x:Xvalue , y:Yvalue};
    }
    async touch(event){
        console.log("touch! ");
        event = event || window.event;
        this.stickDragging = true;
        this.offset = this.getMousePosition(event);
        const pad = this;
        if('ontouchstart' in window){
            console.log("touch!  ontouchstart true");
            document.ontouchmove =function(event){event.preventDefault();pad.move(event);};
            document.ontouchend = function(event){event.preventDefault();pad.up(event);};
        }else{
            
            document.onmousemove = function(event){  event.preventDefault();pad.move(event);};
            document.onmouseup =  function(event){  event.preventDefault();pad.up(event);};            
        }

    }
    async move(event){
        const mouse = this.getMousePosition(event);
        console.log("move! ");
        let left = mouse.x - this.offset.x;
        let top = mouse.y - this.offset.y;
        const calLoc = left*left + top*top;
        if(calLoc>this.maxRadius){
            const result = Math.sqrt(calLoc);
            left /= result;
            top /= result;
            left *= 60;
            top *= 60;
        }

        this.domElement.style.top = `${top + this.domElement.clientHeight/2}px`
        this.domElement.style.left = `${left + this.domElement.clientHeight/2}px`
        //--------------------------
        //04 움직이기
        //--------------------------
        const moveF = -(top-this.location.top + this.domElement.clientHeight/2)/60;
        const moveT = -(left - this.location.left + this.domElement.clientWidth/2)/60;
        this.pc.call(this.game,moveF,moveT);
        //--------------------------        
        
    }
    async up(){
        if('ontouchstart' in window){
            document.ontouchmove = null;
            document.touchend = null;
        }else{
            document.onmousemove = null;
            document.onmouseup = null;
        }
        this.stickDragging = false;
        const kb = this.getKeyboardMoveFromPressedKeys();
        if(Math.abs(kb.moveF) > 1e-6 || Math.abs(kb.moveT) > 1e-6){
            this.applyStickVisual(kb.moveF, kb.moveT);
            this.pc.call(this.game, kb.moveF, kb.moveT);
        }else{
            this.domElement.style.top = `${this.location.top}px`;
            this.domElement.style.left = `${this.location.left}px`;
            this.pc.call(this.game,0,0);
        }

        //--------------------------        
    }


    //------------------------------
    //키보드
    //------------------------------
    // 키보드 이벤트 처리
    handleKeyDown(event) {
        const keyCode = event.keyCode;

        if (!this.pressedKeys.includes(keyCode)) {
            this.pressedKeys.push(keyCode);
        }

        this.handleKeyActions(event);

        if (this.game.gameOver) return;

        if (keyCode === 32 && !event.repeat) {
            event.preventDefault();
            let { moveF, moveT } = this.getKeyboardMoveFromPressedKeys();
            const g = this.game;
            if (moveF <= 0.1 && g.player && g.player.move && g.player.move.moveF > 0.1) {
                moveF = g.player.move.moveF;
                moveT = g.player.move.moveTurn;
            }
            if (moveF > 0.1) {
                this.performJumpWhileMoving(moveF, moveT);
            }
        }
    }

    handleKeyUp(event) {
        const keyCode = event.keyCode;

        const index = this.pressedKeys.indexOf(keyCode);
        if (index !== -1) {
            this.pressedKeys.splice(index, 1);
        }

        if (!this.game.gameOver) {
            this.handleKeyActions(event);
        }
    }



    handleKeyActions(event) {
        let moveF = 0;
        let moveT = 0;

        this.pressedKeys.forEach((keyCode) => {
            switch (keyCode) {
                case 87: moveF += 1; break;
                case 83: moveF -= 1; break;
                case 65: moveT += 1; break;
                case 68: moveT -= 1; break;
            }
        });

        this.pc.call(this.game, moveF, moveT);
        this.syncStickToKeyboard();
    }

    performJumpWhileMoving(moveF, moveT) {
        const g = this.game;
        if (!g.player || !g.player.object || this.isJumping) return;
        if (!g.animations || !g.animations.Jump) return;

        this.isJumping = true;
        g.player.jumping = true;
        g.player.resumeRunAfterLand = (g.player.action === "Run");
        g.selAction = "Jump";

        const root = g.player.object;
        const pad = this;
        if(pad._jumpRiseIv) clearInterval(pad._jumpRiseIv);
        if(pad._jumpFallIv) clearInterval(pad._jumpFallIv);
        pad._jumpRiseIv = setInterval(function(){
            root.position.y += 20;
            if (root.position.y > 300) {
                clearInterval(pad._jumpRiseIv);
                pad._jumpRiseIv = null;
                pad._jumpFallIv = setInterval(function(){
                    const oldY = root.position.y;
                    root.position.y -= 10;
                    const newY = root.position.y;
                    const landY = g.tryLandOnObstacleTop(root.position.x, root.position.z, oldY, newY);
                    if(landY !== null){
                        root.position.y = landY;
                        clearInterval(pad._jumpFallIv);
                        pad._jumpFallIv = null;
                        pad.isJumping = false;
                        g.player.jumping = false;
                        const cur = pad.getKeyboardMoveFromPressedKeys();
                        let mf = cur.moveF;
                        let mt = cur.moveT;
                        if (Math.abs(mf) < 0.01 && Math.abs(mt) < 0.01 && g.player.move) {
                            mf = g.player.move.moveF;
                            mt = g.player.move.moveTurn;
                        }
                        pad.pc.call(g, mf, mt);
                        return;
                    }
                    if (newY <= 0) {
                        root.position.y = 0;
                        clearInterval(pad._jumpFallIv);
                        pad._jumpFallIv = null;
                        pad.isJumping = false;
                        g.player.jumping = false;
                        const cur = pad.getKeyboardMoveFromPressedKeys();
                        let mf = cur.moveF;
                        let mt = cur.moveT;
                        if (Math.abs(mf) < 0.01 && Math.abs(mt) < 0.01 && g.player.move) {
                            mf = g.player.move.moveF;
                            mt = g.player.move.moveTurn;
                        }
                        pad.pc.call(g, mf, mt);
                    }
                }, 20);
            }
        }, 20);
    }

}