window.onload=function(){
	var wins=[];//三维数组，表示所有的赢法
	var myWin=[];//一维数组，玩家的赢法统计数组
	var computerWin=[];//一维数组，计算机的赢法统计数组
	var over=false;//表示游戏是否结束
	//初始化赢法数组的前二维，表示棋盘
	for (var i = 0; i < 15; i++) {
		wins[i]=[];
		for (var j = 0; j < 15; j++) {
			wins[i][j]=[];
		}
	}
	var count=0;//赢法种类的索引，初始化位0，表示第count种赢法
	//所有横线的赢法
	//i表示行,j表示列(五个棋子的第一个所在的列),k表示五个棋子的第几个棋子
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[i][j+k][count]=true;
			}
			count++;
		}
	}
	//所有竖线的赢法
	//i表示列,j表示行(五个棋子的第一个所在的行),k表示五个棋子的第几个棋子
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[j+k][i][count]=true;
			}
			count++;
		}
	}
	//所有斜线的赢法
	//从左上角到右下角，五个棋子的起点只能是0-10,k表示五个棋子的第几个棋子
	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[i+k][j+k][count]=true;
			}
			count++;
		}
	}
	//所有反斜线的赢法
	//从左下角到右上角，i表示列,从0-10,j表示行,从14-4,k表示五个棋子的第几个棋子
	for (var i = 0; i < 11; i++) {
		for (var j = 14; j > 3; j--) {
			for (var k = 0; k < 5; k++) {
				wins[i+k][j-k][count]=true;
			}
			count++;
		}
	}
	//初始化赢法统计数组
	for (var i = 0; i < count; i++) {
		myWin[i]=0;
		computerWin[i]=0;
	}
	var me=true;//初始化为黑子
	var chess=document.getElementById("chess");
	var context=chess.getContext("2d");//获得上下文
	context.strokeStyle="#bfbfbf";//设置线的样式
	var chessBoard=[];//二维数组，存储棋盘上交叉点的落子情况
	//初始化数组
	for (var i = 0; i < 15; i++) {
		chessBoard[i]=[];
		for (var j = 0; j < 15; j++) {
			chessBoard[i][j]=0;//0表示没有落子
		}
	}
	//背景
	var logo=new Image();
	logo.src="images/logo.jpg";
	logo.onload=function(){
		context.drawImage(logo,0,0,450,450);
		drawChessBoard();
	}
	//画棋盘：canvas绘制直线，设置画笔颜色
	var drawChessBoard=function(){
		for (var i = 0; i < 15; i++) {
			//竖线
			context.moveTo(15+i*30, 15);//线的起点
			context.lineTo(15+i*30,435);//线的终点
			context.stroke();//划线
			//横线
			context.moveTo(15, 15+i*30);//线的起点
			context.lineTo(435,15+i*30);//线的终点
			context.stroke();//划线，描边
		}
	};
	//画棋子：canvas画圆，填充渐变色
	var oneStep=function(i,j,me){
		//ij表示坐标，me表示黑棋还是白棋
		context.beginPath();
		context.arc(15+i*30,15+j*30,13,0,2*Math.PI);//画圆
		context.closePath();
		//创建渐变对象,两个圆
		var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
		if (me) {//黑棋
			gradient.addColorStop(0,"#0a0a0a");//起始色，0对应第一个圆
			gradient.addColorStop(1,"#636766");//终点色，1对应第二个圆
		}else{//白棋
			gradient.addColorStop(0,"#d1d1d1");//起始色，0对应第一个圆
			gradient.addColorStop(1,"#f9f9f9");//终点色，1对应第二个圆
		}	
		context.fillStyle=gradient;//填充样式
		context.fill();//填充
	};
	//实现落子
	chess.onclick=function(e){
		if (over) {//判断游戏是否结束
			return;
		}
		if (!me) {//判断是否是玩家下棋
			return;
		}
		var x=e.offsetX;//相对于棋盘左上角的水平距离
		var y=e.offsetY;//相对于棋盘左上角的垂直距离
		var i=Math.floor(x/30);//判断所在交叉点索引
		var j=Math.floor(y/30);//判断所在交叉点索引
		if (chessBoard[i][j]==0) {
			oneStep(i,j,me);
			chessBoard[i][j]=1;//落子是黑棋		
			//chessBoard[i][j]=2;//落子是白棋		
			//对赢法的统计数组进行更新
			for (var k = 0; k < count; k++) {
				if (wins[i][j][k]) {
					myWin[k]++;//如果在ij位置第k种赢法为true,玩家赢法+1
					computerWin[k]=6;//电脑赢法设置为异常值，表示此种赢法不能赢，不再统计
					if (myWin[k]==5) {
						window.alert("你赢了！");//如果第k种赢法的5个子已经出现，表示玩家赢了
						over=true;//游戏结束
					}
				}
			}		
			if (!over) {//如果还没有结束
				me=!me;//实现轮流下子
				computerAI();
			}
		}
	};
	//计算得分
	var computerAI=function(){
		var myScore=[];
		var computerScore=[];
		var max=0;//记录最高分数
		var u=0,v=0;//表示最高分数点的坐标
		for (var i = 0; i < 15; i++) {
			myScore[i]=[];
			computerScore[i]=[];
			//初始化得分数组
			for (var j = 0; j < 15; j++) {
				myScore[i][j]=0;
				computerScore[i][j]=0;
			}
		}
		//遍历棋盘
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				if (chessBoard[i][j]==0) {//该点为空时统计得分
					for (var k = 0; k < count; k++) {
						if (wins[i][j][k]) {//如果该点第k种赢法为true
							switch(myWin[k]) {//玩家得分
								case 1:
									myScore[i][j]+=200;
									break;
								case 2:
									myScore[i][j]+=400;
									break;
								case 3:
									myScore[i][j]+=2000;
									break;
								case 4:
									myScore[i][j]+=10000;
									break;
							}
							switch(computerWin[k]) {//电脑得分
								case 1:
									computerScore[i][j]+=300;
									break;
								case 2:
									computerScore[i][j]+=500;
									break;
								case 3:
									computerScore[i][j]+=5000;
									break;
								case 4:
									computerScore[i][j]+=20000;
									break;
							}
						}
					}
					if (myScore[i][j]>max) {
						max=myScore[i][j];
						u=i;
						v=j;
					}else if (myScore[i][j]==max) {
						if (computerScore[i][j]>computerScore[u][v]) {
							u=i;
							v=j;
						}
					}
					if (computerScore[i][j]>max) {
						max=myScore[i][j];
						u=i;
						v=j;
					}else if (computerScore[i][j]==max) {
						if (myScore[i][j]>myScore[u][v]) {
							u=i;
							v=j;
						}
					}
				}
			}
		}
		oneStep(u,v,false);
		chessBoard[u][v]=2;//表示计算机落子
		//更新赢法统计数组
		for (var k = 0; k < count; k++) {
			if (wins[u][v][k]) {
				computerWin[k]++;//如果在ij位置第k种赢法为true,电脑赢法+1
				myWin[k]=6;//玩家赢法设置为异常值，表示此种赢法不能赢，不再统计
				if (computerWin[k]==5) {
					window.alert("电脑赢了！");//如果第k种赢法的5个子已经出现，表示电脑赢了
					over=true;//游戏结束
				}
			}
		}
		if (!over) {//如果还没有结束
			me=!me;//实现轮流下子
		}
	};
};