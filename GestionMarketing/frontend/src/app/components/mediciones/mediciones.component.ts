import { Component, OnInit,AfterViewInit,ViewChild,ApplicationRef,OnDestroy} from '@angular/core';
import { IotService } from '../../services/iot.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var RadialGauge: any;
/*import './gauge.min.js';*/

@Component({
  selector: 'app-mediciones',
  templateUrl: './mediciones.component.html',
  styleUrls: ['./mediciones.component.scss']
})
export class MedicionesComponent implements OnInit,AfterViewInit,OnDestroy {
  @ViewChild("var1") var1;
  @ViewChild("var2") var2;
  @ViewChild("var3") var3;
  @ViewChild("var4") var4;
  @ViewChild("var5") var5;
  resultados=[]
  peticionLista;
  iddispositivo = JSON.parse( localStorage.getItem('dispositivo'));
  rectColor:string = "#FF0000";
  value: number=0;
  timer;
  constructor(private _iotservice:IotService) { }

  ngOnInit() {
  

  this.poblarLista();

 

 }
 
  ngAfterViewInit()
  { 
    this.timer = setInterval(() => { 
      //this.poblarLista();
      this.ActualizarLista();
      /*
      this.actualizarVar1();
      this.actualizarVar2();
      this.actualizarVar3();
      this.actualizarVar4();
      this.actualizarVar5(); */
    }, 3000);

  }

ngOnDestroy(){
clearInterval(this.timer);
//clearInterval(this.gaugeTime);
}


actualizarVar1(){
  let canvasSelect1 = this.var1.nativeElement;
  console.log(canvasSelect1.childNodes[1]);
  if (canvasSelect1.childNodes[1]!=undefined) {
  canvasSelect1.childNodes[1].setAttribute('data-value', this.resultados['var1']);
  }
  //console.log(canvasSelect.childNodes[1]);
}
 actualizarVar2(){
  let canvasSelect2 = this.var2.nativeElement;
  //console.log(canvasSelect2.childNodes[0]);
  if (canvasSelect2.childNodes[0]!=undefined) {
  canvasSelect2.childNodes[0].setAttribute('data-value', this.resultados['var2']);
  }
  //console.log(canvasSelect.childNodes[1]);
}
 actualizarVar3(){
  let canvasSelect3 = this.var3.nativeElement;
  //console.log(canvasSelect3.childNodes[0]);
  if (canvasSelect3.childNodes[0]!=undefined) {
  canvasSelect3.childNodes[0].setAttribute('data-value', this.resultados['var3']);
  }
  //console.log(canvasSelect.childNodes[1]);
}
 actualizarVar4(){
  let canvasSelect4 = this.var4.nativeElement;
  //console.log(canvasSelect4.childNodes[0]);
  if (canvasSelect4.childNodes[0]!=undefined) {
  canvasSelect4.childNodes[0].setAttribute('data-value', this.resultados['var4']);
  }
  //console.log(canvasSelect.childNodes[1]);
}
 actualizarVar5(){
  let canvasSelect5 = this.var5.nativeElement;
  //console.log(canvasSelect5.childNodes[0]);
  if (canvasSelect5.childNodes[0]!=undefined) {
  canvasSelect5.childNodes[0].setAttribute('data-value', this.resultados['var5']);
  }
  //console.log(canvasSelect.childNodes[1]);
}

ActualizarLista(){
  this.peticionLista = this._iotservice.getVars(this.iddispositivo.id).subscribe(
    res=>{
      for (var i = res.data.length - 1; i >= 0; i--) {

        this.resultados[res.data[i].code]=res.data[i].ultima_medicion;  

      }
    }, error => {
         if (error.status == 433) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }else{
           location.reload();
         }
       }
    );

  return this.peticionLista;
}

poblarLista(){
  this.peticionLista = this._iotservice.getVars(this.iddispositivo.id).subscribe(
    res=>{
      for (var i = res.data.length - 1; i >= 0; i--) {
        if (res.data[i].ultima_medicion!=null) {
          // code...
        this.resultados[res.data[i].code]=res.data[i].ultima_medicion;
        }else{
          this.resultados[res.data[i].code]=0;
        }
        if (res.data[i].status==1) {
          //console.log(res.data[i]);
         this.crearGauge('200', '200', res.data[i].code, res.data[i].minimo, res.data[i].maximo, res.data[i].rango_minimo, res.data[i].rango_maximo, res.data[i].ultima_medicion,res.data[i].nombre);
          document.getElementById(res.data[i].code + '_title').innerHTML = res.data[i].nombre;

        }else{
          document.getElementById(res.data[i].code + '_div').style.display = 'none';
        }
      }
    }, error => {
         if (error.status == 433) {
           localStorage.clear();
           sessionStorage.clear();
           location.reload();
         }else{
           location.reload();
         }
       }
    );

  return this.peticionLista;
}



ticks=[];
iTick;
unit;
gaugeTime;
crearGauge(width, height, idPosicion, min:number, max:number, rangeMin, rangeMax, startValue,title? ) {
 
 //veo si tiene nombre la variable
 if (title) {
   this.unit=title;
 }else{
   this.unit=idPosicion;
 }

 //Declaro variables y creo los "ticks" del gauge
 this.ticks = [];
 this.iTick = min;

 
 while(this.iTick<max){

    this.ticks.push(this.iTick.toString());

    this.iTick+=10;

 }


 /*console.log(idPosicion);
 console.log(this.ticks);*/


 var gauge = new RadialGauge({
    renderTo: idPosicion,
    width: width,
    height: height,
    title: this.unit,
    minValue: min,
    maxValue: max,
    majorTicks: this.ticks,
    minorTicks: 2,
    strokeTicks:true,
    exactTicks:true,
    highlights: [
        {
            "from": min,
            "to": rangeMin,
            "color": "rgba(255, 0, 0, .75)"
        },
        {
            "from": rangeMin,
            "to": rangeMax,
            "color": "rgba(51, 153, 51, .75)"
        },
        {
            "from": rangeMax,
            "to": max,
            "color": "rgba(255, 0, 0, .75)"
        }
    ],
    colorPlate: "#fff",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    value:startValue,
    animationTarget:'needle',
    animatedValue:true,
    animateOnInit:true,
    animationDuration: 1500,
    animationRule: "linear"
}).draw();


this.gaugeTime = setInterval(() => { 
     gauge.value= this.resultados[idPosicion];
    }, 3000);
}

loadData(event){ 

  console.log(event);
}


}
