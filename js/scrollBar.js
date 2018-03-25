(function(win,doc){                  
  var defaults={
    dir:'y'
  }
  function CusSlider(options){
        var self=this;
        var wrap=document.querySelector(options.container);
        this.cont=wrap.querySelector('.s-content');
        this.scrollBar=wrap.querySelector('.s-bar');
        this.slider=wrap.querySelector('.s-slider');
        //深拷贝参数
        self = Object.assign(self,defaults,options);
        //自定义滚动距离
        this.scrollStep=100;
        this.dirFlag= options.dir == 'y';   
                             
        //内容高度
        var ele_model= this.dirFlag ? this.cont.offsetHeight : this.cont.offsetWidth;   //width
        //文档高度
        var cont_model= this.dirFlag ? this.cont.scrollHeight : this.cont.scrollWidth;   //width
        //高度比率=内容高度/文档高度=滚动条滑块高度/滚动条高度
        var ratio=ele_model/cont_model;
        //由此滚动条高度
        var bar_model=ele_model;
        //滚动条滑块高度
        this.slider_model=ratio*bar_model;
        //滚动条可滚动距离
        this.maxSliderPos= bar_model-this.slider_model;
        //内容可滚动距离
        this.maxScrollPos=cont_model-ele_model;
        //滚动比率=滚动条可滚动距离/内容可滚动距离
        this.scrollRatio=this.maxSliderPos/this.maxScrollPos;
        if(ele_model == cont_model){
          this.scrollBar.style.display='none';
        }
        if(!(this.cont && this.scrollBar && this.slider)){
          return false;
        }
       
        self.init();

  }
  CusSlider.prototype={
      init:function(){
          //设置滑块高度
          this.setSlider();
          //注册滚轮事件
          this.wheel();
          //注册鼠标拖拽事件
          this.drag();
          //监听文档滚动，设置滑块top值
          this.scroll();  
      },      
      setSlider:function(){
        if(this.dirFlag){
           this.slider.style.height= this.slider_model+'px';     //width
        }else{
           this.slider.style.width= this.slider_model+'px';
        }
      },
      wheel:function(){
        var wheelRang;
        var self=this,cont=this.cont;
        //检测浏览器，火狐浏览器是DOMMouserScroll,其他浏览器是onwheel,将来可能会统一为onmouserwheel
        var isMacWebkit=(navigator.userAgent.indexOf('Macintosh') !== -1 && navigator.userAgent.indexOf('Webkit') !== -1);
        //火狐浏览器
        var ifFirefox=(navigator.userAgent.indexOf('Gecko') !== -1);

        //注册wheel事件
        cont.onwheel=wheelHander;
        cont.onmousewheel=wheelHander;
        if(ifFirefox){
          cont.addEventListener && cont.addEventListener('DOMMouseScroll',wheelHander,false);
        }
        function wheelHander(ev){
          var ev=ev || window.event;
          if(ev.wheelDelta){//其他浏览器
            wheelRang= -ev.wheelDelta/120;
          }else if(ev.detail){//火狐浏览器
            wheelRang = ev.detail/3;
          }
          //设置滚动距离
          // if(this.dirFlag){
          //     $(cont).scrollTop(cont.scrollTop + wheelRang*self.scrollStep);     //width
          // }else{
          //     $(cont).scrollLeft();
          // }
          var scrollPos= self.dirFlag ? cont.scrollTop : cont.scrollLeft;
          self.scrollTo(cont,scrollPos + wheelRang*self.scrollStep);
          
        }
      },
      drag:function(){
          var flag=false,off,pos;
          var self=this,cont=this.cont,slider=this.slider;
          slider.addEventListener && slider.addEventListener('mousedown',downHander,false);
          function moveHandler(ev){
            //可以禁止鼠标移动过程中文字被选中
            ev.preventDefault();
            //检测到鼠标按下且移动
            var movePos= self.dirFlag ? ev.clientY : ev.clientX;
            if(flag && (movePos != pos)){    //width
              //滚动距离=（鼠标移动中的坐标-按下时的坐标）* 滚动比率 + 滑块的偏移量
              self.scrollTo(cont,(movePos - pos  + off));
              //$(cont).scrollTop();     //width
            }
          }
          function downHander(ev){
            //设立标识，只有在按下时才会执行move事件处理程序
            flag=true;
            var ev= ev || window.event;
            ev.preventDefault();
            //滑块距离父元素的偏移量
            off = self.dirFlag ? cont.scrollTop : cont.scrollLeft;        //width
            pos = self.dirFlag ? ev.clientY : ev.clientX;            //width
            document.addEventListener('mousemove',moveHandler,false);
          }
          document.addEventListener('mouseup',function(ev){
            document.removeEventListener('mousemove',moveHandler);
            document.removeEventListener('mouseup',moveHandler);
            //鼠标松开时重置标识
            flag=false;
          })
          
        },
        scrollTo:function(obj,value){
            return this.dirFlag ? $(obj).scrollTop(value) : $(obj).scrollLeft(value);
        },
        scroll:function(){
          var self=this,cont=this.cont,slider=this.slider;
          cont.onscroll=function(){
            if(self.dirFlag){
              var getSliderPos=Math.min(self.maxSliderPos,this.scrollTop*self.scrollRatio);
              slider.style.top=getSliderPos+'px';       //width
            }else{
              var getSliderPos=Math.min(self.maxSliderPos,this.scrollLeft*self.scrollRatio);
              slider.style.left=getSliderPos+'px';
            }
          }
        }
        
    }
    win.CusSlider=CusSlider;

})(window,document)