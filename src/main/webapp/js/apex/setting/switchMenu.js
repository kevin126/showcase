
			function switchMenu(menuId){
				var obj = document.getElementById(menuId);
				var Div1 =  document.getElementById("Div1");
				var Div2 =  document.getElementById("Div2");
				var Div3 =  document.getElementById("Div3");
	            var Div4 =  document.getElementById("Div4");
				var Div5 =  document.getElementById("Div5");
				//重置所有菜单样式
				for(var i=0; i< 5; i++){
					document.getElementById("tbm" + (i+1)).className = 'noshow';
				}	
				Div1.style.display = (menuId == "tbm1"?"block":"none");
				Div2.style.display = (menuId == "tbm2"?"block":"none");
				Div3.style.display = (menuId == "tbm3"?"block":"none");
				Div4.style.display = (menuId == "tbm4"?"block":"none");
				Div5.style.display = (menuId == "tbm5"?"block":"none");
				obj.className = "show";
			}

