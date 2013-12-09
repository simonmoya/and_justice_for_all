function actualiza_progressbar(por_ini,por_fin)
{		
 var capa = document.getElementById('progressbar');
 capa.innerHTML = '<span style="width: 0%; color:white;"></span>';
		
 $(".meter > span").each(function() {
   $(this)
   .data("origWidth", $(this).width())
   .width(por_ini)
   .animate({
   width: por_fin
   }, 1000);
  });	

  
}

function actualiza_set_datos()
{
 var db;
 var continua = 1;
 var porc_ini = 0;
 var porc_fin = 20;
 db = openDatabase("justice_for_all.db3", "1.0", "Justicia para Todos", 500000);
 actualiza_progressbar(porc_ini+'%',porc_fin+'%');
 porc_ini = porc_fin;
 porc_fin = porc_fin + 20;
 $.Zebra_Dialog('<strong>Inicia proceso de actualización de información de click en aceptar y por favor espere un momento a que el proceso finalice...', {
    'type':     'information',
    'title':    'Actualización de Información',
    'buttons':  ['Aceptar'],
    'onClose':  function(caption) {
				$('div.navigation').block({ message: null });
				db.transaction(function(tx) {
 				 tx.executeSql("SELECT valor_parametro, convencion_parametro FROM parametro where codigo_tparametro = 4", [],
                 function(tx, result)
				 {				 
                  for(var i=0; i < result.rows.length; i++) 
	               if (continua == 1)
				   {
				    actualiza_informacion(result.rows.item(i)['convencion_parametro'],result.rows.item(i)['valor_parametro']);
				   }
				 }); 
            });
    }
});


function actualiza_informacion(tabla, url) 
{ 
 var sql_query = new Array();
 var actualizame = 0;
 var result = $.ajax({
                    url : url,
                    type : 'GET',
                    dataType : 'json',
                    error: function() 
					       { 
						    $.Zebra_Dialog('<strong>El catálogo de datos '+tabla+' no se encuentra disponible. Intente más tarde!</strong>', 
							{
							'type':     'error',
							'title':    'Actualización de Información'
							});
						   }
                });

		result.success(function(r) {
		    var id_registro = 1;
			var id_palabra = 1;
			actualizame = 1;
			//alert('Entra a actualizar '+tabla);
			actualiza_progressbar(porc_ini+'%',porc_fin+'%');
			porc_ini = porc_fin;
			porc_fin = porc_fin + 30;
			$.each(r.d, function(k, v) {
				if (tabla == 'informacion_programa') 
				{
				 sql_query.push("Insert into informacion_programa Values ("+id_registro+",'"+v.programa+"','"+v.caracterizacion_del_usuario+"','"+v.tipo_de_informacion+"','"+v.descripcion_tipo_de_informacion+"','"+v.entidad_encargada+"','"+v.tipo_de_entidad+"')");
				 palabra_clave =  v.palabras_clave.split(String.fromCharCode(59));
				 for (var j = 0; j < palabra_clave.length; j++) 
				 {
				  palabra_clave[j] = elimina_espacio(palabra_clave[j]);
				  sql_query.push("Insert into palabra_clave values ("+id_palabra+",'"+palabra_clave[j]+"',"+id_registro+")");
				  id_palabra++;
				 }				 
				} 
				else 
				{
				 sql_query.push("Insert into ubicacion_programa Values ("+id_registro+",'"+v.codigo_dane_departamento+"','"+v.departamento+"','"+v.codigo_dane_municipio+"','"+v.municipio+"','"+v.tipo+"','"+v.nombre+"','"+v.direccion+"','"+v.barrio+"','"+v.telefono_celular+"','"+v.email+"','"+v.latitud+"','"+v.longitud+"')");
				} 
				
				
				id_registro++;
			});
            actualiza_tabla(tabla);			 
		});  


    function elimina_espacio(info)
	{
			 for (var k = 0; k < info.length; k++) 
			 {
              var caracter = info.charAt(k);
             if( caracter != String.fromCharCode(32)) 
			 {
              campo = info.substring(k,info.length);
			  k = info.length;
             } 
            }
	 return campo;
	}
		
  function actualiza_tabla(tabla)
  {

   var db;
   db = openDatabase("justice_for_all.db3", "1.0", "Justicia para Todos", 500000);
   if (db) 
   {
        db.transaction( function(tx) {
			var contador = sql_query.length - 1;
			for(var j=0; j < sql_query.length; j++)
			{
			 if (j == 0) 
			 {
			  tx.executeSql("Delete from "+tabla);
			  if (tabla == 'informacion_programa') tx.executeSql("Delete from palabra_clave");
			 } 
			 tx.executeSql(sql_query[j], [],
                 function(tx, result, j, contador){
			     if ((j == contador) && (tabla == 'ubicacion_programa'))
					 {						 
					  actualiza_progressbar('70%','100%');
					  $('div.navigation').unblock();
					  document.getElementById("actualiza").value="0";
/*					  if (device.platform  == 'iOS') tiempo = 15000;
					  else tiempo = 5000;

					  setTimeout(function(){window.location.reload();},tiempo);		*/			  				  
	  				 }
		
			    });

			}


        });			
   }		
  }   		
 }	
}