
//Creado por : coder4humanity

var SPEED = 500;

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
var votos_Zelaya = 0;
var votos_Aguilar = 0;
var votos_Alvarenga = 0;

var actas_Divulgacion = [];
var actas_EscrutinioEspecial = [];
var actas_Monitoreo = [];
var actas_NoRecibido = [];
var actas_Recibido = [];
var actas_Desconocido = [];
var actas_Total = 0;

var mesas_NumerosNoCuadran = [];
var mesas_ROMEO_Nasralla = [];
var mesas_GANA_JOH = [];
var mesas_GANA_JOH_Doble = [];
var mesas_GANA_Nasralla = [];
var mesas_Empate = []
var mesas_Error = [];

function extraerActas(comienzo, fin){
	for(var i = comienzo; i <= fin; i++){
		$.ajax({
			url : "https://api.tse.hn/prod/ApiActa/Consultar/1/" + i,
			async : false,
			success: function (data){
				TSE_Data[TSE_Data_Counter] = data;
				var CodActa = data.CodActa;
				var NomEstado = data.NomEstado;
				actas_Total += 1;
				if(NomEstado == "Divulgacion"){

					actas_Divulgacion.push(CodActa);
					$("#listadoDivulgacion").append("<tr><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td></tr>");
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
					votos_Zelaya += temp_Medrano;
					votos_Aguilar += temp_Aguilar;
					votos_Alvarenga += temp_Castellanos;

					for (var x = 0; x <= 8; x++) {
						totalVotosValidos += data.Votos[x].NumVotos;
					}

					if(temp_ROMEO > temp_NASRALLA){
						mesas_ROMEO_Nasralla.push(CodActa);
						$("#listadoRomeo").append("<tr id='listadoRomeo-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td><td><select><option value='Por Verificar'>Por Verificar</option><option value='Verificada'>Verificada</option></select></td></td></tr>");
					}

					if(temp_JOH > temp_NASRALLA){
						porcentaje = temp_NASRALLA/temp_JOH;
						porcentaje = round(porcentaje,2);
						if(porcentaje <= 0.5){
							mesas_GANA_JOH_Doble.push(CodActa);
							$("#listadoJOHGanaDoble").append("<tr id='listadoJOHGanaDoble-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td><td><select><option value='Por Verificar'>Por Verificar</option><option value='Verificada'>Verificada</option></select></td></td></tr>");

						}
						if((totalVotosValidos != temp_VotosValidos) || (totalVotos != temp_VotosTotal) ||
						 (temp_PapeletasUtilizadas != totalVotos) || 
						 ((temp_PapeletasRecibidas - totalVotos) != temp_PapeletasSobrantes)){
							mesas_NumerosNoCuadran.push(CodActa);
							$("#listadoNoCuadran").append("<tr id='listadoNoCuadran-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td><td><select><option value='Por Verificar'>Por Verificar</option><option value='Verificada'>Verificada</option></select></td></td></tr>");
						}
						mesas_GANA_JOH.push(CodActa);
						$("#listadoJOHGana").append("<tr id='listadoJOHGana-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td><td><select><option value='Por Verificar'>Por Verificar</option><option value='Verificada'>Verificada</option></select></td></td></tr>");
					}
					else if (temp_NASRALLA > temp_JOH){
						mesas_GANA_Nasralla.push(CodActa);
						$("#listadoNasralla").append("<tr id='listadoNasralla-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td></tr>");
					}
					else if (temp_NASRALLA == temp_JOH){
						mesas_Empate.push(CodActa);
						$("#listadoEmpate").append("<tr id='listadoEmpate-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td><td><select><option value='Por Verificar'>Por Verificar</option><option value='Verificada'>Verificada</option></select></td></td></tr>");
					}

				}
				else if(NomEstado == "Monitoreo"){
					actas_Monitoreo.push(CodActa);
					$("#listadoMonitoreo").append("<tr id='listadoMonitoreo-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td></tr>");
				}
				else if(NomEstado == "No Recibido"){
					actas_NoRecibido.push(CodActa);
					$("#listadoNoRecibido").append("<tr id='listadoNoRecibido-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td></tr>");
				}
				else if(NomEstado == "Recibido"){
					actas_Recibido.push(CodActa);
					$("#listadoRecibido").append("<tr id='listadoRecibido-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td></tr>");
				}
				else if(NomEstado == "Escrutinio Especial"){
					actas_EscrutinioEspecial.push(CodActa);
					$("#listadoEscrutinioEspecial").append("<tr id='listadoEscrutinioEspecial-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td></tr>");
				}
				else{
					actas_Desconocido.push(CodActa);
					$("#listadoDesconocido").append("<tr id='listadoDesconocido-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td></tr>");
				}

				//Update HTML
				$("#votosNasralla").html(votos_Nasralla);
				$("#votosJOH").html(votos_JOH);
				$("#votosZelaya").html(votos_Zelaya);
				$("#votosRomeo").html(votos_Romeo);
				$("#votosNarvaez").html(votos_Narvaez);
				$("#votosReyes").html(votos_Reyes);
				$("#votosPineda").html(votos_Pineda);
				$("#votosAguilar").html(votos_Aguilar);
				$("#votosAlvarenga").html(votos_Alvarenga);

				$("#estadoDivulgacion").html(actas_Divulgacion.length);
				$("#estadoMonitoreo").html(actas_Monitoreo.length);
				$("#estadoNoRecibido").html(actas_NoRecibido.length);
				$("#estadoRecibido").html(actas_Recibido.length);
				$("#estadoEscrutinioEspecial").html(actas_EscrutinioEspecial.length);
				$("#estadoDesconocido").html(actas_Desconocido.length);
				$("#estadoTotal").html(actas_Total);

				$("#actasNoCuadran").html(mesas_NumerosNoCuadran.length);
				$("#actasNasrallaGana").html(mesas_GANA_Nasralla.length);
				$("#actasJOHGana").html(mesas_GANA_JOH.length);
				$("#actasJOHGanaDoble").html(mesas_GANA_JOH_Doble.length);
				$("#actasRomeo").html(mesas_ROMEO_Nasralla.length);
				$("#actasNasrallaEmpata").html(mesas_Empate.length);
				$("#actasError").html(mesas_Error.length);

			},
		    error: function(data, status){
		    	TSE_Data[TSE_Data_Counter] = {};
		    	mesas_Error.push(i);
		    	actas_Total += 1; 
		    	$("#actasError").html(mesas_Error.length);
		    	$("#listadoError").append("<tr id='listadoError-"+CodActa+"'><td><a href='https://resultadosgenerales2017.tse.hn/Acta.html?nivel=1&mer="+CodActa+"'>"+ CodActa+"</a></td><td><select><option value='Por Verificar'>Por Verificar</option><option value='Verificada'>Verificada</option></select></td></td></tr>");
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

function downloadHTML(text, name, type) {
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
	var summaryHTML = summaryBuildUpHTML();
	downloadHTML(summaryHTML, filename+".html", "text/html");
}

function resetRepeticion(){
	if((typeof myRep) != 'undefined'){
		clearInterval(myRep);
	}
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
	votos_Zelaya = 0;
	votos_Aguilar = 0;
	votos_Alvarenga = 0;

	actas_Divulgacion = [];
	actas_Monitoreo = [];
	actas_NoRecibido = [];
	actas_Recibido = [];
	actas_EscrutinioEspecial = [];
	actas_Desconocido = [];
	actas_Total = 0;

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

	$("#votosNasralla").html(0);
	$("#votosJOH").html(0);
	$("#votosZelaya").html(0);
	$("#votosRomeo").html(0);
	$("#votosNarvaez").html(0);
	$("#votosReyes").html(0);
	$("#votosPineda").html(0);
	$("#votosAguilar").html(0);
	$("#votosAlvarenga").html(0);

	$("#estadoDivulgacion").html(0);
	$("#estadoMonitoreo").html(0);
	$("#estadoNoRecibido").html(0);
	$("#estadoRecibido").html(0);
	$("#estadoEscrutinioEspecial").html(0);
	$("#estadoDesconocido").html(0);
	$("#estadoTotal").html(0);

	$("#actasNoCuadran").html(0);
	$("#actasNasrallaGana").html(0);
	$("#actasJOHGana").html(0);
	$("#actasJOHGanaDoble").html(0);
	$("#actasRomeo").html(0);
	$("#actasNasrallaEmpata").html(0);
	$("#actasError").html(0);

	$("#listadoDivulgacion").html("");
	$("#listadoMonitoreo").html("");
	$("#listadoNoRecibido").html("");
	$("#listadoRecibido").html("");
	$("#listadoEscrutinioEspecial").html("");
	$("#listadoDesconocido").html("");

	$("#listadoNoCuadran").html("");
	$("#listadoJOHGana").html("");
	$("#listadoJOHGanaDoble").html("");
	$("#listadoRomeo").html("");
	$("#listadoError").html("");
	$("#listadoEmpate").html("");
	$("#listadoNasralla").html("");

	$("#desde").html("");
	$("#hasta").html("");

	alert("Se reseteo el sistema!");
}

function repeticion(){
	if(mesasCounter <= mesasLimit){
		$("#currentMER").html(mesasCounter);
		extraerActas(mesasCounter,mesasCounter);
		$("#hasta").html(mesasCounter);
		mesasCounter += 1
	}
	else {
		clearInterval(myRep);
		$("#currentMER").html("Completo, por favor haz click en 'Activar Descarga'. ");
		$("select").change(function(){
						if ($(this).val() == "Verificada"){
							$(this).closest("tr").css("background-color", "lightgreen");
						}
						else{
							$(this).closest("tr").css("background-color", "");
						}
		});
	}
}

function startRepeticion(){
	mesasStart = parseInt($("#startMER").val());
	mesasCounter = parseInt($("#startMER").val());
	mesasLimit = parseInt($("#endMER").val());

	if(isNumeric(mesasStart) && isNumeric(mesasLimit) && (mesasStart >= 1 && mesasStart <=18128)
		&& (mesasLimit >= 1 && mesasLimit <=18128) && (mesasStart <= mesasLimit)){
		myRep = setInterval(function(){repeticion()}, SPEED);
		$("#desde").html(mesasStart);
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
	$("select").change(function(){
						if ($(this).val() == "Verificada"){
							$(this).closest("tr").css("background-color", "lightgreen");
						}
						else{
							$(this).closest("tr").css("background-color", "");
						}
	});
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

function summaryBuildUpHTML(){
	var summary_html = "<html>"+
	"<head>"+
		"<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css' integrity='sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ' crossorigin='anonymous'>" +
		"<script src='https://code.jquery.com/jquery-3.1.1.slim.min.js' integrity='sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n' crossorigin='anonymous'></script>"+
		"<script src='https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js' integrity='sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb' crossorigin='anonymous'></script>"+
		"<script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js' integrity='sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn' crossorigin='anonymous'></script>"+
		"<script src='https://code.jquery.com/jquery-3.2.1.min.js'"+
			  "integrity='sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4='"+
			  "crossorigin='anonymous'></script>"+
		"<script type='text/javascript' src='https://cdn.jsdelivr.net/alasql/0.3/alasql.min.js'></script>"+
	"</head><body><style>table { border: 2px solid #FFFFFF; width: 100%; text-align: center; border-collapse: collapse; } table td, table th { border: 1px solid #FFFFFF; padding: 3px 4px; } table tbody td { font-size: 13px; } "+
	"table td:nth-child(even) { background: #EBEBEB; } table thead { background: #FFFFFF; border-bottom: 4px solid #333333; } table thead th { font-size: 15px; font-weight: bold; color: #333333; text-align: center; border-left:" +
		"2px solid #333333; } table thead th:first-child { border-left: none; }table tfoot { font-size: 14px; font-weight: bold; color: #333333; border-top: 4px solid #333333; } table tfoot td { font-size: 14px; }</style>";
	summary_html += $("#HTMLFILE").html();

	summary_html += "	</body></html>";

	return summary_html;
}



