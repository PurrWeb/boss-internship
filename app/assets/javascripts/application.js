// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery-ui
//= require react_integration
//= require foundation
//= require jquery_ujs
//= require chosen-jquery
//= require tinycolor-min
//= require pick-a-color.min
//= require paloma
//= require bootstrap-datepicker
//= require_tree ./page_controllers
//= require tablesaw.jquery
//= require tablesaw-init

$(function(){
  $(document).foundation();

  $('.chosen-select').chosen({width: '100%'});

  $('.pick-a-color').pickAColor({
    showSavedColors: false,
    showHexInput: false
  });

  $('.date-picker').datepicker({
    format: "dd-mm-yyyy",
    weekStart: 1
  });
});
