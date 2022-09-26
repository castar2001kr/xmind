

class Queue {
    constructor() {
        this._arr = [];
    }
    enqueue(item) {
        this._arr.push(item);
    }
    dequeue() {
        return this._arr.shift();
    }

    isempty(){
       
        return this._arr.shift()==undefined;
    }

}



class host{

    constructor (){

        this.f=null;
        this.startdraw=false;
        this.buffer = new Queue();
        this.suffer = new Queue();

        this.before=null;
        this.now=null;

        this.beforeE={};

        this.can = document.querySelector('.canvas1');
        this.ctx = this.can.getContext("2d");

        this.pos = this.can.getBoundingClientRect();
        this.sock;
       
    }

    sendInterval(){

        
        let json={header : { host : 1},arr : {...this.suffer},};
        this.suffer=new Queue();

        this.sock.send(JSON.stringify(json));

    }

    setting(sock){

        let that= this;

        sock.onopen= function(e){
            sock.send(JSON.stringify({header : {start : 1, end : 0 , host : 1}}));

            setInterval(()=>that.sendInterval(),1000);

        }
    }


    start(url){

        if(url!=null){
            this.sock=new WebSocket(url);

            this.setting(this.sock);
        }

        $(".canvas1").on("mousedown",(e)=>{

           
            console.log(e.offsetX,e.offsetY);  
            this.ctx.fillRect(e.offsetX,e.offsetY,2,2);
            this.f=this.draw;
            

        })

        $(".canvas1").on("mousemove",(e)=>{

            if(this.f!=null)
            this.f(e);

        })

        $(".canvas1").on("mouseup",()=>{

            this.startdraw=false;
            this.f=null;
            console.log(this.buffer);
            this.flush();
        
        })

    }

    close(){

        $(".canvas1").off("mousedown");
        $(".canvas1").off("mousemove");
        $(".canvas1").off("mouseup");

    }



    getT(){
        return (new Date()).getMilliseconds();
    }

    flush(){

        console.log("drawing...");
        while(!this.buffer.isempty()){

            try{
                this.suffer.enqueue(this.buffer.dequeue());

            }catch(e){


            }

        }
    }

    draw(e){

        if(!this.startdraw){

            this.before=this.getT();
            this.ctx.beginPath();
            this.ctx.moveTo(e.offsetX,e.offsetY);
            this.startdraw=true;
            this.ctx.lineTo(e.offsetX,e.offsetY);
            this.ctx.stroke();
            this.now=this.getT();

            this.buffer.enqueue({
                start : {t : this.before, x : e.offsetX, y : e.offsetY},
                

                end : {t : this.now,  x : e.offsetX, y : e.offsetY}


            })

            this.before=this.getT();
            this.beforeE={offsetX : e.offsetX , offsetY : e.offsetY};
        }else{
                
                
            this.ctx.lineTo(e.offsetX,e.offsetY);
            this.ctx.stroke();
            this.now=this.getT();

            this.buffer.enqueue({
                start : {t : this.before, x : this.beforeE.offsetX, y : this.beforeE.offsetY},
                

                end : {t : this.now, x : e.offsetX, y : e.offsetY}


            })

            this.before=this.getT();
            this.beforeE={offsetX : e.offsetX , offsetY : e.offsetY};
        }

    }

}