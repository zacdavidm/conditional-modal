/* Private Functions */
function popup_modal_storage_support(){
    try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
function popup_modal_store_time(){
  if(popup_modal_storage_support()){
    nowTime=popup_modal_date_time();
    localStorage.setItem("popup-modal-lastTime", nowTime);
  }
}
function popup_modal_date_time(){
  date=new Date();
  return date.getTime();
}
/* /Private Functions*/

/* Public Functions (API) */
function popup_modal_last_shown(){//return last shown. in hours
  if(!popup_modal_storage_support()){
    return false;//failed
  }
  lastTime=localStorage.getItem("popup-modal-lastTime");
  nowTime=popup_modal_date_time();
  return (nowTime-lastTime)/3600000;//convert msec to hr
}
function popup_modal_opted_out(){
  optOut=localStorage.getItem("popup-modal-optOut");
  if(optOut=='true'){
    return true;
  }
  return false;
}
function popup_modal_open(){
  $(".popup-modal-mask").fadeIn(600);
  popup_modal_store_time();
}
function popup_modal_close(){
  $(".popup-modal-mask").fadeOut(600);
}
function popup_modal_perform_opt_out(){//set local storage opt out
  if(!popup_modal_storage_support()){
    return false;//action failed
  }
  localStorage.setItem("popup-modal-optOut", 'true');
  return true;//action success
}
function popup_modal_distance_bottom(){//scroll distance from bottom. in px. requires jquery
  return $(document).height()-($(window).scrollTop() + $(window).height()); 
}
/* /Public Functions (API) */

//Popup_Modal Execution

var timeout=($('.popup-modal').data('popup-modal-timeout')!="" ? $('.popup-modal').data('popup-modal-timeout') : 0);//time lapse needed between modals. in hours
var bottomTrigger=($('.popup-modal').data('popup-modal-bottom-trigger')!="" ? $('.popup-modal').data('popup-modal-bottom-trigger') : 100);//distance from bottom to trigger modal. in px

var lastShown=popup_modal_last_shown();
var optOut=popup_modal_opted_out();

if((lastShown>timeout || lastShown==false) && !optOut){
  $(window).on('scroll.popup-modal-open', function(){
    if(bottomTrigger>popup_modal_distance_bottom()) {
      popup_modal_open();
      $(window).off('scroll.popup-modal-open');
    }
  });
  $('.popup-modal-close').on('click.popup-modal-close',function(){
    popup_modal_close();
    $('.popup-modal-close').off('click.popup-modal-close');
  });
  $('.popup-modal-opt-out').on('click.popup-modal-opt-out',function(){
    popup_modal_perform_opt_out();
    $('.popup-modal-opt-out').off('click.popup-modal-opt-out');
    popup_modal_close();
    $('.popup-modal-close').off('click.popup-modal-close');
  });
}

