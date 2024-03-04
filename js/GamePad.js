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
        +"background-color:white;border:#353535 solid medium; border-radius:50%;left:50%;";
        const stick = document.createElement("div");
        stick.style.cssText="position:absolute;left:30px;top:30px;width:60px;height:60px; border-radius:50%; background-color:gray;border : 1px solid ;";
        

        //--------------------------
        const btn_01 = document.createElement("div");
        btn_01.innerHTML='😊';
        btn_01.setAttribute('style',"")
        btn_01.style.cssText="position:absolute;right:5vw;bottom:10vh;width:60px;height:60px; border-radius:50%; border : 1px solid; background-color:white;cursor:pointer;font-size:2rem;display:flex;justify-content:center;align-items:center;";
        document.body.appendChild(btn_01);
        
        const smileEl = document.createElement("div");
        smileEl.classList.add('smile');
        smileEl.innerHTML='😊';
        smileEl.style.cssText="width:40px;height:40px;position:absolute;top:41%;left:50%;font-size:0rem;display:flex;justify-content:center;align-items:center;transition:.3s;opacity:.8";
        document.body.appendChild(smileEl);
        btn_01.addEventListener('click',function(){
            smileEl.style.fontSize="1rem";
            setTimeout(()=>{
                smileEl.style.fontSize="0rem";
            },1000)
            
            
            console.log(param.game.player.object);
        })

        const btn_02 = document.createElement("div");
        btn_02.innerHTML='😒';
        btn_02.setAttribute('style',"display:flex;justify-content:center;align-items:center;font-size:2rem !important;")
        btn_02.style.cssText="position:absolute;right:15vw;bottom:20vh;width:60px;height:60px; border-radius:50%; border : 1px solid; background-color:white;cursor:pointer;font-size:2rem;display:flex;justify-content:center;align-items:center;";
        document.body.appendChild(btn_02);

        const sadEl = document.createElement("div");
        sadEl.classList.add('smile');
        sadEl.innerHTML='😒';
        sadEl.style.cssText="width:40px;height:40px;position:absolute;top:41%;left:50%;font-size:0rem;display:flex;justify-content:center;align-items:center;transition:.3s;opacity:.8";    
        document.body.appendChild(sadEl);    
        btn_02.addEventListener('click',function(){
            sadEl.style.fontSize="1rem";
            setTimeout(()=>{
                sadEl.style.fontSize="0rem";
            },1000)
        })
        
        const btn_03 = document.createElement("div");
        btn_03.innerHTML='😍';
        btn_03.setAttribute('style',"display:flex;justify-content:center;align-items:center;font-size:2rem !important;")
        btn_03.style.cssText="position:absolute;right:25vw;bottom:10vh;width:60px;height:60px; border-radius:50%; border : 1px solid; background-color:white;cursor:pointer;font-size:2rem;display:flex;justify-content:center;align-items:center;";
        document.body.appendChild(btn_03);

        const lovelyEl = document.createElement("div");
        lovelyEl.classList.add('smile');
        lovelyEl.innerHTML='😍';
        lovelyEl.style.cssText="width:40px;height:40px;position:absolute;top:41%;left:50%;font-size:0rem;display:flex;justify-content:center;align-items:center;transition:.3s;opacity:.8";    
        document.body.appendChild(lovelyEl);  

        btn_03.addEventListener('click',function(){
            lovelyEl.style.fontSize="1rem";
            setTimeout(()=>{
                lovelyEl.style.fontSize="0rem";
            },1000);

            //-------------------------
            //JUMP(버튼에 대한 점프)
            //-------------------------
            var jump_high= setInterval(()=>{
                param.game.player.object.position.y+=20;

                if(param.game.player.object.position.y>300){
                    clearInterval(jump_high);
                    var jump_low =  setInterval(()=>{
                        param.game.player.object.position.y-=10;
                        if(param.game.player.object.position.y<=0){
                            clearInterval(jump_low);
                        }
                    },20)
                }
             },20);
             //-------------------------

           
        })
        //--------------------------

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
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        //-----------------------------
        //JUMP
        //-----------------------------
        this.isJumping = false; // 점프 중인지 여부를 나타내는 변수
        this.jumpHeight = 2.0; // 점프 높이 조절
        this.isJumpingIntaval;

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
        this.domElement.style.top = `${this.location.top}px`;
        this.domElement.style.left = `${this.location.left}px`;
        //--------------------------
        //04 움직이기
        //--------------------------
        this.pc.call(this.game,0,0);

        //--------------------------        
    }


    //------------------------------
    //키보드
    //------------------------------
    // 키보드 이벤트 처리
    handleKeyDown(event) {
        const keyCode = event.keyCode;

        // 이미 눌린 키는 무시
        if (!this.pressedKeys.includes(keyCode)) {
            this.pressedKeys.push(keyCode);
        }

        // 모든 눌린 키에 대해 움직임과 점프를 누적
        this.handleKeyActions(event);
    }

    handleKeyUp(event) {
        const keyCode = event.keyCode;

        // 눌려있던 키를 배열에서 제거
        const index = this.pressedKeys.indexOf(keyCode);
        if (index !== -1) {
            this.pressedKeys.splice(index, 1);
        }

        // 떼어진 후의 모든 키에 대해 움직임과 점프를 누적
        this.handleKeyActions(event);
    }



    handleKeyActions(event) {
        let moveF = 0;
        let moveT = 0;
        let jump = false;

        // 모든 눌린 키에 대해 움직임과 점프 누적
        this.pressedKeys.forEach((keyCode) => {
            switch (keyCode) {
                case 32: // Space Bar
                    jump = true;
                                 
                    break;
                case 87: // W key
                    moveF += 1;                
                    break;
                case 83: // S key
                    moveF -= 1;
                    break;
                case 65: // A key
                    moveT += 1;
                    break;
                case 68: // D key
                    moveT -= 1;
                    break;
               

            }
        });

        // 캐릭터에게 눌린 키에 따라 움직임과 점프 전달
        this.pc.call(this.game, moveF, moveT);

        if (jump) {
 
                      
            this.jump();
           
           
        }
    }

    
    //-----------------------------
    // 06 점프
    //-----------------------------
    jump() {
        console.log("JUMP STATUS ",this.isJumping);
        
        //this.game.selAction="Jump";
  
        console.log("JUMPING INTERVAL ",this.isJumpingIntaval);
        if (!this.isJumping) 
        { 
                    
            this.isJumping=true;
  

                //점프UP 

                // setTimeout(()=>{


                
                // this.isJumpingIntaval = setInterval(()=>{
                //         this.game.player.object.position.y+=20;
                        

                //         if(this.game.player.object.position.y>300){
                //             clearInterval(this.isJumpingIntaval);
                            
                //             var jump_low =  setInterval(()=>{
                //                 this.game.player.object.position.y-=10;
                //                 if(this.game.player.object.position.y<=0){
                //                     clearInterval(jump_low);
                                
                //                 }
                                
                //             },25)
                //         }

                //     },20);
                
                // },100)
                 //점프UP End
 
            

            // setTimeout(()=>{
            //         console.log("Y : " +this.game.player.object.position.y );     
            //         this.game.selAction="Run";      
            // },1500);
                    
               
   
        }
        else {
            // 점프 동작이 끝나면 초기화
            this.isJumping = false;

        }
    }


}
