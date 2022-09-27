
let drg = false;
let count=0;

let linestarted=false;

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

    getarr(){

        return this._arr;
    }

    reset(){

        this._arr=[];
    }

}



const drawer_for_host = {

    linestarted : false,
    ctx : null,
    latest_time : 0,
    buffer : null,

    init : function(ctx){
        this.ctx=ctx;
        this.buffer=new Queue();
    }, 
    
    dot : function(e){

        this.ctx.fillRect(e.offsetX,e.offsetY,2,2);
        this.en(this.timestamp(1,e)); //1

    },

    line_start : function(e){

        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX,e.offsetY);
        this.ctx.lineTo(e.offsetX,e.offsetY)
        this.en(this.timestamp(5,e)); //5,6,7
    },

    line_to : function(e){
	
		
        this.ctx.lineTo(e.offsetX,e.offsetY);
        this.ctx.stroke();
        this.en(this.timestamp(6,e)); 
    },

    line_end : function(e){

       
        this.en(this.timestamp(7,e)); 
    }

    ,

    getT : function(){

        return (new Date()).getMilliseconds();
    },
    
    timestamp : function(type,e){

        let delay = 0;
        let now = this.getT();

        if(this.latest_time!=0){
            delay = Math.abs(this.latest_time-now);
        }

        this.latest_time=now;

        return result = {
            typ : type,
            x  : e.offsetX,
            y : e.offsetY,
            dly : delay,
        }


    },

    get_buff : function(){

        return this.buffer;
    }

    ,

    en : function(stamp){

        this.buffer.enqueue(stamp);

    }

    ,

    reset : function(){

        this.latest_time=0;
        this.buffer.reset();
        console.log('reset')

    }



}





const event_maker_for_host= {

    drawer : null,

    canvas : null,

    sock : null,

    send_buff:[],


    init : function(url,canvas,ctx){
        
        this.drawer = drawer_for_host;
        this.drawer.init(ctx);

        this.canvas=canvas;

        this.sock=new WebSocket(url);
        this.setting_sock(this.sock);

        this.canv_setting();
        
       

    },

    setting_sock : function(sock){

        let that = this;
        
        sock.onopen=()=>{
            
            that.f_msg();
            console.log('sock_opened')
            this.con=true;
        }

        sock.onerror=()=>{
            console.log('error detected')
        }
        
        sock.onclose=(e)=>{
        console.log(e)}
    },
    
    con : false,

    flush : function(){
		
		let e=this.drawer.get_buff().dequeue();
		
        while(e!=null){

            this.send_buff.push(e);
            e = this.drawer.get_buff().dequeue();
        }

        let last = this.send_buff[this.send_buff.length-1];

       
        
        if(this.con){
        
          
 
        this.send_msg(this.send_buff);
            
        }
        


    },

    f_msg : function(){

        this.send_msg();
        this.evstart();

    },
    
    make_msg : function(arr){

        if(arr==null){
            arr=[];
        }

        return JSON.stringify(
            
            {
            
            header : {host : 1},
            body : {arr},

            }
        )
    },

    send_msg : function(arr){

        that=this;

        

        let msg=that.make_msg(arr);

        that.sock.send(msg);
        
        that.send_buff=[];
  

        
    },

    evstart : function(){

        let that = this;

        this.sock.onmessage=(e)=>{console.log(e.data)};

    },

    canv_setting : function(){

        let that = this;

        $(".canvas").on("mousedown",(e)=>{

            
            that.drawer.dot(e);
            
            drg=true;

        })

        $(".canvas").on("mousemove",(e)=>{


            if(drg){
                
                if(!linestarted){

                    that.drawer.line_start(e);
                    linestarted=true;
                }else{

                    that.drawer.line_to(e);
                    
                    if(that.drawer.get_buff().getarr().length>20){
                        that.flush();
                    }

                }

               
            }
         
            

        })

        $(".canvas").on("mouseup",(e)=>{

            linestarted=false;
            that.drawer.line_end(e);
            that.flush();
            drg=false;
        
        })


    }


}

