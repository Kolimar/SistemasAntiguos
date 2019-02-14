import { Component, OnInit } from '@angular/core';
import { IotService } from '../../services/iot.service';
 import {IMyDrpOptions} from 'mydaterangepicker';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';


@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss']
})

export class HistoricoComponent implements OnInit {
options=[];
Highcharts = require('highcharts');
dispositivoActual = JSON.parse( localStorage.getItem('dispositivo'));
counter=[];
dia=[];
mes=[];
anio=[];
hora=[];
minuto=[];
segundo=[];
horaHelper=[];
minutoHelper=[];
segundoHelper=[];
dataValues=[];
datosVariable=[];
diaHelper=[];
mesHelper=[];
anioHelper=[];

maximo=[];
minimo=[];
rangoMax=[];
rangoMin=[];
variable=[];

public myDateRangePickerOptions: IMyDrpOptions = {
        dateFormat: 'dd.mm.yyyy',
    };

public myForm: FormGroup;
load;
constructor(private _iotservice:IotService,private formBuilder: FormBuilder, private toastyService:ToastyService,private toastyConfig: ToastyConfig ) {


  this.toastyConfig.theme = 'bootstrap';
  this.toastyConfig.position = "top-right";
 
    this.Highcharts.setOptions({
            colors: ['#000'],
            lang: {
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            weekdays: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
            }
    }); 

}


ngOnInit() {

 this.myForm = this.formBuilder.group({
            // Empty string means no initial value. Can be also specific date range for example:
            // {beginDate: {year: 2018, month: 10, day: 9}, endDate: {year: 2018, month: 10, day: 19}}
            // which sets this date range to initial value. It is also possible to set initial
            // value using the selDateRange attribute.

            myDateRange: ['', Validators.required]
            // other controls are here...
        });


}

mostrarValores(event){
  //console.log(this.myForm.value);
  this.load=true;
  var fechaInicio= this.myForm.value.myDateRange.beginDate.year + "-" + this.myForm.value.myDateRange.beginDate.month + "-" +this.myForm.value.myDateRange.beginDate.day + " 00:00:00";
  var fechaFinal= this.myForm.value.myDateRange.endDate.year + "-" + this.myForm.value.myDateRange.endDate.month + "-" +this.myForm.value.myDateRange.endDate.day + " 23:59:59";

  //console.log(fechaInicio);
  //console.log(fechaFinal);
  if(this.timeLeft(fechaInicio,fechaFinal)){
      this.consultarBD(JSON.parse( localStorage.getItem('dispositivo')).id, fechaInicio, fechaFinal);    
  }else{
    this.toastyService.warning(
                          {
                            title: "Seleccione un rango menor.",
                            msg: "No puede seleccionar más de 30 dias en el filtro",
                            showClose: false,
                            timeout: 10000,
                            theme: "bootstrap"
                        }
                       );
    this.load=false;
  }

}

validForm=false;
setDateRange(): void {

        // Set date range (today) using the setValue function
        let date = new Date();
        this.myForm.setValue({myDateRange: {
            beginDate: {

                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            },
            endDate: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            }
        }

      });

     
}

clearDateRange(): void {
    // Clear the date range using the setValue function
    this.myForm.setValue({myDateRange: ''});
}

now;
endDate;
diff;
timeLeft(inicio,fin) {
    this.now = new Date(inicio);
    this.endDate = new Date(fin); // 2017-05-29T00:00:00Z
    this.diff = this.endDate - this.now; 

    var hours   = Math.floor(this.diff / 3.6e6);

    //720 horas son 30 dias.-
    return hours<720;
}



