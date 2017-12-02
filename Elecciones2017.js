
var TSE_Data = [];
var TSE_Data_Counter = 0;

var mesasStart = 0;
var mesasCounter = 0;
var mesasLimit = 0;

var myRep;

var votos_Nasralla = 0;
var votos_JOH = 0;
var votos_Romeo = 0;
var votos_Narvaez = 0;
var votos_Reyes = 0;
var votos_Pineda = 0;
var votos_Medrano = 0;
var votos_Aguilar = 0;
var votos_Castellanos = 0;

var actas_Divulgacion = [];
var actas_Monitoreo = [];
var actas_NoRecibido = [];
var actas_Recibido = [];
var actas_Desconocido = [];

var mesas_NumerosNoCuadran = [];

var mesas_ROMEO_Nasralla = [];
var mesas_GANA_JOH = [];
var mesas_GANA_JOH_Doble = [];
var mesas_GANA_Nasralla = [];
var mesas_Empate = []

var mesas_Error = [];

function table() {
   $('#table').DataTable( {
        data: dataSet,
        columns: [
            { title: "Name" },
            { title: "Position" },
            { title: "Office" },
            { title: "Extn." },
            { title: "Start date" },
            { title: "Salary" }
        ]
    } );
}

function extraerActas(comienzo, fin){
	for(var i = comienzo; i <= fin; i++){
		$.ajax({
			url : "https://api.tse.hn/prod/ApiActa/Consultar/1/" + i,
			async : false,
			success: function (data){
				TSE_Data[TSE_Data_Counter] = data;
				var CodActa = data.CodActa;
				var NomEstado = data.NomEstado;

				if(NomEstado == "Divulgacion"){

					actas_Divulgacion.push(CodActa);

					//Verificacion de Datos
					temp_VotosValidos = data.NumVotosValidos;
					temp_VotosBlancos = data.NumVotosBlancos;
					temp_VotosNulos = data.NumVotosNulos;

					temp_VotosTotal = data.NumVotosTotal;

					temp_PapeletasRecibidas = data.NumPapeletasRecibidas;
					temp_PapeletasSobrantes = data.NumPapeletasSobrantes;
					temp_PapeletasUtilizadas = data.NumPapeletasUtilizadas;

					totalVotos = temp_VotosValidos + temp_VotosNulos + temp_VotosBlancos;
					totalVotosValidos = 0;

					temp_Narvaez = data.Votos[0].NumVotos;
					temp_NASRALLA = data.Votos[1].NumVotos;
					temp_Reyes = data.Votos[2].NumVotos;
					temp_Pineda = data.Votos[3].NumVotos;
					temp_Medrano = data.Votos[4].NumVotos;
					temp_ROMEO = data.Votos[5].NumVotos;
					temp_Aguilar = data.Votos[6].NumVotos
					temp_Castellanos = data.Votos[7].NumVotos
					temp_JOH = data.Votos[8].NumVotos;
	
					votos_JOH += temp_JOH;
					votos_Nasralla += temp_NASRALLA;
					votos_Narvaez += temp_Narvaez;
					votos_Reyes += temp_Reyes;
					votos_Pineda += temp_Pineda;
					votos_Medrano += temp_Medrano;
					votos_Aguilar += temp_Aguilar;
					votos_Castellanos += temp_Castellanos;

					for (var x = 0; x <= 8; x++) {
						totalVotosValidos += data.Votos[x].NumVotos;
					}

					if((totalVotosValidos != temp_VotosValidos) || (totalVotos != temp_VotosTotal) ||
						 (temp_PapeletasUtilizadas != totalVotos) || 
						 ((temp_PapeletasRecibidas - totalVotos) != temp_PapeletasSobrantes)){
						mesas_NumerosNoCuadran.push(CodActa)
					}

					if(temp_ROMEO > temp_NASRALLA){
						mesas_ROMEO_Nasralla.push(CodActa);
					}

					if(temp_JOH > temp_NASRALLA){
						porcentaje = temp_NASRALLA/temp_JOH;
						porcentaje = round(porcentaje,2);
						if(porcentaje <= 0.5){
							mesas_GANA_JOH_Doble.push(CodActa);
						}
						mesas_GANA_JOH.push(CodActa);
					}
					else if (temp_NASRALLA > temp_JOH){
						mesas_GANA_Nasralla.push(CodActa);
					}
					else if (temp_NASRALLA == temp_JOH){
						mesas_Empate.push(CodActa)
					}
				}
				else if(NomEstado == "Monitoreo"){
					actas_Monitoreo.push(CodActa);
				}
				else if(NomEstado == "No Recibido"){
					actas_NoRecibido.push(CodActa);
				}
				else if(NomEstado == "Recibido"){
					actas_Recibido.push(CodActa);
				}
				else{
					actas_Desconocido.push(CodActa);
				}
			},
		    error: function(data, status){
		    	TSE_Data[TSE_Data_Counter] = {};
		    	mesas_Error.push(i); 
		    }
		});
		TSE_Data_Counter++;	
	}
}

