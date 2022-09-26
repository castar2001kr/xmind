import { Stack } from "./Stack.js";
import { Tetris } from "./tetris.js";
import { Generator } from "./tetris.js";

const height = 15;
const width = 10;

const pix=10;

let color= ["red","blue","yellow","black"];

let phase_num=0;

let space=new Array(height);

let now_tetris=null;

let timerId=null;


let legacy=new Stack();


for(let i=0; i<height; i++){

    space[i]=new Array(width);
    
    for(let j=0; j<width; j++){
        space[i][j]=0;
    }

}

let map = document.getElementById("map");

let canv=document.createElement("canvas");
canv.style.height="300px";
canv.style.width="600px";
let ctx=canv.getContext("2d");

map.appendChild(canv);

let btn =document.getElementById("turn");

btn.addEventListener("click",turn);

let lft=document.getElementById("left");
let rit=document.getElementById("right");
let skp=document.getElementById("skipper");

lft.addEventListener("click",mv_left);
rit.addEventListener("click",mv_right);
skp.addEventListener("click",skip);

let total_score =0;
let p =document.querySelector("po");

phase();
document.addEventListener("keydown",key);

function key(e){
    console.log(e.key);
    if(e.key=='ArrowLeft'){
        mv_left();
    }
    else if(e.key=='ArrowRight'){
        mv_right();
    }else if(e.key=='x'){
        turn();
    }else if(e.key=='c'){
        skip();
    }
}



function phase(){

    console.log(phase_num++)

    legacy=new Stack();

    console.log("phase start")

    now_tetris=new Tetris();
    
    let random_move=Math.floor(Math.random()*(width-now_tetris.len));

    now_tetris.arr.forEach((ele)=>{
        ele[1]+=random_move;
        console.log("y좌표 : "+ele[0]);
    })

    

    timerId=setInterval(()=>{

        if(check_for_stop(now_tetris)){

            loop();
            console.log("tetris is going downside");
            console.log(now_tetris.arr);
        }

    },300)



}


function skip(){
    if(check_for_stop(now_tetris)){

        loop();
        console.log("tetris is going downside");
        console.log(now_tetris.arr);

        skip();
    }else{
        
    }
}

function check_for_stop(now){

    let arr = new Array(4);
    let result=true;

    for(let i=0; i<4; i++){
        arr[i]=now.arr[i];
    }

    let found=false;

    arr.forEach((ele)=>{

       
        if(!found){

            if(ele[0]>=Number(0)){

                
    
                console.log( "0보다 큰 값 :"+ ele[0])
                console.log("phase num : "+(phase_num-1))
                
                if(ele[0]==height-1||space[ele[0]+1][ele[1]]!=0){ //!!! ==1은 안됨!
                    found=true;
                    clearInterval(timerId);
                    console.log("clear interval");
                    
                   
                    let score = now.point;
                    
                    arr.forEach((ele)=>{
                        console.log("detected : "+ele);
    
                        if(ele[0]>=0)
                        space[ele[0]][ele[1]]=score;
                    })
    
    
                    if(live_check(now)){
                        console.log("새로운 페이즈 시작")
                        p.innerHTML=total_score;
                        phase();
                    }else{
    
                       
                        console.log("게임 종료.");
                    }
        
    
    
                    result= false;
                    console.log(result)
                }
            }
        }

    });

    return result;
}

function mv_left(){

    let able=true;
    let temp=new Stack();

    now_tetris.arr.forEach((ele)=>{

        let x=ele[1]-1;
        let y=ele[0];

        console.log("------------------------------------------")
        console.log("x : "+x);
        console.log("y : "+y);

        if(x>=0&&x<width && y<0||x>=0&&x<width && y<height && space[y][x]==0){

            temp.push([y,x]);
            
        }else{
            console.log("!!!!!!!!!!1unabled!!!!!!!!!!!!")
            able=false;
        }


    })


    if(able){
        for(let i=3; i>=0;i--){
            now_tetris.arr[i]=temp.pop();
            now_tetris.center=now_tetris.arr[now_tetris.centerN];
        }

        draw();
        

    }


}