generarGrafico(
    dia,
    mes,
    anio,
    hora,
    minuto,
    segundo,
    dataValues,
    maximo,
    minimo,
    rangoMax,
    rangoMin,
    variable:string,
    posicion:number)
{

var informacion = "[";
var contador=0;
for (var i = 0; i < dia.length; i++) {
  if (i+1 < dia.length) {
    informacion += '[Date.UTC' + '('+anio[i]+','+ mes[i] +'- 1' +','+ dia[i]+','+ hora[i]+','+ minuto[i]+','+ segundo[i]+'),'+ dataValues[i] + '],';
  }else{
    informacion += '[Date.UTC' + '('+anio[i]+','+ mes[i]+'- 1'+','+ dia[i]+','+ hora[i]+','+ minuto[i]+','+ segundo[i]+'),'+ dataValues[i] + ']]';
  }
contador+=1;
}
var infoData=eval(informacion);
//console.log(eval(informacion));
     this.options[posicion] = {
            chart: {
              zoomType: 'x',
              type: 'spline'
                },
             credits:{
               enabled:false
             },

              xAxis: {
                  type: 'datetime',
                  min: infoData[0][0],
                  labels: {
                      step: 1,
                      style: {
                          fontSize: '13px',
                          fontFamily: 'Arial,sans-serif'
                      }
                  },
                  dateTimeLabelFormats: { 
                      month: '%b \'%y',
                      year: '%Y'
                  }
                  },
                  title : { text : 'Grafico variaciones historicas de : '+ variable },
                  plotOptions: {
                     line: {
                          dataLabels: {
                              enabled: true
                          }
                      },
                      spline: {
                          lineWidth: 0.5,
                          states: {
                              hover: {
                                  lineWidth: 1
                              }
                          }
                      }
                  },
            series: [{
                    name: variable,
                    pointStart: infoData[0][0],
                    pointInterval: 24 * 3600 * 1000,
                    data: infoData
                }],
            yAxis: {
                min: minimo, 
                max: maximo,
              plotLines: [{
                color: 'red', // Color value
                dashStyle: 'solid', // Style of the plot line. Default to solid
                value: rangoMax, // Value of where the line will appear
                width: 2 // Width of the line    
              },{
                color: 'red', // Color value
                dashStyle: 'solid', // Style of the plot line. Default to solid
                value: rangoMin, // Value of where the line will appear
                width: 2 // Width of the line    
              }]
            },
            
    }

    
}


selectData(event) {
}



consultarBD(dispositivo, inicio, fin){
  //subscripcion a consulta bd
this.load=true;
let consulta = this._iotservice.getHistorico(dispositivo, inicio, fin).subscribe(res=>{
  
  //console.log(res);
 
  for (var i = res.dataHistorico.length - 1; i >= 0; i--) {

    if (res.dataHistorico[i].ultima_medicion!=null) {
       
     
      let arr=[];
     
      for (var j = 0; j < res.dataHistorico[i].historico.length; j++) {
        
        let date = new Date(res.dataHistorico[i].historico[j].fecha_ultima_medicion);
        
        //date.getTime();
        //console.log(date.getMonth() + 1);
        this.diaHelper[j] = date.getDate();
        this.mesHelper[j] = date.getMonth() + 1;
        this.anioHelper[j] = date.getFullYear();
        this.horaHelper[j] = date.getHours();
        this.minutoHelper[j] = date.getMinutes();
        this.segundoHelper[j] = date.getSeconds();


        arr[j] =  parseFloat(res.dataHistorico[i].historico[j].ultima_medicion);

      }

      this.dia[i]= this.diaHelper;
      this.mes[i]= this.mesHelper;
      this.anio[i]= this.anioHelper;
      this.hora[i] = this.horaHelper;
      this.minuto[i] = this.minutoHelper;
      this.segundo[i] = this.segundoHelper;
      this.dataValues[i] = arr;
      
      this.counter[i] = res.dataHistorico[i].maximo;
      this.maximo[i]= res.dataHistorico[i].maximo ;
      this.minimo[i]= res.dataHistorico[i].minimo ;
      this.rangoMax[i]= res.dataHistorico[i].rango_maximo ;
      this.rangoMin[i]= res.dataHistorico[i].rango_minimo ;
      this.variable[i]= res.dataHistorico[i].nombre ;

      //console.log(res.dataHistorico[i]);     

     }

  }

/*  console.log(this.dia,
  this.mes,
 this.anio);*/
},error=>{
   this.toastyService.error(
                          {
                            title: "Algo salio mal.",
                            msg: "Por favor intente mas tarde",
                            showClose: false,
                            timeout: 10000,
                            theme: "bootstrap"
                        }
                       );
  console.log(error);

},

()=>{

  /*console.log(this.dataValues);
  console.log(this.dia);
  console.log(this.mes);
  console.log(this.anio);*/

for (var e = 0; e < this.counter.length; e++) {
 
    
    this.generarGrafico(
     this.dia[e],
     this.mes[e],
     this.anio[e],
     this.hora[e],
     this.minuto[e],
     this.segundo[e],
     this.dataValues[e],
     this.maximo[e],
     this.minimo[e],
     this.rangoMax[e],
     this.rangoMin[e],
     this.variable[e],
     e

     );
  

}
this.load=false;
});

//fin de la consulta a la bd 
}

}