//var res = alasql('SELECT CodActa from ? WHERE Votos->1->NumVotos >= Votos->2->NumVotos', [TSE_Data]);

//document.getElementById("res").textContent = JSON.stringify(res);

round = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

// test = data, name = "filename.json", type ="text/plain"
function downloadJSON(data, name, type) {
  var a = document.getElementById("jsonLink");
  var file = new Blob([JSON.stringify(data)], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
}

// test = plainText, name = "filename.txt", type ="text/plain"
function downloadResumen(text, name, type) {
  var a = document.getElementById("resumenLink");
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
}

function setDownloadFiles(){
	//Start-Counter
	var filename = mesasStart + "-" + (mesasCounter-1);
	var summary = summaryBuildUp();
	downloadJSON(TSE_Data, filename+".json", "text/plain");
	downloadResumen(summary,filename+".txt", "text/plain");
}

function resetRepeticion(){
	stopRepeticion();
	TSE_Data = [];
	mesasStart = 0;
	mesasCounter = 0;
	mesasLimit = 0;

	votos_Nasralla = 0;
	votos_JOH = 0;
	votos_Romeo = 0;
	votos_Narvaez = 0;
	votos_Reyes = 0;
	votos_Pineda = 0;
	votos_Medrano = 0;
	votos_Aguilar = 0;
	votos_Castellanos = 0;

	actas_Divulgacion = [];
	actas_Monitoreo = [];
	actas_NoRecibido = [];
	actas_Recibido = [];
	actas_Desconocido = [];

	mesas_NumerosNoCuadran = [];

	mesas_ROMEO_Nasralla = [];
	mesas_GANA_JOH = [];
	mesas_GANA_JOH_Doble = [];
	mesas_GANA_Nasralla = [];
	mesas_Empate = []

	mesas_Error = [];
	$("#startMER").val("");
	$("#endMER").val("");
	$("#currentMER").html("");
	$("#jsonLinkItem").html("<a id ='jsonLink'>Descargar JSON</a>");
	$("#resumenLinkItem").html("<a id ='resumenLink'>Descargar Resumen</a>");
}

function repeticion(){
	if(mesasCounter <= mesasLimit){
		$("#currentMER").html(mesasCounter);
		extraerActas(mesasCounter,mesasCounter);
		mesasCounter += 1
	}
	else {
		clearInterval(myRep);
		$("#currentMER").html("Completo, por favor haz click en 'Activar Descarga'. ");
	}
}

function startRepeticion(){
	mesasStart = parseInt($("#startMER").val());
	mesasCounter = parseInt($("#startMER").val());
	mesasLimit = parseInt($("#endMER").val());

	if(isNumeric(mesasStart) && isNumeric(mesasLimit) && (mesasStart >= 1 && mesasStart <=18128)
		&& (mesasLimit >= 1 && mesasLimit <=18128) && (mesasStart <= mesasLimit)){
		myRep = setInterval(function(){repeticion()}, 1000);
		alert("Comienzo de Procesamiento!");
	}
	else{
		alert("Verifica valores de 'Desde' y/o 'Hasta'. Alguno es invalido o no esta presente!");
	}
}

function stopRepeticion(){
	if((typeof myRep) != 'undefined'){
		clearInterval(myRep);
	}
	alert("Se Detuvo el Procesamiento o Termino!");
}

function summaryBuildUp(){

	var summary_text = "################################### MERs : " + mesasStart + "-" + (mesasCounter-1) + " ###################################\n\n";
	summary_text += "\tVotos Para Nasralla: " + votos_Nasralla + "\n";
	summary_text += "\tVotos Para JOH: " + votos_JOH + "\n\n";
	summary_text += "\tCantidad Actas en Divulgacion: " + actas_Divulgacion.length + "\n";
	summary_text += "\tCantidad Actas en Recibido: " + actas_Recibido.length + "\n";
	summary_text += "\tCantidad Actas en Monitoreo: " + actas_Monitoreo.length + "\n";
	summary_text += "\tCantidad Actas en No Recibido: " + actas_NoRecibido.length + "\n";
	summary_text += "\tCantidad Actas en Estado Desconocido: " + actas_Desconocido.length + "\n\n";

	summary_text += "\tCantidad Actas donde Numeros no cuadran pero en Estado de Divulgacion: " + mesas_NumerosNoCuadran.length + "\n\n";

	summary_text += "\tCantidad de MERs donde Nasralla Gana: " + mesas_GANA_Nasralla.length + "\n";
	summary_text += "\tCantidad de MERs donde JOH Gana: " + mesas_GANA_JOH.length + "\n";
	summary_text += "\tCantidad de MERs donde JOH aventaja a Nasralla por el doble o mas: " + mesas_GANA_JOH_Doble.length + "\n";
	summary_text += "\tCantidad de MERs donde Nasralla Empata con JOH: " + mesas_Empate.length + "\n";
	summary_text += "\tCantidad de MERs donde Romeo le gana a Nasralla: " + mesas_ROMEO_Nasralla.length + "\n";

	summary_text += "\tCantidad de MERs de las cuales no se pudo extraer informacion: " + mesas_Error.length + "\n\n";

	summary_text += "################################### Listado de MERs ###################################\n\n";

	summary_text += "\tActas en Divulgacion: " + JSON.stringify(actas_Divulgacion) + "\n\n"; 
	summary_text += "\tActas en Recibido: " + JSON.stringify(actas_Recibido) + "\n\n"; 
	summary_text += "\tActas en Monitoreo: " + JSON.stringify(actas_Monitoreo) + "\n\n"; 
	summary_text += "\tActas en No Recibido: " + JSON.stringify(actas_NoRecibido) + "\n\n"; 
	summary_text += "\tActas en Estado Desconocido: " + JSON.stringify(actas_Desconocido) + "\n\n"; 

	summary_text += "\tActas donde Numeros no cuadran pero en Estado de Divulgacion: " + JSON.stringify(mesas_NumerosNoCuadran) + "\n\n"; 

	summary_text += "\tMERs donde Nasralla Gana: " + JSON.stringify(mesas_GANA_Nasralla) + "\n\n";
	summary_text += "\tMERs donde JOH Gana: " + JSON.stringify(mesas_GANA_JOH) + "\n\n";
	summary_text += "\tMERs donde JOH aventaja a Nasralla por el doble o mas: " + JSON.stringify(mesas_GANA_JOH_Doble) + "\n\n";
	summary_text += "\tMERs donde Nasralla Empata con JOH: " + JSON.stringify(mesas_Empate) + "\n\n";
	summary_text += "\tMERs donde Romeo le gana a Nasralla: " + JSON.stringify(mesas_ROMEO_Nasralla) + "\n\n";

	summary_text += "\t MERs de las cuales no se pudo extraer informacion: " + JSON.stringify(mesas_Error) + "\n\n";

	summary_text += "\n\n";

	return summary_text;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}