function mv_right(){

    let able=true;
    let temp=new Stack();

    console.log("right!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    

    now_tetris.arr.forEach((ele)=>{

        let x=ele[1]+1;
        let y=ele[0];

        console.log("------------------------------------------")
        console.log("x : "+x);
        console.log("y : "+y);

        if(x>=0&&x<width && y<0||x>=0&&x<width && y<height && space[y][x]==0){

            temp.push([y,x]);
            
        }else{
            console.log("!!!!!!!!!!1unabled!!!!!!!!!!!!")
            able=false;
        }


    })
    

    if(able){
        for(let i=3; i>=0;i--){
            now_tetris.arr[i]=temp.pop();
            now_tetris.center=now_tetris.arr[now_tetris.centerN];
        }

        draw();
        

    }


}

function loop(){

    now_tetris.arr.forEach((ele)=>{

        ele[0]+=1;
    });

    draw();
}

function turn(){

    let able=true;
    let temp=new Stack();

    if(now_tetris.center){

        now_tetris.arr.forEach((ele)=>{
    
            let temp1=ele[0];
            let temp2=ele[1];
    
            let x=now_tetris.center[1]+(temp1-now_tetris.center[0]);
            let y=now_tetris.center[0]+(now_tetris.center[1]-temp2);
    
            console.log("------------------------------------------")
            console.log("x : "+x);
            console.log("y : "+y);
    
            if(x>=0&&x<width && y<0||x>=0&&x<width && y<height && space[y][x]==0){
    
                temp.push([y,x]);
                
            }else{
                console.log("!!!!!!!!!!1unabled!!!!!!!!!!!!")
                able=false;
            }
    
    
        })
    }else{
        able=false;
    }

    if(able){
        for(let i=3; i>=0;i--){
            now_tetris.arr[i]=temp.pop();
            now_tetris.center=now_tetris.arr[now_tetris.centerN];
        }

        draw();
        

    }
    


}


function live_check(now){

    let result = true;
    now.arr.forEach((ele)=>{
        console.log("live check : "+ele[0])
        if(ele[0]<=0){

            

            result= false;
        }
    })


    if(result){

        now.arr.forEach((ele)=>{
            

            if(ele[0]!="pass"){

                let found =false;

            for(let i=0; i<width; i++){

                if(space[ele[0]][i]==0){
                    found=true;
                }
            }

            if(!found){

                
                for(let i=0;  i<width;  i++){

                    total_score+=space[ele[0]][i];
                    space[ele[0]][i]=0;
                    
                }

                for(let i=ele[0]; i>=1; i--){

                    
                    space[i]=space[i-1];

                }
                space[0]=new Array(width);

                for(let i=0; i<width; i++){
                    space[0][i]=0;
                }

                let temp=ele[0];

                now.arr.forEach((el)=>{
                    if(el[0]<temp)
                    el[0]+=1;
                    else if(el[0]==temp){
                        el[0]="pass";
                    }
                })

            }

            }else{
                console.log(ele);
                console.log("스킵된 것")
            }
            

        });

        for(let i=0; i<height; i++){
            for(let j=0; j<width; j++){
                eraseOne([i,j]);
            }
        }

        for(let i=0; i<height; i++){
            for(let j=0; j<width; j++){

                if(space[i][j]==0){

                    eraseOne([i,j]);
                }else{
                    drawOne([i,j],1);
                }
            }
        }


    }

    return result;

}

function draw(){

    console.log(now_tetris.arr);

    while(!legacy.isEmpty()){

        eraseOne(legacy.pop());
        
    }

    now_tetris.arr.forEach((ele)=>{

        console.log("drawing....")
        drawOne(ele,null);
        legacy.push([ele[0],ele[1]]);

    })


}

function drawOne(ele,c){

    if(c>=1){

       

            ctx.fillStyle=color[space[ele[0]][ele[1]]-1];
            ctx.fillRect(ele[1]*pix,ele[0]*pix,pix,pix);
            
            
            
       
    }else{
        
        ctx.fillStyle=now_tetris.color;
        ctx.fillRect(ele[1]*pix,ele[0]*pix,pix,pix);
    }

}




function eraseOne(ele){

    if(ele[0]>=0){

        ctx.clearRect(ele[1]*pix,ele[0]*pix,pix,pix);
    }

}