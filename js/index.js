$(function(){
	var canvasS=530;
	var row=15;
	var blockS=canvasS/row;
	// console.log($('#canvas').get(0))
	var ctx=$('#canvas').get(0).getContext('2d'); //.getContext 方法用来获取渲染上下文和绘画功能.
	var starRadius=3;
	$('#canvas').get(0).height=canvasS;
	$('#canvas').get(0).width=canvasS;
	var draw=function(){
		var off=blockS/2+0.5;
		var lineWidth=canvasS-blockS;
		ctx.save();
		ctx.beginPath();
		ctx.translate(off,off);
		for(var i=0;i<row;i++){
			ctx.moveTo(0,0);
			ctx.lineTo(lineWidth,0);
			ctx.translate(0,blockS);
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.translate(off,off);
		for(var i=0;i<row;i++){
			ctx.moveTo(0,0);
			ctx.lineTo(0,lineWidth);
			ctx.translate(blockS,0);
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();


		var points=[ 3.5 * blockS + 0.5 , 11.5 * blockS + 0.5 ];
		for(var i=0;i<2;i++){
			for(var j=0;j<2;j++){
				var x=points[i];
				var y=points[j];
				ctx.save();
				ctx.beginPath();
				ctx.translate(x,y);
				ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
		}

		ctx.save();
		ctx.beginPath();
		ctx.translate(7.5*blockS+0.5,7.5*blockS+0.5);
		ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
		ctx.fill();
		ctx.closePath();
		ctx.restore();

	}
	draw();


	var qiziRadius=blockS/2*0.8;
	var drop=function(qizi){
		ctx.save();
		ctx.translate((qizi.x+0.5)*blockS,(qizi.y+0.5)*blockS);
		ctx.beginPath();
		ctx.arc(0,0,qiziRadius,0,Math.PI/180*360);
		if(qizi.color===1){
			// var rd=ctx.createRadialGradient(0,-2,4,0,0,15);
			// rd.addColorStop(0.1,'#f5f5f5');
			// rd.addColorStop(0.4,'#999');
			// rd.addColorStop(1,'black');
			// ctx.fillStyle=rd;
			ctx.fill();
			$('#black_play').get(0).play();

		}else{
			ctx.fillStyle='#fff';
			ctx.strokeStyle='black';
			ctx.fill();
			ctx.stroke();
			$('#white_play').get(0).play();
		}
	
		ctx.closePath();
		ctx.restore();
	}

	//落子
	// var flag=true;
	// var step=0;
	// var all={};
	// $('canvas').on('click',function(e){
	// 	var x=Math.floor(e.offsetX/blockS);
	// 	var y=Math.floor(e.offsetY/blockS);
	// 	if(all[x+'-'+y]){
	// 		return;
	// 	}
	// 	if(flag){
	// 		var qizi={x:x,y:y,color:1,step:step++};
	// 		drop(qizi);
	// 		flag=false;
	// 	}else{
	// 		var qizi={x:x,y:y,color:0,step:step++};
	// 		drop(qizi);
	// 		flag=true;
	// 	}
	// 	all[x+'-'+y]=qizi;
	// })











	//判断输赢
	var flag=true;
	all={};
	var step=1;
	function judge(qizi){
		var shuju={};
		$.each(all,function(k,v){
			if(v.color===qizi.color){
				shuju[k]=v;
			}
		})
		var shu=1,hang=1,zuoxie=1,youxie=1;
		var tx,ty;
		//判断竖方向
		tx=qizi.x;
		ty=qizi.y;
		while(shuju[tx+'-'+(ty+1)]){
			shu++;
			ty++;
		}
		tx=qizi.x;
		ty=qizi.y;
		while(shuju[tx+'-'+(ty-1)]){
			shu++;
			ty--;
		}
		//判断行方向
		tx=qizi.x;
		ty=qizi.y;
		while(shuju[(tx+1)+'-'+ty]){
			hang++;
			tx++;
		}
		tx=qizi.x;
		ty=qizi.y;
		while(shuju[(tx-1)+'-'+ty]){
			hang++;
			tx--;
		}
		//判断左斜方向
		tx=qizi.x;
		ty=qizi.y;
		while(shuju[(tx-1)+'-'+(ty-1)]){
			zuoxie++;
			tx--;
			ty--;
		}
		tx=qizi.x;
		ty=qizi.y;
		while(shuju[(tx+1)+'-'+(ty+1)]){
			zuoxie++;
			tx++;
			ty++;
		}
			//判断右斜方向
		tx=qizi.x;
		ty=qizi.y;
		while(shuju[(tx+1)+'-'+(ty-1)]){
			zuoxie++;
			tx++;
			ty--;
		}
		tx=qizi.x;
		ty=qizi.y;
		while(shuju[(tx-1)+'-'+(ty+1)]){
			zuoxie++;
			tx--;
			ty++;
		}
		if(shu>=5 || hang>=5 || zuoxie>=5 || youxie>=5){
			return true;
		}
	}

	$('#canvas').on('click',function(e){
		var x=Math.floor(e.offsetX/blockS);
		var y=Math.floor(e.offsetY/blockS);
		if(all[x+'-'+y]){
			return;
		}
		var qizi;
		if(flag){
			qizi={x:x,y:y,color:1,step:step};
			drop(qizi);
			if(judge(qizi)){
				$('.cartel').show().find('.mag').text('黑棋赢了！');
			}
		}else{
			qizi={x:x,y:y,color:0,step:step};
			drop(qizi);
			if(judge(qizi)){
				 $('.cartel').show().find('.mag').text('白棋赢了！');
				// return;
			}
		}
		step+=1;
		flag=!flag;
		all[x+'-'+y]=qizi;
	})

	$('#restart').on('click',function(){
		$('.cartel').hide();
		ctx.clearRect(0,0,600,600);
		draw();
		flag=true;
		all={};
		step=1;
	})

	$('#qp').on('click',function(){
		$('.cartel').hide();
		$('#save').show();
		ctx.save();
		ctx.font="20px '微软雅黑' ";
		for(var i in all){
			if(all[i].color===1){
				ctx.fillStyle="#fff";
			}else{
				ctx.fillStyle="black";
			}
			ctx.textAlign="center";
			ctx.textBaseline="middle";

			ctx.fillText(all[i].step,
				(all[i].x+0.5)*blockS,
				(all[i].y+0.5)*blockS);
		}
		ctx.restore();
		var image=$('#canvas').get(0).toDataURL('image/jpg',1);
		$('#save').attr('href',image);
		$('#save').attr('download','qp.png');
	})


	$('.tips').on('click',false);
	$('.close').on('click',function(){
    $('.cartel').hide();
    $('#restart').click();//点击关闭重新开始
  })
	$('.cartel').on('click',function(){
    $(this).hide();
  })
})