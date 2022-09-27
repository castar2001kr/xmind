
let workingnow=false;

const drawer_for_slave = {

    linestarted : false,
    ctx : null,


    init : function(ctx){
        this.ctx=ctx;
        
    },
    
    dot : function(x,y){

        this.ctx.fillRect(x,y,2,2);
  

    },

    line_start : function(x,y){

        if(this.linestarted==false){

            this.ctx.beginPath();
            this.ctx.moveTo(x,y);
            this.ctx.lineTo(x,y);
            this.linestarted=true;
        }
    },

    line_to : function(x,y){

        if(this.linestarted){

            this.ctx.lineTo(x,y);
            this.ctx.stroke();
        }
    },

    line_end : function(){

        this.linestarted=false;
       
    },

   

    order : function(buff){

        

        workingnow=true;
        console.log('버퍼 : ',buff)
        let e = buff.shift();
        this.do(buff,e);
       

    },
    
    do : function(buff , e){

        let that = this;

        console.log('실행중...')

        if(e!=null){

            let typ = e.typ;
            let dly = e.dly;
            let x= e.x;
            let y= e.y;
   
            if(typ==1){
    
                setTimeout(() => {
                    
                    that.dot(x,y);
                    that.order(buff);
    
                }, dly);
    
            }else if(typ==5){
    
                setTimeout(()=>{
    
                    that.line_start(x,y);
                    that.order(buff);
    
                }, 
                dly);
    
            }else if(typ==6){
                setTimeout(()=>{
    
                    that.line_to(x,y);
                    that.order(buff);
                },
                dly);
            }else if(typ==7){
                setTimeout(()=>{
    
                    that.line_end(x,y);
                    that.order(buff);
                },
                dly);
    
            }

        }else{
            workingnow=false;
            console.log("no data...")
        }
    }



}


const event_maker_for_slave= {

    drawer : null,

    canvas : null,

    sock : null,

    init : function(url,canvas,ctx){
        
        this.drawer = drawer_for_slave;
        this.drawer.init(ctx);

        this.canvas=canvas;

        this.sock=new WebSocket(url);
        this.setting_sock(this.sock);
        
       

    },

    setting_sock : function(sock){

        let that = this;

        sock.onmessage=(e)=>{

            body = (JSON.parse(e.data)).body;

            if(body!=null){

                that.controll_msg(body);

                if(!workingnow){

                    that.drawer.order(that.received_buff)
                }

            }
            
        }

        sock.onopen=(e)=>{
            sock.send(JSON.stringify({header:{host : 0}}));
        }
    },

    
    


    controll_msg : function(body){
        
        that= this;

        body.arr.forEach((e)=>{

            that.received_buff.push(e);

        });
        

		console.log("데이터 수신...")
        

    },

    received_buff : []



}