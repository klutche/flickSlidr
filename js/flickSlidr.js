/************************************************************
 * flickSlidr V1.0
 * https://github.com/klutche/flickSlidr
 * Released under the MIT license
 ************************************************************/

var flickSlidr = {
	ua: "pc",
	num: 0,
	target: new Array,
	sel: new Array,
	activeBool: false,
	active: 0,
	main: 0,
	colorSet: {
		back: "#FFF",
		active: "#999",
		shadow: "#333"
	},
	speed: 200
};

flickSlidr.set = function() {
	flickSlidr.color = flickSlidr.colorSet;
	flickSlidr.main = 0;
	$(".flickSlidr").each(function() {
		if (!$(this).attr("name")) {
			var tNum = flickSlidr.num;
			var target = this;
			var tWidth = $(target).width();
			var tHeight = $(target).height();
			var tMax = $(target).find("li").length;
			$(".flickSlidr").css({
				display: "block",
				overflow: "hidden",
				clear: "both"
			});
			$(target).attr("name", tNum);
			$(target).attr("id", "flickSlidr-object" + tNum);
			flickSlidr.target[tNum] = target;
			flickSlidr.sel[tNum] = {
				width: tWidth,
				max: tMax,
				left: 0,
				current: 0,
				startX: 0,
				endX: 0,
				auto: 0
			};
			$(target).wrap('<div class="flickSlidrWrap' + tNum + '"></div>');
			var naviInner = "";
			for (var i = 0; i < tMax; i++) naviInner += '<a rel="' + i + '" name="' + tNum + '"></a>';
			$(".flickSlidrWrap" + tNum).append('<div class="flickSlidrNav">' + naviInner + "</div>");
			$(".flickSlidrWrap" + tNum + ' .flickSlidrNav a[rel="' + flickSlidr.sel[tNum].current + '"]').addClass("selected");
			$(".flickSlidrWrap" + tNum).css({
				overflow: "hidden",
				width: "100%"
			});
			$(target).css({
				width: "900000px",
				listStyle: "none",
				padding: 0,
				margin: 0,
				backgroundColor: "transparent"
			});
			$("#flickSlidr-object" + tNum + " > li").css("float", "left");
			$("#flickSlidr-object" + tNum + " > li").css({
				width: tWidth + "px",
				listStyle: "none",
				padding: 0,
				margin: 0,
			});
			$(".flickSlidrWrap" + tNum + " .flickSlidrNav").css({
				marginTop: "5px",
				clear: "both",
				lineHeight: 0,
				textAlign: "center"
			});
			$(".flickSlidrWrap" + tNum + " .flickSlidrNav a").css({
				display: "inline-block",
				width: "10px",
				height: "10px",
				margin: "5px",
				padding: 0,
				backgroundColor: flickSlidr.color.back,
				cursor: "pointer",
				borderRadius: "5px",
				webkitBorderRadius: "5px",
				mozBorderRadius: "5px",
				boxShadow: "0 1px 2px " + flickSlidr.color.shadow,
				webkitBoxShadow: "0 1px 2px " + flickSlidr.color.shadow,
				mozBoxShadow: "0 1px 2px " + flickSlidr.color.shadow
			});
			$(".flickSlidrWrap" + tNum + " .flickSlidrNav a.selected").css({
				backgroundColor: flickSlidr.color.active
			});
			if (flickSlidr.ua == "mobile") {
				$(target).bind("touchstart", function() {
					var tNum = $(this).attr("name");
					flickSlidr.active = tNum;
					flickSlidr.sel[tNum].startX = event.touches[0].pageX;
					flickSlidr.sel[tNum].startY = event.touches[0].pageY;
					flickSlidr.activeBool = true
				});
				$(window).bind("touchmove", function() {
					if (flickSlidr.activeBool) {
						var tNum = flickSlidr.active;
						flickSlidr.sel[tNum].endX = event.touches[0].pageX;
						flickSlidr.sel[tNum].endY = event.touches[0].pageY;
						var offsetX = -flickSlidr.sel[tNum].startX + flickSlidr.sel[tNum].endX;
						var offsetY = -flickSlidr.sel[tNum].startY + flickSlidr.sel[tNum].endY;
						if (offsetX / offsetY > 0.5 || offsetX / offsetY < -0.5) {
							event.preventDefault();
							$(flickSlidr.target[tNum]).css({
								marginLeft: flickSlidr.sel[tNum].left + offsetX + "px"
							})
						} else flickSlidr.activeBool = false
					}
				});
				$(window).bind("touchend", function() {
					if (flickSlidr.activeBool) {
						flickSlidr.activeBool = false;
						var tNum = flickSlidr.active;
						var offsetX = -flickSlidr.sel[tNum].startX + flickSlidr.sel[tNum].endX;
						var eventArea = flickSlidr.sel[tNum].width / 5;
						var carouselNum = flickSlidr.sel[tNum].current;
						var carouselMax = flickSlidr.sel[tNum].max;
						if (offsetX > eventArea && carouselNum > 0) carouselNum--;
						else if (offsetX < -eventArea && carouselNum < carouselMax - 1) carouselNum++;
						flickSlidr.slide(tNum, carouselNum, 200)
					}
				})
			}
			if (flickSlidr.ua == "pc") {
				$(target).bind("mousedown", function(event) {
					var tNum = $(this).attr("name");
					flickSlidr.active = tNum;
					flickSlidr.sel[tNum].startX = event.pageX;
					flickSlidr.activeBool = true;
					return false
				});
				$(window).bind("mousemove", function(event) {
					if (flickSlidr.activeBool) {
						var tNum = flickSlidr.active;
						flickSlidr.sel[tNum].endX = event.pageX;
						var offset = -flickSlidr.sel[tNum].startX + flickSlidr.sel[tNum].endX;
						$(flickSlidr.target[tNum]).css({
							marginLeft: flickSlidr.sel[tNum].left + offset + "px"
						})
					}
				});
				$(window).bind("mouseup", function(event) {
					if (flickSlidr.activeBool) {
						flickSlidr.activeBool = false;
						var tNum = flickSlidr.active;
						flickSlidr.sel[tNum].endX = event.pageX;
						var offset = -flickSlidr.sel[tNum].startX + flickSlidr.sel[tNum].endX;
						var eventArea = flickSlidr.sel[tNum].width / 5;
						var carouselNum = flickSlidr.sel[tNum].current;
						var carouselMax = flickSlidr.sel[tNum].max;
						if (offset > eventArea && carouselNum > 0) carouselNum--;
						else if (offset < -eventArea && carouselNum < carouselMax - 1) carouselNum++;
						flickSlidr.slide(tNum, carouselNum, 250)
					}
				})
			}
			$(".flickSlidrNav a").click(function() {
				var tNum = $(this).attr("name");
				var carouselNum = $(this).attr("rel");
				flickSlidr.slide(tNum, carouselNum, 800);
				return false
			});
			flickSlidr.num++
		}
	})
};
flickSlidr.ini = function() {
	var ua = navigator.userAgent;
	if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1 || ua.indexOf("iPod") > -1 || ua.indexOf("Android") > -1) flickSlidr.ua = "mobile";
	else flickSlidr.ua = "pc";
	$(window).keydown(function(e) {
		if (e.keyCode == 39) {
			var tNum = flickSlidr.main;
			var carouselNum = flickSlidr.sel[tNum].current;
			var carouselMax = flickSlidr.sel[tNum].max;
			if (carouselNum < carouselMax - 1) {
				carouselNum++;
				flickSlidr.slide(tNum, carouselNum, 800)
			}
		}
		if (e.keyCode == 37) {
			var tNum = flickSlidr.main;
			var carouselNum = flickSlidr.sel[tNum].current;
			if (carouselNum > 0) {
				carouselNum--;
				flickSlidr.slide(tNum, carouselNum, 800)
			}
		}
	});
	$(window).bind("orientationchange", function() {
		flickSlidr.resize()
	});
	$(window).resize(function() {
		flickSlidr.resize()
	})
};
flickSlidr.slide = function(activeNum, carouselNum, speed) {
	flickSlidr.activeBool = false;
	var tNum = activeNum;
	var margin = -carouselNum * flickSlidr.sel[tNum].width;
	$(flickSlidr.target[tNum]).animate({
		marginLeft: margin + "px"
	}, flickSlidr.speed, "easeCarousel", function() {});
	flickSlidr.sel[tNum].left = margin;
	flickSlidr.sel[tNum].current = carouselNum;
	$(".flickSlidrWrap" + tNum + " .flickSlidrNav a").css({
		backgroundColor: flickSlidr.color.back
	});
	$(".flickSlidrWrap" + tNum + " .flickSlidrNav a[rel='" + carouselNum + "']").css({
		backgroundColor: flickSlidr.color.active
	})
};
flickSlidr.resize = function() {
	$(".flickSlidr").each(function() {
		var target = this;
		var tNum = $(target).attr("name");
		var tWidth = $(".flickSlidrWrap" + tNum).width();
		flickSlidr.sel[tNum].width = tWidth;
		var margin = -flickSlidr.sel[tNum].current * flickSlidr.sel[tNum].width;
		flickSlidr.sel[tNum].left = margin;
		$(target).find("li").css({
			width: tWidth + "px"
		});
		$(target).css({
			marginLeft: margin + "px"
		})
	})
};
jQuery.extend(jQuery.easing, {
	easeCarousel: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b
	}
});
$(function() {
	flickSlidr.ini();
	flickSlidr.set()
});