

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

        this.can = document.querySelector('.canvas1');
        this.ctx = this.can.getContext("2d");

        this.pos = this.can.getBoundingClientRect();
        this.sock;
        this.arr;
        this.startdraw=false;
       
    }

    draw(arr,that,fff){

        let temp=arr.shift();

        try{setTimeout(() => {
                    
                    
            let fff=that.startdraw;

            if(!fff){

                that.ctx.beginPath();
                
                that.ctx.moveTo(temp.start.x,temp.start.y);
                that.ctx.lineTo(temp.start.x,temp.start.y);
                that.ctx.lineTo(temp.end.x,temp.end.y);
                that.startdraw=true;
            }
            that.ctx.lineTo(temp.start.x,temp.start.y);
            that.ctx.lineTo(temp.end.x,temp.end.y);
            that.ctx.stroke();

            that.draw(arr,that,fff)

        }, Math.abs(temp.before-temp.now))}catch(e){

            console.log("end!")
            that.startdraw=false;
            that.ctx.closePath();
        }


    }


    setting(sock,that){

        

        let m =function(e){

            let arr=JSON.parse(e.data).arr;

            if(arr._arr!=null){
                console.log('hh')
                
                that.draw(arr._arr,that);
            }else{
                console.log('빈데이터...')
               
            }
        }

        m.bind(this);

        


        sock.onopen= function(e){

            sock.send(JSON.stringify({header : {start : 1, end : 0 , host : 0}}));

        }

        sock.onmessage = m;
    }

        
    


    start(url){

        if(url!=null){
            this.sock=new WebSocket(url);

            this.setting(this.sock,this);
        
        }

       

    }

    close(){


    }


}