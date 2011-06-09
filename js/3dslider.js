/*
 * jQuery 3DSlider v1.0
 *
 * Copyright 2011, Oleksiy Yevdakov
 * http://www.clear-web-solutions.com
 *
 * Licensed under the GNU LGPL (http://www.gnu.org/licenses/).
*/

(function($){
	$.fn.dddSlider = function(params){

		//parameters adjustable on initialization
		var autoplay = true;
		var slideWidth = 500;
		var whr = 5/3;//by default the slide width/height ratio is 5x3 if needed could be changed
		var speed  = 800;
		var speedBtwnSlides = 4500;
		var playLbl = "Play";
		var pauseLbl = "Pause";
		var incP = 60;//percentage increase for the first slide width once it fades out

		//private params
		var slideHeight = 300;
		var element = this;
		var slides = $(".slide");
		var currentSlide = 0;
		var zindex=10000;
		var animating = false;
		var t;
		var tempTimer;

		//read params
		if(params){
			if(params.whr!==undefined&&params.whr!==null) whr = params.whr;
			if(params.autoplay!==undefined&&params.autoplay!==null) autoplay = params.autoplay;
			if(params.slideWidth!==undefined&&params.slideWidth!==null){ slideWidth = params.slideWidth; slideHeight=slideWidth/whr;}
			if(params.speed!==undefined&&params.speed!==null) speed = params.speed;
			if(params.speedBtwnSlides!==undefined&&params.speedBtwnSlides!==null) speedBtwnSlides = params.speedBtwnSlides;
			if(params.playLbl!==undefined&&params.playLbl!==null)playLbl = params.playLbl;
			if(params.pauseLbl!==undefined&&params.pauseLbl!==null)pauseLbl = params.pauseLbl;
			if(params.incP!==undefined&&params.incP!==null)incP = params.incP;
		}

		//you can adjust the strechness of the slider here
		var left1 = parseInt(slideWidth*0.6);
		var top1 = parseInt(slideHeight*0.2);
		var width1 = parseInt(slideWidth*0.6);
		var left2 = parseInt(slideWidth*0.96);
		var top2 = parseInt(slideHeight*0.3);
		var width2 = parseInt(slideWidth*0.4);
		var left3 = parseInt(slideWidth*1.25);
		var top3 = parseInt(slideHeight*0.4);
		var width3 = parseInt(slideWidth*0.2);
		var left4 = parseInt(slideWidth*1.48);
		var top4 = parseInt(slideHeight*0.5);

		//initial slides positioning
		initialize();
		
		//initialize function that creates all the controls and places the initial slides where they have to be placed, adding actions to buttons
		function initialize(){
			//set the appropriate zIndex to each slide
			slides.each(function(){
				zindex--;
				$(this).css({
					"zIndex": zindex
				});
				//hide the ones we don't need to display
				if(zindex<9996){
					$(this).hide();
				}
			});
			
			//display first 4 in the exact positions they should be displayed
			$(slides[0]).css({
				left:'0px',
				top:'0px',
				width:slideWidth
			});
			$(slides[1]).css({
				left:left1,
				top:top1,
				width:width1
			});
			$(slides[2]).css({
				left:left2,
				top:top2,
				width:width2
			});
			$(slides[3]).css({
				left:left3,
				top:top3,
				width:width3
			});
			
			//create 3 divs to hover the slides, onclick would initiate the moving to particular slide and stopping the animation
			$(element).append('<div class="control" id="firstControl">&nbsp;</div>');
			$("#firstControl").css({
				left:slideWidth,
				top:top1,
				width: slideWidth*0.2,
				height: slideHeight*0.6
			});
			$(element).append('<div class="control" id="secondControl">&nbsp;</div>');
			$("#secondControl").css({
				left:slideWidth*1.2,
				top:top2,
				width: slideWidth*0.16,
				height:slideHeight*0.4
			});
			$(element).append('<div class="control" id="thirdControl"></div>');
			$("#thirdControl").css({
				left:slideWidth*1.36,
				top:top3,
				width: slideWidth*0.09,
				height:slideHeight*0.2
			});
			
			$(".control").bind("click",function(){
				if(autoplay){
					clearTimeout(t);
					clearTimeout(tempTimer);
					autoplay=false;
					$(".pp").attr("id","play");
					$(".pp").html(playLbl);
				}
				switch($(this).attr('id')){
					case 'firstControl':
						animateSlides();
						break;
					case 'secondControl': 
						animateSlides();
						animateSlides();
						break;
					case 'thirdControl':
						animateSlides();
						animateSlides();
						animateSlides();
						animateSlides();
						break;
				}
			});
			
			//creating the play/pause button and it's functionality
			if(autoplay){
				$(element).append('<div id="pause" class="pp">Pause</div>');
			}else{
				$(element).append('<div id="play" class="pp">Play</div>');
			}
			$(".pp").bind("click",function(){
				if($(this).attr('id')=='pause'){
					autoplay = false;
					$(this).attr("id","play");
					$(".pp").html(playLbl);
					clearTimeout(t);
					clearTimeout(tempTimer);
				}else{
					autoplay = true;
					$(this).attr("id","pause");
					$(".pp").html(pauseLbl);
					animateSlides();
				}
			});
			
			//playing the slides
			if(autoplay){ animateSlides(); }
			
		};//end of initialize()

		function animateSlides(){
			var slide0W = parseInt(slideWidth*(100+incP)/100);
			var slide0T = parseInt((slideHeight*(100+incP)/100-slideHeight)/2);
			var slide1  = currentSlide;
			var slide2 = currentSlide+1==slides.length?0:currentSlide+1;
			var slide3 = slide2+1==slides.length?0:slide2+1;
			var slide4 = slide3+1==slides.length?0:slide3+1;
			var slide5 = slide4+1==slides.length?0:slide4+1;
			if(!animating){
				clearTimeout(tempTimer);
				animating = true;
				zindex--;
				//position the last(new) slide where it should be
				$(slides[slide5]).css({
					left:left4,
					top:top4,
					width:"0px",
					zIndex: zindex
				});
				$(slides[slide5]).show();
				$(slides[slide1]).animate({
					width: slide0W,
					left: -slideWidth,
					top:-slide0T,
					opacity: "0"
				},speed,function(){
					$(this).css({width:"0px"});
					animating = false;
				});
				$(slides[slide2]).animate({
					width: slideWidth,
					left: "0",
					top:"0"
				},speed);
				$(slides[slide3]).animate({
					width: width1,
					left: left1,
					top:top1
				},speed);
				$(slides[slide4]).animate({
					width: width2,
					left: left2,
					top: top2
				},speed);
				$(slides[slide5]).animate({
					opacity:"1"
				},0);
				$(slides[slide5]).animate({
					width:width3,
					left:left3,
					top:top3
				},speed);
				currentSlide = slide2;
				if(autoplay){ t = setTimeout(animateSlides,speedBtwnSlides);}
			}else{
				tempTimer = setTimeout(animateSlides,speed);
			}
		};//end animateslides()

	};//end dddSlider
})(jQuery);