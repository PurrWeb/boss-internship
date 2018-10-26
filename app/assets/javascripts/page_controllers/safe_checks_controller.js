var SafeChecksController = Paloma.controller('SafeChecks');

var setupRealtimeTotalCalculations = function(){
  var watchFields = $('.js-total-calculation-watch-field');
  watchFields.on('input', calculateRealtimeTotals);
}

var parseCentsFromPlaceHolderField = function(field){
  normalisedValue = field.
    innerText.
    replace('£', '').
    replace(',', '');

  return Math.floor(
    parseFloat( normalisedValue ) * 100
  );
}

var calculateRealtimeTotals = function(){
  var valueFields = $('.js-total-calculation-value-field');
  var floatFields = $('.js-total-calculation-float-value');
  var outToOrderField = $('.js-total-calculation-out-to-order-value')[0];
  var ashCash = $('.js-total-calulation-ash-cash-value')[0].value;
  var securityPlus = $('.js-total-calculation-security-plus-value')[0].value;
  var checkBox = document.getElementById("safe_check_received_change");
  var receivedChangeBlock = document.getElementById("received-change-block");
  var stillOutToOrder = document.getElementById("js-still-out-to-order-calculation-float-value");
  var alertClass = "boss-form__text-alert";

  var totalCents = 0;
  valueFields.each(function(index, field){
    fieldValueCents = Math.floor(parseFloat(field.value) * 100)
    totalCents = totalCents + fieldValueCents;
  });

  var totalFloatValueCents = 0
  floatFields.each(function(index, field){
    totalFloatValueCents = totalFloatValueCents +
      parseCentsFromPlaceHolderField(field);
  });

  var safeFloatField = $('.js-safe-float-field')[0];
  var safeFloatCents = parseCentsFromPlaceHolderField(safeFloatField);

  var outToOrderCents = Math.floor(parseFloat(outToOrderField.value) * 100);
  var ashCashCents = Math.floor(parseFloat(ashCash) * 100);
  var securityPlusCents = Math.floor(parseFloat(securityPlus) * 100);

  if (outToOrderCents > 0) {
    receivedChangeBlock.style.display = "block";
  } else {
    receivedChangeBlock.style.display = "none";
  }

  if (checkBox.checked) {
    var stillOutToOrderCents = outToOrderCents - (ashCashCents + securityPlusCents);

    if (outToOrderCents < 0) {
      $(stillOutToOrder).addClass(alertClass);
    } else {
      $(stillOutToOrder).removeClass(alertClass);
    }
    stillOutToOrder.innerText = "£" + stillOutToOrderCents / 100;
  }

  totalCents = totalCents + outToOrderCents;
  var varianceCents = totalCents - safeFloatCents;

  updateRealtimeTotalField(totalCents);
  updateRealtimeTotalFloatField(totalFloatValueCents);
  updateRealtimeVarienceField(varianceCents);
}

var isInt = function(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}

var numberWithCommas = function(number) {
  var parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

var poundValueString = function(cents){
  poundValue = cents / 100.0;

  var result = "";
  if( isInt(poundValue) ){
    result = parseInt(poundValue).toString();
  } else {
    result = poundValue.toString().match(/^-?\d+(?:\.\d{0,2})?/);
  }

  return numberWithCommas(result);
}

var updatePlaceHolderValue = function(selector, centValue, colorValue){
  resultPlaceholder = $(selector);

  if( isNaN(centValue) ){
    resultPlaceholder.html("-");
  } else {
    var htmlFragments = [];
    var negative = (centValue < 0);
    var positive = (centValue > 0)

    if( colorValue && negative ){
      htmlFragments.push("<span class=\"boss-form__text-primary boss-form__text-extra-large boss-form__text-alert\">");
    } else if (colorValue && positive) {
      htmlFragments.push("<span class=\"boss-form__text-primary boss-form__text-extra-large boss-form__text-success\">")
    } else if ( colorValue ) {
      htmlFragments.push("<span class=\"boss-form__text-primary boss-form__text-extra-large\">")
    }

    htmlFragments.push("£" + poundValueString(centValue));

    if (colorValue) {
      htmlFragments.push("</span>");
    }

    resultPlaceholder.html(htmlFragments.join(""));
  }
}

var updateRealtimeTotalField = function(totalCents){
  updatePlaceHolderValue('.js-total-calculation-total-result', totalCents, false);
};

var updateRealtimeVarienceField = function(varianceCents){
  updatePlaceHolderValue('.js-total-calculation-variance-result', varianceCents, true);
};

var updateRealtimeTotalFloatField = function(floatValueCents){
  updatePlaceHolderValue('.js-total-calculation-float-total', floatValueCents, false);
};

SafeChecksController.prototype.index = function(){
  $('#safe-checks-current-venue-select').change(function(){
    $('#safe-checks-venue-form').submit();
  });
}

SafeChecksController.prototype.new = function(){
  setupRealtimeTotalCalculations();
  $(function(){
    calculateRealtimeTotals();
  });
}

SafeChecksController.prototype.create = function(){
  setupRealtimeTotalCalculations();
  $(function(){
    calculateRealtimeTotals();
  });
}
