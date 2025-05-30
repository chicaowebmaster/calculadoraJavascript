
class CalcController {

    constructor(){

        // Atributos
        this._audio = new Audio('clicK.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalc = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initkeyboard();
        this.pasteFromClipboard();

    }

    initialize(){

        this.setDisplayDateTime();
  
        setInterval(()=>{
          
           this.displayTime = this.currentDate.toLocaleTimeString();   
  
          }, 1000);
  
         this.setLastNumbertoDisplay(); 

         document.querySelectorAll('.btn-ac').forEach(btn=>{

                   btn.addEventListener('dblclick', e=>{

                           this.toggleAudio();

                   });    

         });
  
      }

      toggleAudio(){

           this._audioOnOff = (this._audioOnOff) ? false : true;

      }

      playAudio(){

           if(this._audioOnOff){
 
               this._audio.currentTime = 0;
               this._audio.play();

           }

      }

    // Copia numero
    copyToClipboard(){

          // criar elemento
          let input = document.createElement('input');

          input.value = this.displayCalc;

          document.body.appendChild(input);

          input.select();

          document.execCommand('Copy');

          input.remove();   

    }

    // Cola dado copiado
    pasteFromClipboard(){

          document.addEventListener('paste', e=>{

                let text = e.clipboardData.getData('Text');

                this.displayCalc = parseFloat(text);

          });

    }


    initkeyboard(){

          document.addEventListener('keyup', e=>{

            this.playAudio();

            switch(e.key){

                case 'Escape':
                  this.clearAll();
                  break;
                case 'Backspace':
                  this.clearEntry();
                  break;
                case '+':
                case '-':
                case '/': 
                case '*':
                case '%':
                     this.addOperation(e.key);
                     break;   
                 case 'Enter':
                 case '=':   
                      this.calc();
                     break; 
                  case '.':
                     this.addDot();
                     break;
                  case '0':
                  case '1':
                  case '2':
                  case '3':
                  case '4':
                  case '5':
                  case '6':
                  case '7':
                  case '8':
                  case '9':
                     this.addOperation(parseInt(e.key));
                    break;
                  case 'c':
                     if(e.ctrlKey) this.copyToClipboard();
                    break;

           }

          });

    }

    addEventListenerAll(element, events, fn){

               events.split(" ").forEach(event =>{

                   element.addEventListener(event, fn, false);

               }); 

    }

    clearAll(){

         this._operation = [];  
         this.displayCalc = 0;         

    }

    clearEntry(){
    
        try{
            this._operation.pop();
            this.displayCalc = this._operation[this._operation.length - 2];
        }catch(e){
            setTimeout(()=>{
                this.setError();
            }, 1);
        }
         

    }

    setError(){

        this.displayCalc = "Error";

    }

    getLastOperation(){

          return this._operation[this._operation.length - 1];

    }

    setLastOperation(value){

        this._operation[this._operation.length - 1] = value;

    }

    isOperator(value){

         return (['+', '-', '*', '/', '%'].indexOf(value) > -1);

    }

    pushOperator(value){

           this._operation.push(value);

           if(this._operation.length > 3){

                this.calc();

           }

    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operation.length-1; i >= 0; i--){
 
                if(this.isOperator(this._operation[i]) == isOperator){                           
                     lastItem = this._operation[i];
                    break;
                 }
             
        }

        if(!lastItem){

              lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }   

    setLastNumbertoDisplay(){

            let lastNumber = this.getLastItem(false);

        
            if(!lastNumber) lastNumber = 0;

            this.displayCalc = lastNumber; 

    }

    getResult(){

           // função que faz o cálculo
           try{
              return eval(this._operation.join("")); 
           }catch(e){
                setTimeout(()=>{
                    this.setError(); 
                }, 1);
           }

    }

    calc(){

         let last = '';

         this._lastOperator = this.getLastItem();

         if(this._operation.length < 3){

              let firstItem = this._operation[0];
              this._operation = [firstItem, this._lastOperator, this._lastNumber];

         }

         if(this._operation.length > 3){

            last = this._operation.pop();

            this._lastNumber = this.getResult();

         } else if(this._operation.length == 3){

            this._lastNumber = this.getLastItem(false);

         }

         let result = this.getResult();

        if(last == '%'){

           result /= 100;   
           this._operation = [result];

        }else{

            this._operation = [result]; 

            if(last) this._operation.push(last);

        }
      
        this.setLastNumbertoDisplay();

    }

    addDot(){

          let lastOperation = this.getLastOperation();

          if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.')) return;

          if(this.isOperator(lastOperation) || typeof lastOperation == 'undefined'){

                this.pushOperator('0.');

          }else{

               this.setLastOperation(lastOperation.toString() + '.');

          }

          this.displayCalc = this._operation.join("");

    }

    addOperation(value){

          if(isNaN(this.getLastOperation())){

              // string   
              if(this.isOperator(value)){

                  // trocar o operador
                  this.setLastOperation(value);

              } else {
            
                 this.pushOperator(value);  

              }   

          } else {

             if(this.isOperator(value)){

                this.pushOperator(value);  

             }else{

                // number
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                

             }

             
          }

          this.displayCalc = this._operation.join("");
         

    }

    execBtn(value){

              this.playAudio();     

              switch(value){

                   case 'ac':
                     this.clearAll();
                     break;
                   case 'ce':
                     this.clearEntry();
                     break;
                   case 'soma':
                      this.addOperation('+');
                      break;                       
                   case 'subtracao':
                    this.addOperation('-');
                        break;   
                   case 'divisao':
                        this.addOperation('/');
                        break;     
                   case 'multiplicacao':
                       this.addOperation('*');
                        break;   
                    case 'porcento':
                        this.addOperation('%');
                        break;   
                    case 'igual':
                         this.calc();
                        break; 
                     case 'ponto':
                        this.addDot();
                        break;
                     case '0':
                     case '1':
                     case '2':
                     case '3':
                     case '4':
                     case '5':
                     case '6':
                     case '7':
                     case '8':
                     case '9':
                        this.addOperation(parseInt(value));
                       break;
                     default:
                        this.setError();
                       break;

              }

    }

    initButtonsEvents(){

         let buttons = document.querySelectorAll("#buttons > g, #parts > g");

         // loop forEach
         buttons.forEach((btn, index)=>{

               this.addEventListenerAll(btn, 'click drag', e=>{

                     let textBtn = btn.className.baseVal.replace("btn-","");

                     this.execBtn(textBtn); 


               });

               this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=>{

                      btn.style.cursor = "pointer";

              });

         });

    }

    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString('pt-BR',{day: '2-digit', month: 'long', year: 'numeric'});
        this.displayTime = this.currentDate.toLocaleTimeString(); 

    }

    get displayTime(){
  
          return this._timeEl.innerHTML;

    }

    set displayTime(value){
  
         this._timeEl.innerHTML = value;

    }

    get displayDate(){
        
         return this._dateEl.innerHTML;

    }

    set displayDate(value){
        
        this._dateEl.innerHTML = value;

    }

    get displayCalc(){

        return this._displayCalc.innerHTML;

    }

    set displayCalc(value){

        if(value.length > 10){
            this.setError();
        }else{
           this._displayCalc.innerHTML = value;
        }

    }

    get currentDate(){

        return new Date();

    }

    set currentDate(value){

        this._currentDate = value;

    }

}