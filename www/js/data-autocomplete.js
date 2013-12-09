$(function(){
  var currencies = [];
  var db;
     db = openDatabase("justice_for_all.db3", "1.0", "Justicia para Todos", 500000);
	 document.getElementById('autocomplete').value = document.getElementById('auxiliar').value;
     if (document.getElementById('auxiliar').value.length > 0) carga_html(db,document.getElementById('auxiliar'));
  	 db.transaction(function(tx) 
				    {				
            	  	 tx.executeSql("SELECT distinct b.nombre_palabra_clave FROM palabra_clave b Order by 1", [],
                  	 function(tx, result)
					 {
					  //alert(result.rows.length);
					  contador = result.rows.length - 1; 
                   	  for(var i=0; i < result.rows.length; i++) 
					   currencies.push({value: result.rows.item(i)['nombre_palabra_clave']});
                  	 });
                 	});
  

  // setup autocomplete function pulling from currencies[] array
						$('#autocomplete').autocomplete(
						{
			             lookup: currencies,
						 onSelect: function (suggestion) 
						 {		
						  carga_html(db,suggestion);
					     }
						});												
  

});

function carga_html(db,suggestion)
{
  	 					  db.transaction(function(tx) 
									    {				
            	  	 				     tx.executeSql("SELECT a.programa, count(*) as contador FROM informacion_programa a, palabra_clave b Where a.id_programa = b.id_programa and b.nombre_palabra_clave = '"+ suggestion.value +"' Group By a.programa", [],
                  	 				     function(tx, result)
									     {
										  $('#outputcontent').html('');
										  document.getElementById('auxiliar').value = suggestion.value; 
										  document.getElementById('casa_justicia').style.display = 'none'; 
										  document.getElementById('centro_convivencia').style.display = 'none'; 						   
                   	  				      for(var i=0; i < result.rows.length; i++) 
										  {
										   if ((result.rows.length > 1) || (result.rows.item(i)['contador'] > 1))
										   {
										    if (result.rows.item(i)['programa'] == 'Casa de Justicia')
										    {
										     document.getElementById('casa_justicia').style.display = 'block'; 
											 sql = "SELECT a.programa, a.descripcion_tipo_informacion, a.entidad_encargada FROM informacion_programa a, palabra_clave b Where a.id_programa = b.id_programa and a.programa = 'Casa de Justicia' and b.nombre_palabra_clave = '"+ suggestion.value +"' Order by 1";											 
											 carga_informacion(sql,'#result1',2);
										    }
										    else
										    if (result.rows.item(i)['programa'] == 'Centro de Convivencia Ciudadana')
										    {
										     document.getElementById('centro_convivencia').style.display = 'block'; 
											 sql = "SELECT a.programa, a.descripcion_tipo_informacion, a.entidad_encargada FROM informacion_programa a, palabra_clave b Where a.id_programa = b.id_programa and a.programa = 'Centro de Convivencia Ciudadana' and b.nombre_palabra_clave = '"+ suggestion.value +"' Order by 1";											 
											 carga_informacion(sql,'#result2',2);
										    }
										 
											 
										   }
										   else	   
										   {
											sql = "SELECT a.programa, a.descripcion_tipo_informacion, a.entidad_encargada FROM informacion_programa a, palabra_clave b Where a.id_programa = b.id_programa and b.nombre_palabra_clave = '"+ suggestion.value +"' Order by 1";											 
											carga_informacion(sql,'#outputcontent',1);
//										    $('#outputcontent').html(thehtml);
										   }
										  }
                  	 				     });
                 					  });
}

function carga_informacion(sql,objeto,info)
{
   var db;
     db = openDatabase("justice_for_all.db3", "1.0", "Justicia para Todos", 500000);
  	 					  db.transaction(function(tx) 
									    {				
           	  	 tx.executeSql(sql, [],
                  	 function(tx, result2)
					 {
					   for(var j=0; j < result2.rows.length; j++) 
					   {
						if (j == 0) var html = "";
						if (info == 2)
						{
					     html += '<a href="#" onclick="mapa(\''+result2.rows.item(j)['programa']+'\')">' + result2.rows.item(j)['entidad_encargada'] + ' (Ver mapa)</a> <br> ' + result2.rows.item(j)['descripcion_tipo_informacion'];
						 //html = '<a href="mapa.html?Entidad='+result2.rows.item(j)['programa']+'" target="_self">' + result2.rows.item(j)['entidad_encargada'] + ' (Ver mapa)</a> <br> ' + result2.rows.item(j)['descripcion_tipo_informacion'];
						 if ((j-1) < result2.rows.length) html += '<br><br>';
						} 
					    else
						{
						  if (result2.rows.item(j)['programa'] == 'Casa de Justicia') icono = 'images/cj.png';
						  else icono = 'images/ccc.png';
					      //var thehtml = '<a href="#" onclick=\'abrir_opcion("mapa.html?Entidad='+suggestion.data+'");return false\'><img src="'+icono+'" height="42" width="42">&nbsp;&nbsp;' + suggestion.data + ' (Ver mapa)</a> <br> <strong>Entidad Encargada</strong> ' + suggestion.data2 + ' <br> <strong>Descripción Conflicto:</strong> ' + suggestion.data3;
						  //html = '<a href="mapa.html?Entidad='+result2.rows.item(j)['programa']+'" target="_self"><img src="'+icono+'" height="42" width="42">&nbsp;&nbsp;' + result2.rows.item(j)['programa'] + ' (Ver mapa)</a> <br><strong>' + result2.rows.item(j)['entidad_encargada'] + '</strong> <br>' + result2.rows.item(j)['descripcion_tipo_informacion'];
						  html = '<a href="#" onclick="mapa(\''+result2.rows.item(j)['programa']+'\')"><img src="'+icono+'" height="42" width="42">&nbsp;&nbsp;' + result2.rows.item(j)['programa'] + ' (Ver mapa)</a> <br><strong>' + result2.rows.item(j)['entidad_encargada'] + '</strong> <br>' + result2.rows.item(j)['descripcion_tipo_informacion'];
						  
						}
					   }
					   $(objeto).html(html);
                  	 });	
                  	 });	
}

function mapa(entidad)
{
	if (checkConnection() == 1) {
	  var db;
		db = openDatabase("justice_for_all.db3", "1.0", "Justicia para Todos", 500000);
		//alert(entidad);
		sentencia = "update parametro set valor_parametro = '"+entidad+"' where codigo_tparametro = 5";
	               db.transaction( function(tx) {
	                        tx.executeSql(sentencia, [],
	                                function(tx, result){
										if (device.platform  == 'iOS') {
											window.location = ("mapa.html"); 
										}
										else {
											 setInterval(function(){window.location = ("mapa.html");},2000);
										}
											 });
									   });
	}
	else 
		alert("No es posible ejecutar esta funcionalidad sin Conexión a Internet");
}

 function checkConnection() 
		{
		 if(navigator.connection.type == Connection.NONE){ 
		  var conexion = 0;
		  }else{
			var conexion = 1;
		  }
		 return conexion;
        }
