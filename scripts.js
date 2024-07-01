/*data/hora*/
const div_data=document.getElementById('div_data');

const div_hora=document.getElementById('div_hora');

const data=new Date();


let dia=data.getDate()
dia<10?"0"+dia:dia

let Mes=data.getMonth() +1;
Mes<10?"0"+Mes:Mes

const dataR=dia+"/"+Mes+"/"+data.getFullYear();

div_data.innerHTML=dataR

const relogio=()=>{
const data=new Date()
let hora=data.getHours()
hora=hora<10?"0"+hora:hora

let minuto=data.getMinutes()
minuto=minuto<10?"0"+minuto:minuto

let segundo=data.getSeconds()
segundo=segundo<10?"0"+segundo:segundo

const hora_completa=hora+":"+minuto+":"+segundo

div_hora.innerHTML=hora_completa

}
const intervalo=setInterval(relogio,1000)
relogio()



/* MQTT*/
var mqtt;
var reconnectTimeout=2000;
var host="test.mosquitto.org";
var port=8081;

function onConnect(){
    console.log("conectado");
    mqtt.subscribe("teste/#");
}

function onError(message){
  console.log("Falha: " + message.errorCode + " " + message.errorMessage)
    setTimeout(MQTTConnect, reconnectTimeout);
  }

function onMessageArrived(msg){
  console.log("Mensagem: "+msg.destinationName+"="+msg.payloadString);

  if (msg.destinationName==="teste/OD"){
    dataOD.setValue(0,1, msg.payloadString);
    chartOD.draw(dataOD, optionsOD);
  }

  else if(msg.destinationName==="teste/TEMP"){
    dataTEMP.setValue(0,1, msg.payloadString);
    chartTEMP.draw(dataTEMP, optionsTEMP);
  }
  else if(msg.destinationName==="teste/SAT"){
    dataSAT.setValue(0,1, msg.payloadString);
    chartSAT.draw(dataSAT, optionsSAT);
  }
}

/*Concta Broker*/
function MQTTConnect() {
  console.log("Conectando " + host + " " + port);
  mqtt = new Paho.MQTT.Client(host, port, "IeCJSClient");
  var options = {
    timeout: 10,
    keepAliveInterval: 10,
    onSuccess: onConnect,
    onFailure: onError,
  };
  mqtt.onMessageArrived = onMessageArrived;
  mqtt.onConnectionLost = onError;
  mqtt.connect(options);
}

/*Parte gráfica chama API Gloogle CHarts*/
google.charts.load('current', {'packages':['gauge']});
google.charts.setOnLoadCallback(drawCharts);

/*Variáveis dos valores para os Gauges*/
var chartOD;
var chartTEMP;
var chartSAT;
var dataOD;
var dataTEMP;
var dataSAT;
var optionsOD;
var optionsTEMP;
var optionsSAT;


/* Função para desenhar todos os gráficos */
function drawCharts() {
	  drawOD();
	  drawTEMP();
		drawSAT();
}


/*Desenha o Grauge de oxigênio*/
function drawOD(){
  dataOD = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['OD', 0]
  ]);

   optionsOD = {
    min:0,
    max:12,
    minorTicks:10,
    majorTicks:["0","2","4","6","8", "10", "12" ],
    redFrom: 0,
    redTo:2 ,
    yellowFrom:2, 
    yellowTo: 3.5,
    greenFrom:3.5, 
    greenTo:12
  };
   chartOD = new google.visualization.Gauge(document.getElementById('OD'));

  chartOD.draw(dataOD, optionsOD);
}

  /*Desenha o Grauge de temperatura*/
function drawTEMP(){
   dataTEMP = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['TEMP°C', 0]
  ]);

   optionsTEMP = {
    min:10, 
    max:40,
    minorTicks:10,
    majorTicks:["10","15","20","25","30","35","40"],
    redFrom: 31, 
    redTo:40,
    yellowFrom:28,
    yellowTo: 31,
    greenFrom:10,
    greenTo:28
  };
   chartTEMP = new google.visualization.Gauge(document.getElementById('TEMP'));

  chartTEMP.draw(dataTEMP, optionsTEMP);
}


  /*Desenha o Grauge de saturação*/
  function drawSAT(){
    dataSAT = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['SAT %', 0]
    ]);
  
   optionsSAT = {
      min:0, 
      max:120,
      minorTicks:10,
      majorTicks:["0","10","20","30","40","50","60","70","80","90","100","110","120",],
      greenFrom:0, 
      greenTo:120
    };
     chartSAT = new google.visualization.Gauge(document.getElementById('SAT'));
  
    chartSAT.draw(dataSAT, optionsSAT);
  }

MQTTConnect();
