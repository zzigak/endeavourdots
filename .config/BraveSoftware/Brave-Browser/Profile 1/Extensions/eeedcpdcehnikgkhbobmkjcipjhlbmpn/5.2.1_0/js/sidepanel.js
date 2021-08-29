
function openNav()
{
  $('#main').data('sidePanelOpened', true);
  var newWidth = $(window).width()*0.50 - 40;
  document.getElementById("theSidePanel").style.left = "0";
  document.getElementById("main").style.marginLeft = "50vw";

  $('.timerContainer').animate({
    'left':'75%'
  },400);

  $('#timerTitle').animate({
    'left':'75vw'
  },400);

  if( localStorage.largeFont == "YES" ) {
    $('#timerTitle').css('font-size','3.5vw');
    $('.clock').animate({
      'font-size':'5.5vw'
    },300);
    $('.timer').animate({
      'font-size':'4.5vw'
    },300);
    $('.decimal-timer').animate({
      'font-size':'1.8vw'
    },300);
    $('.timeup').animate({
      'font-size':'4.5vw'
    },300);
    $('.timer-label').animate({
      'font-size':'1.2vw'
    },300);
  }
  else {
    $('#timerTitle').css('font-size','3vw');
    $('.clock').animate({
      'font-size':'5vw'
    },300);
    $('.timer').animate({
      'font-size':'4vw'
    },300);
    $('.decimal-timer').animate({
      'font-size':'1.5vw'
    },300);
    $('.timeup').animate({
      'font-size':'4vw'
    },300);
    $('.timer-label').animate({
      'font-size':'1.1vw'
    },300);
  }

  updateProgressIntervalsAndSize(newWidth);
  updateProgressUnit();
}

function closeNav()
{
  if( $('#main').data('sidePanelOpened') )
  {
    updateTimer();

    document.getElementById("theSidePanel").style.left = "-50vw";
    document.getElementById("main").style.marginLeft = "0";

    $('.timerContainer').animate({
      'left':'50%'
    },400);

    $('#timerTitle').animate({
      'left':'50vw'
    },400);

    if( localStorage.largeFont == "YES" ) {
      $('#largeFontClockCSS').text('.clock {font-size:8vw;}');
      $('#timerTitle').css('font-size','4.5vw');
      $('.timer').animate({
        'font-size':'7vw'
      },300);
      $('.decimal-timer').animate({
        'font-size':'3vw'
      },300);
      $('.timeup').animate({
        'font-size':'7vw'
      },300);
      $('.timer-label').animate({
        'font-size':'1.6vw'
      },300);
    }
    else {
      $('#largeFontClockCSS').text('.clock {font-size:7vw;}');
      $('#timerTitle').css('font-size','4vw');
      $('.timer').animate({
        'font-size':'6vw'
      },300);
      $('.decimal-timer').animate({
        'font-size':'3vw'
      },300);
      $('.timeup').animate({
        'font-size':'6vw'
      },300);
      $('.timer-label').animate({
        'font-size':'1.5vw'
      },300);
    }

    var newWidth = $(window).width();
    if( localStorage.fullscreen != "YES" )
    {
      newWidth -= 40;
    }
    updateProgressIntervalsAndSize(newWidth);
    updateProgressUnit();
    window.app.versionCheck();

    $('#main').data('sidePanelOpened', false);
  }
}

$('#main').click(function()
{
  closeNav();
});

$('#closeButton').click(function()
{
  closeNav();
});

$('#menu-button').click(function(e)
{
  openNav();
  e.stopPropagation();

  if(localStorage.getItem("dob")===null)
  {
    setButtonPressed(4);
    $(document).ready(function () {
    $('#theSidePanel').prop("pointer-events","none");
    $(":input").not("[id=dobInput]")
        .prop("disabled", true);
    });
    $("#onboardingText").css("display","block");
    $("#fadedForeground").css("display","block");
    $("#dobDateContainer").toggleClass('notRed red');
    $("#dobLabel").css("color","#D50000");
    $('#main').data('sidePanelOpened', false);
  }
  //UPDATE WHEN REVVING VERSIONS
  else if(localStorage.getItem("version")=="5.2.1")
  {
    var lastOptionView = localStorage.getItem("lastOptionView");
    if( lastOptionView === null )
    {
      lastOptionView = 0;
    }
    setButtonPressed(lastOptionView);
  }
  else
  {
    setButtonPressed(1);
    localStorage.setItem("version", "5.2.1");
    $("#update-bubble").hide();
  }

  // if(document.getElementById("info-img").src.indexOf("assets/infoWhiteAlert.png") > -1)
  // {
  //   document.getElementById("info-img").src = "assets/infoWhite.png"
  // }
  // else if(document.getElementById("info-img").src.indexOf("assets/infoBlackAlert.png") > -1)
  // {
  //   document.getElementById("info-img").src = "assets/infoBlack.png"
  // }
});


///////////////////////
// SidePanel Navigation
///////////////////////

$("#aboutButton").click(function()
{
  unlessDOBMissingGoToButtonNumber(0);
});

$("#updatesButton").click(function()
{
  unlessDOBMissingGoToButtonNumber(1);
});

$("#themeButton").click(function()
{
  unlessDOBMissingGoToButtonNumber(2);
});

$("#donateButton").click(function()
{
  unlessDOBMissingGoToButtonNumber(3);
});

$("#settingsButton").click(function()
{
  unlessDOBMissingGoToButtonNumber(4);
});

function unlessDOBMissingGoToButtonNumber(button)
{
  localStorage.setItem("lastOptionView", button);

  if(localStorage.getItem("dob")===null)
  {
    setButtonPressed(4);
  }
  else
  {
    setButtonPressed(button);
  }
}

function setButtonPressed(button)
{
  var aboutButton = document.querySelector("#aboutButton");
  var updatesButton = document.querySelector("#updatesButton");
  var themeButton = document.querySelector('#themeButton');
  var donateButton = document.querySelector("#donateButton");
  var settingsButton = document.querySelector("#settingsButton");
  var sidepanelBody = document.querySelector('#sidepanelBody');

  if (button == 0)
  {
    sidepanelBody.innerHTML = window.app.getTemplateScript('about')();
    aboutButton.className = "PressedButton";
    updatesButton.className = "UnpressedButton";
    themeButton.className = "UnpressedButton";
    donateButton.className = "UnpressedButton";
    settingsButton.className = "UnpressedButton";
  }
  else if (button == 1)
  {
    sidepanelBody.innerHTML = window.app.getTemplateScript('updates')();
    aboutButton.className = "UnpressedButton";
    updatesButton.className = "PressedButton";
    themeButton.className = "UnpressedButton";
    donateButton.className = "UnpressedButton";
    settingsButton.className = "UnpressedButton";
  }
  else if (button == 2)
  {
    sidepanelBody.innerHTML = window.app.getTemplateScript('theme')();
    aboutButton.className = "UnpressedButton";
    updatesButton.className = "UnpressedButton";
    themeButton.className = "PressedButton";
    donateButton.className = "UnpressedButton";
    settingsButton.className = "UnpressedButton";


    var theme = localStorage.getItem("colorTheme");
    themeSelectDropdown = $('#themeSelectDropdown');
    if( theme != null ) {
      themeSelectDropdown.val(theme);
    }
    else {
      theme = "default";
      localStorage.colorTheme = "default";
      themeSelectDropdown.val("default");
    }

    [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
      new SelectFx(el);
    } );

    var selectTheme = $( "#themeSelectContainer > div" );
    var selectThemeValue = $( "#themeSelectContainer > div > span" );
    var currentSelectTheme = $("#themeSelectContainer option[value='" + theme + "']").text();
    selectThemeValue.text(currentSelectTheme);
    selectTheme.click(function() {
      localStorage.colorTheme = themeSelectDropdown.val();
      updateProgressBecauseSettingsChanged();
      updateTimer();
    });
  }
  else if (button == 3)
  {
    sidepanelBody.innerHTML = window.app.getTemplateScript('donate')();
    aboutButton.className = "UnpressedButton";
    updatesButton.className = "UnpressedButton";
    themeButton.className = "UnpressedButton";
    donateButton.className = "PressedButton";
    settingsButton.className = "UnpressedButton";
  }
  else
  {
    sidepanelBody.innerHTML = window.app.getTemplateScript('settings')();
    aboutButton.className = "UnpressedButton";
    updatesButton.className = "UnpressedButton";
    themeButton.className = "UnpressedButton";
    donateButton.className = "UnpressedButton";
    settingsButton.className = "PressedButton";

    convertIMG2SVG();
    loadCheckBoxes();
    loadRadioButtons();
    loadDropdowns();
    loadSegmentedControls();
    loadSurvey();
    loadChapterPrecision();
    loadChapters();
    loadTextFields();
    loadDOB();
    loadDOD();
  }
}

function showDOBTimeSelectorIf(isChecked)
{
  if (isChecked) {
      $('#dobTimeInput').show();
  } else {
      $('#dobTimeInput').hide();
  }
}

function showDODTimeSelectorIf(isChecked)
{
  if (isChecked) {
      $('#dodTimeInput').show();
      $('#dailyCountdownCheckboxContainer').show();
  } else {
      $('#dailyCountdownCheckbox').prop('checked', false);
      disableDODDateIf(false);
      localStorage.setItem("dailyCountdown", "NO");
      $('#dodTimeInput').hide();
      $('#dailyCountdownCheckboxContainer').hide();
  }
}

function disableDODDateIf(isChecked)
{
  if (isChecked) {
      $('#dodInput').prop('disabled', true);
      $('#dodLabel').addClass("DisabledLabel");
  } else {
      $('#dodInput').prop('disabled', false);
      $('#dodLabel').removeClass("DisabledLabel");
  }
}

function showSurveyIf(isChecked)
{
  if( isChecked ) {
    $('#specifyDeathContainer').hide();
    $('#surveyUnitsSegmentedControl').show();
    $('#surveyDeathContainer').show();
  } else {
    $('#surveyDeathContainer').hide();
    $('#surveyUnitsSegmentedControl').hide();
    $('#specifyDeathContainer').show();
  }
}

function swapPrecisionSelect(timerType)
{
  if( timerType == "timer" )
  {
    $("#timerPrecisionContainer").show();
    $("#clockPrecisionContainer").hide();
    $("#populationPrecisionContainer").hide();
  }
  else if( timerType == "clock" )
  {
    $("#timerPrecisionContainer").hide();
    $("#clockPrecisionContainer").show();
    $("#populationPrecisionContainer").hide();
  }
  else if( timerType == "population")
  {
    $("#timerPrecisionContainer").hide();
    $("#clockPrecisionContainer").hide();
    $("#populationPrecisionContainer").show();
  }
}

function displayExtraSettingsContainer()
{
  var extraTimerSettingsSegmentedControl1 = $("#extraTimerSettingsSegmentedControl > input:nth-child(1)");
  var extraTimerSettingsSegmentedControl2 = $("#extraTimerSettingsSegmentedControl > input:nth-child(2)");
  var extraTimerSettingsSegmentedControl3 = $("#extraTimerSettingsSegmentedControl > input:nth-child(3)");

  if( extraTimerSettingsSegmentedControl1.is(":checked") ) {
    $("#spentTimerContainer").hide();
    $("#leftTimerContainer").hide();
    $("#peopleTimerContainer").hide();
    $("#clockTimerContainer").show();
    $("#precisionContainer").show();
    $("#precisionLabel").text("Clock Precision");
    swapPrecisionSelect("clock");
    localStorage.timerSetting = "clock";
  }

  else if( extraTimerSettingsSegmentedControl2.is(":checked") ) {
    $("#spentTimerContainer").hide();
    $("#leftTimerContainer").hide();
    $("#clockTimerContainer").hide();
    $("#peopleTimerContainer").show();
    $("#precisionContainer").show();
    $("#precisionLabel").text("Population Precision");
    swapPrecisionSelect("population");
    localStorage.timerSetting = "population";
  }

  else if( extraTimerSettingsSegmentedControl3.is(":checked") ) {
    $("#spentTimerContainer").hide();
    $("#leftTimerContainer").hide();
    $("#clockTimerContainer").hide();
    $("#peopleTimerContainer").hide();
    $("#precisionContainer").hide();
    localStorage.timerSetting = "hide";
  }
}

function loadSegmentedControls()
{
  var timerSettingsSegmentedControl1 = $("#timerSettingsSegmentedControl > input:nth-child(1)");
  var timerSettingsSegmentedControl2 = $("#timerSettingsSegmentedControl > input:nth-child(2)");
  var timerSettingsSegmentedControl3 = $("#timerSettingsSegmentedControl > input:nth-child(3)");

  var extraTimerSettingsSegmentedControl1 = $("#extraTimerSettingsSegmentedControl > input:nth-child(1)");
  var extraTimerSettingsSegmentedControl2 = $("#extraTimerSettingsSegmentedControl > input:nth-child(2)");
  var extraTimerSettingsSegmentedControl3 = $("#extraTimerSettingsSegmentedControl > input:nth-child(3)");

  timerSettingsSegmentedControl1.change( function () {
    if( timerSettingsSegmentedControl1.is(":checked") ) {
      $("#extraTimerSettingsSegmentedControl").fadeOut(1);
      $("#spentTimerContainer").show();
      $("#leftTimerContainer").hide();
      $("#peopleTimerContainer").hide();
      $("#clockTimerContainer").hide();
      $("#precisionContainer").show();
      $("#precisionLabel").text("Smallest Precision");
      swapPrecisionSelect("timer");
      localStorage.timerSetting = "spent";
      updateTimer();
    }
  });

  timerSettingsSegmentedControl2.change( function () {
    if( timerSettingsSegmentedControl2.is(":checked") ) {
      $("#extraTimerSettingsSegmentedControl").fadeOut(1);
      $("#spentTimerContainer").fadeOut(1);
      $("#leftTimerContainer").fadeIn(1);
      $("#peopleTimerContainer").hide();
      $("#clockTimerContainer").hide();
      $("#precisionContainer").show();
      $("#precisionLabel").text("Smallest Precision");
      swapPrecisionSelect("timer");
      localStorage.timerSetting = "left";
      updateTimer();
    }
  });

  timerSettingsSegmentedControl3.change( function () {
    if( timerSettingsSegmentedControl3.is(":checked") ) {
      $("#extraTimerSettingsSegmentedControl").addClass("borderless-segmented-control");
      $("#extraTimerSettingsSegmentedControl").hide().fadeIn(500);
      $("#extraTimerSettingsSegmentedControl").removeClass("borderless-segmented-control");
      displayExtraSettingsContainer();
      if( extraTimerSettingsSegmentedControl1.is(":checked") ) {
        localStorage.timerSetting = "clock";
      }
      else if( extraTimerSettingsSegmentedControl2.is(":checked") ) {
        localStorage.timerSetting = "population";
      }
      else if( extraTimerSettingsSegmentedControl3.is(":checked") ) {
        localStorage.timerSetting = "hide";
      }
      updateTimer();
    }
  });

  extraTimerSettingsSegmentedControl1.change( function () {
    if( extraTimerSettingsSegmentedControl1.is(":checked") ) {
      displayExtraSettingsContainer();
      updateTimer();
    }
  });

  extraTimerSettingsSegmentedControl2.change( function () {
    if( extraTimerSettingsSegmentedControl2.is(":checked") ) {
      displayExtraSettingsContainer();
      updateTimer();
    }
  });

  extraTimerSettingsSegmentedControl3.change( function () {
    if( extraTimerSettingsSegmentedControl3.is(":checked") ) {
      displayExtraSettingsContainer();
      updateTimer();
    }
  });

  if( localStorage.getItem("timerSetting") == "left" ) {
      $('#timerSettingsSegmentedControl > input:nth-child(2)').prop('checked', true);
      $("#spentTimerContainer").fadeOut(1);
      $("#leftTimerContainer").fadeIn(1);
      $("#precisionContainer").show();
      $("#precisionLabel").text("Smallest Precision");
      swapPrecisionSelect("timer");
  }
  else if( localStorage.getItem("timerSetting") == "clock" || localStorage.getItem("timerSetting") == "population" || localStorage.getItem("timerSetting") == "hide" ) {
    $('#timerSettingsSegmentedControl > input:nth-child(3)').prop('checked', true);
    $("#extraTimerSettingsSegmentedControl").addClass("borderless-segmented-control");
    $("#extraTimerSettingsSegmentedControl").hide().fadeIn(500);
    $("#extraTimerSettingsSegmentedControl").removeClass("borderless-segmented-control");

    if( localStorage.getItem("timerSetting") == "population" ) {
      $('#extraTimerSettingsSegmentedControl > input:nth-child(2)').prop('checked', true);
    }
    else if( localStorage.getItem("timerSetting") == "hide" ) {
      $('#extraTimerSettingsSegmentedControl > input:nth-child(3)').prop('checked', true);
    }
    displayExtraSettingsContainer();
  }

  var surveyUnitsSegmentedControl1 = $("#surveyUnitsSegmentedControl > input:nth-child(1)");
  var surveyUnitsSegmentedControl2 = $("#surveyUnitsSegmentedControl > input:nth-child(2)");

  surveyUnitsSegmentedControl1.change( function () {
    if( surveyUnitsSegmentedControl1.is(":checked") ) {
      $("#metricWeightContainer").fadeOut(1, function() {
        $("#imperialWeightContainer").fadeIn(1);
      });
      $("#heightMetricContainer").fadeOut(1, function() {
        $("#heightDropdownContainer").fadeIn(1);
        localStorage.surveyUnitsMetric = "NO";
        loadSurveyImperial();
        updateTimer();
      });
    }
  });

  surveyUnitsSegmentedControl2.change( function () {
    if( surveyUnitsSegmentedControl2.is(":checked") ) {
      $("#imperialWeightContainer").fadeOut(1, function() {
        $("#metricWeightContainer").fadeIn(1);
      });
      $("#heightDropdownContainer").fadeOut(1, function() {
        $("#heightMetricContainer").fadeIn(1);
        localStorage.surveyUnitsMetric = "YES";
        loadSurveyMetric();
        updateTimer();
      });
    }
  });

  if( localStorage.surveyUnitsMetric == "YES" )
  {
    $('#surveyUnitsSegmentedControl > input:nth-child(2)').prop('checked', true);
    $("#imperialWeightContainer").fadeOut(1);
    $("#metricWeightContainer").fadeIn(1);
    $("#heightDropdownContainer").fadeOut(1);
    $("#heightMetricContainer").fadeIn(1);
    loadSurveyMetric();
  }
  else {
    loadSurveyImperial();
  }

  var chapterPrecisionSegmentedControl1 = $("#chapterPrecisionSegmentedControl > input:nth-child(1)");
  var chapterPrecisionSegmentedControl2 = $("#chapterPrecisionSegmentedControl > input:nth-child(2)");
  var chapterPrecisionSegmentedControl3 = $("#chapterPrecisionSegmentedControl > input:nth-child(3)");

  if( localStorage.getItem("chapterPrecision") === null ){
    localStorage.setItem("chapterPrecision", "months");
  }

  chapterPrecisionSegmentedControl1.change( function () {
    if( $(this).is(":checked") ) {
      localStorage.setItem("chapterPrecision", "weeks");
      document.getElementById("rowIsYearContainer").style.display = "block";
      updateProgressBecauseSettingsChanged()
    }
  });

  chapterPrecisionSegmentedControl2.change( function () {
    if( $(this).is(":checked") ) {
      localStorage.setItem("chapterPrecision", "months");
      document.getElementById("rowIsYearContainer").style.display = "block";
      updateProgressBecauseSettingsChanged()
    }
  });

  chapterPrecisionSegmentedControl3.change( function () {
    if( $(this).is(":checked") ) {
      localStorage.setItem("chapterPrecision", "years");
      document.getElementById("rowIsYearContainer").style.display = "none";
      updateProgressBecauseSettingsChanged()
    }
  });


  if( localStorage.getItem("chapterPrecision") == "weeks" ) {
      $('#chapterPrecisionSegmentedControl > input:nth-child(1)').prop('checked', true);
  }
  else if( localStorage.getItem("chapterPrecision") == "months" ) {
      $('#chapterPrecisionSegmentedControl > input:nth-child(2)').prop('checked', true);
  }
  else if( localStorage.getItem("chapterPrecision") == "years" ) {
      $('#chapterPrecisionSegmentedControl > input:nth-child(3)').prop('checked', true);
      document.getElementById("rowIsYearContainer").style.display = "none";
  }

  var chapterLengthSegmentedControl1 = $("#chapterLengthSegmentedControl > input:nth-child(1)");
  var chapterLengthSegmentedControl2 = $("#chapterLengthSegmentedControl > input:nth-child(2)");

  chapterLengthSegmentedControl1.change( function () {
    if( chapterLengthSegmentedControl1.is(":checked") ) {
      $("#chapterLengthsFixedContainer").fadeOut(1, function() {
        $("#chapterLengthsSpecifyContainer").fadeIn(1);
        localStorage.setItem("fixedChapters", "NO");
        updateProgressBecauseSettingsChanged();
      });
    }
  });

  chapterLengthSegmentedControl2.change( function () {
    if( chapterLengthSegmentedControl2.is(":checked") ) {
      $("#chapterLengthsSpecifyContainer").fadeOut(1, function() {
        $("#chapterLengthsFixedContainer").fadeIn(1);
        localStorage.setItem("fixedChapters", "NO");
        updateProgressBecauseSettingsChanged();
      });
    }
  });

  if( localStorage.getItem("fixedChapters") == "YES" )
  {
    $('#chapterLengthSegmentedControl > input:nth-child(2)').prop('checked', true);
    $("#chapterLengthsSpecifyContainer").fadeOut(1);
    $("#chapterLengthsFixedContainer").fadeIn(1);
  }
}

function loadRadioButtons()
{
  var youngerOption = document.querySelector('input[id=youngerOption]');
  var olderOption = document.querySelector('input[id=olderOption]');
  var totalOption = document.querySelector('input[id=totalOption]');
  if( localStorage.populationOption == "YOUNGER" ) {
    youngerOption.checked = true;
  }
  else if( localStorage.populationOption == "OLDER" ) {
    olderOption.checked = true;
  }
  else {
    totalOption.checked = true;
  }

  youngerOption.addEventListener('change', function () {
    if( youngerOption.checked ) {
      localStorage.populationOption = "YOUNGER";
    }
  });

  olderOption.addEventListener('change', function () {
    if( olderOption.checked ) {
      localStorage.populationOption = "OLDER";
    }
  });

  totalOption.addEventListener('change', function () {
    if( totalOption.checked ) {
      localStorage.populationOption = "TOTAL";
    }
  });

  var circleOption = document.querySelector('input[id=circleOption]');
  var squareOption = document.querySelector('input[id=squareOption]');
  if (localStorage.getItem("shape") == "square") {
    squareOption.checked = true;
  }
  else {
    circleOption.checked = true;
  }

  circleOption.addEventListener('change', function () {
    localStorage.setItem("shape", circleOption.checked?"circle":"square");
    $(".circle").css("borderRadius","50%");
    updateProgressUnit();
  });

  squareOption.addEventListener('change', function () {
    localStorage.setItem("shape", squareOption.checked?"square":"circle");
    $(".circle").css("borderRadius","0");
    updateProgressUnit();
  });
}

function loadCheckBoxes()
{
  var dobTimeCheckbox = document.querySelector('input[id=dobTimeCheckbox]');
  if (localStorage.getItem("dobTimeSet") == "YES") {
    dobTimeCheckbox.checked = true;
  }
  showDOBTimeSelectorIf(dobTimeCheckbox.checked);

  dobTimeCheckbox.addEventListener('change', function () {
    showDOBTimeSelectorIf(dobTimeCheckbox.checked);
    localStorage.setItem("dobTimeSet", dobTimeCheckbox.checked?"YES":"NO");
    if( !dobTimeCheckbox.checked ) {
      localStorage.dobMinutes = 0;
      $("#dobTimeInput").val(getTimeStringFromMinutes(0));
      window.app.dobMinutes = 0;
      updateTimer();
    }
  });

  var dodTimeCheckbox = document.querySelector('input[id=dodTimeCheckbox]');
  if (localStorage.getItem("dodTimeSet") == "YES") {
    dodTimeCheckbox.checked = true;
  }
  showDODTimeSelectorIf(dodTimeCheckbox.checked);

  dodTimeCheckbox.addEventListener('change', function () {
    showDODTimeSelectorIf(dodTimeCheckbox.checked);
    localStorage.setItem("dodTimeSet", dodTimeCheckbox.checked?"YES":"NO");
    if( !dodTimeCheckbox.checked ) {
      localStorage.dodMinutes = 0;
      $("#dodTimeInput").val(getTimeStringFromMinutes(0));
      updateTimer();
    }
  });

  var takeSurveyCheckbox = document.querySelector('input[id=takeSurveyCheckbox]');
  if (localStorage.getItem("surveyDOD") == "YES") {
    takeSurveyCheckbox.checked = true;
  }
  showSurveyIf(takeSurveyCheckbox.checked);

  takeSurveyCheckbox.addEventListener('change', function () {
    showSurveyIf(takeSurveyCheckbox.checked);
    localStorage.setItem("surveyDOD", takeSurveyCheckbox.checked?"YES":"NO");
    updateTimer();
  });

  var dailyCountdownCheckbox = document.querySelector('input[id=dailyCountdownCheckbox]');
  if (localStorage.getItem("dailyCountdown") == "YES") {
    dailyCountdownCheckbox.checked = true;
  }
  disableDODDateIf(dailyCountdownCheckbox.checked);

  dailyCountdownCheckbox.addEventListener('change', function () {
    disableDODDateIf(dailyCountdownCheckbox.checked);
    localStorage.setItem("dailyCountdown", dailyCountdownCheckbox.checked?"YES":"NO");
    updateTimer();
  });

  var hideProgressCheckbox = document.querySelector('input[id=hideProgressCheckbox]');
  if (localStorage.getItem("hideProgress") == "YES") {
    hideProgressCheckbox.checked = true;
  }

  hideProgressCheckbox.addEventListener('change', function () {
    localStorage.setItem("hideProgress", hideProgressCheckbox.checked?"YES":"NO");
    if( hideProgressCheckbox.checked ) {
      $('#circles').css('opacity',0);
    }
    else {
      $('#circles').css('opacity',1);
    }
  });

  var noMarginsCheckbox = document.querySelector('input[id=noMarginsCheckbox]');
  if (localStorage.getItem("noChapterMargins") == "YES") {
    noMarginsCheckbox.checked = true;
  }

  noMarginsCheckbox.addEventListener('change', function () {
    localStorage.setItem("noChapterMargins", noMarginsCheckbox.checked?"YES":"NO");
    updateProgressBecauseSettingsChanged();
  });

  var twentyFourCheckbox = document.querySelector('input[id=twentyFourCheckbox]');
  if (localStorage.twentyFour == "YES") {
    twentyFourCheckbox.checked = true;
  }

  twentyFourCheckbox.addEventListener('change', function () {
    localStorage.twentyFour = twentyFourCheckbox.checked?"YES":"NO";
    updateTimer();
  });

  var largeFontCheckbox = document.querySelector('input[id=largeFontCheckbox]');
  if (localStorage.largeFont == "YES") {
    largeFontCheckbox.checked = true;
  }

  largeFontCheckbox.addEventListener('change', function () {
    localStorage.largeFont = largeFontCheckbox.checked?"YES":"NO";
    updateTimer();
  });

  var decimalPrecisionCheckbox = document.querySelector('input[id=decimalPrecisionCheckbox]');
  if (localStorage.decimalPrecision == "YES") {
    decimalPrecisionCheckbox.checked = true;
  }

  decimalPrecisionCheckbox.addEventListener('change', function () {
    localStorage.decimalPrecision = decimalPrecisionCheckbox.checked?"YES":"NO";
    updateTimer();
  });

  var fullscreenCheckbox = document.querySelector('input[id=fullscreenCheckbox]');
  if (localStorage.fullscreen == "YES") {
    fullscreenCheckbox.checked = true;
  }

  fullscreenCheckbox.addEventListener('change', function () {
    localStorage.fullscreen = fullscreenCheckbox.checked?"YES":"NO";
    updateProgressBecauseSettingsChanged();
  });

  var hideUpdatesCheckbox = document.querySelector('input[id=hideUpdatesCheckbox]');
  if (localStorage.hideUpdates == "YES") {
    hideUpdatesCheckbox.checked = true;
  }

  hideUpdatesCheckbox.addEventListener('change', function () {
    localStorage.hideUpdates = hideUpdatesCheckbox.checked?"YES":"NO";
  });

  var rowIsYearCheckbox = document.querySelector('input[id=rowIsYearCheckbox]');
  if (localStorage.getItem("rowIsYear") == "YES") {
    rowIsYearCheckbox.checked = true;
  }

  rowIsYearCheckbox.addEventListener('change', function () {
    localStorage.setItem("rowIsYear", rowIsYearCheckbox.checked?"YES":"NO");
    updateProgressBecauseSettingsChanged();
  });
}

function loadDropdowns()
{
  timerPrecision = localStorage.getItem("timerPrecision");
  timerPrecisionDropdown = $('#timerPrecisionDropdown');
  if( timerPrecision != null ) {
    timerPrecisionDropdown.val(timerPrecision);
  }
  else {
    timerPrecision = "ms";
    localStorage.timerPrecision = "ms";
  }

  var precisionDictionary = {"year":1,"month":2,"day":3,"hour":4,"min":5,"sec":6,"ms":7,"decimal":8};
  var precisionTextDictionary = {"year":"Years","month":"Months","day":"Days","hour":"Hours","min":"Minutes","sec":"Seconds"};
  var smallestPrecision = localStorage.timerPrecision;
  var largestPrecisionDropdownOptions = $('#largestPrecisionDropdown > option');
  largestPrecisionDropdownOptions.each(function() {
    if ( precisionDictionary[$(this).val()] > precisionDictionary[smallestPrecision]) {
      $(this).remove();
    }
  });

  var largestPrecision = localStorage.getItem("largestPrecision");
  largestPrecisionDropdown = $('#largestPrecisionDropdown');
  if( largestPrecision != null ) {
    var exists = 0 != $('#largestPrecisionDropdown option[value='+localStorage.largestPrecision+']').length;
    if( exists )
    {
      $("#largestPrecisionDropdown").val(localStorage.largestPrecision);
    }
  }
  else {
    largestPrecision = "year";
    localStorage.largestPrecision = "year";
  }

  clockPrecision = localStorage.getItem("clockPrecision");
  clockPrecisionDropdown = $('#clockPrecisionDropdown');
  if( clockPrecision != null ) {
    clockPrecisionDropdown.val(clockPrecision);
  }
  else {
    clockPrecision = "min";
    localStorage.clockPrecision = "min";
  }
  populationPrecision = localStorage.getItem("populationPrecision");
  populationPrecisionDropdown = $('#populationPrecisionDropdown');
  if( populationPrecision != null ) {
    populationPrecisionDropdown.val(populationPrecision);
  }
  else {
    populationPrecision = "one";
    localStorage.populationPrecision = "one";
  }

  timeupMessage = localStorage.getItem("timeupMessage");
  timeupMessageDropdown = $('#timeupMessageDropdown');
  if( timeupMessage != null ) {
    timeupMessageDropdown.val(timeupMessage);
  }
  else {
    timeupMessage = "¯\\_(ツ)_/¯";
    localStorage.timeupMessage = "¯\\_(ツ)_/¯";
  }

  [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
    new SelectFx(el);
  } );

  selectLargestTimer = $( "#largestPrecisionContainer > div" );
  selectLargestTimerValue = $( "#largestPrecisionContainer > div > span" );
  currentLargestTimerValue = $("#largestPrecisionDropdown option[value='" + largestPrecision + "']").text();
  var exists = 0 != $('#largestPrecisionDropdown option[value='+localStorage.largestPrecision+']').length;
  if( exists ) {
    selectLargestTimerValue.text(currentLargestTimerValue);
  }
  selectLargestTimer.click(function() {
    localStorage.largestPrecision = largestPrecisionDropdown.val();
    updateTimer();
  });

  selectTimer = $( "#smallestPrecisionContainer > div" );
  selectTimerValue = $( "#smallestPrecisionContainer > div > span" );
  currentTimerValue = $("#timerPrecisionDropdown option[value='" + timerPrecision + "']").text();
  selectTimerValue.text(currentTimerValue);
  if(localStorage.timerPrecision == "decimal")
  {
    $("#decimalPrecisionCheckboxContainer").show();
  }
  else
  {
      $("#decimalPrecisionCheckboxContainer").hide();
  }
  selectTimer.click(function() {
    localStorage.timerPrecision = timerPrecisionDropdown.val();
    if(localStorage.timerPrecision == "decimal")
    {
      $("#decimalPrecisionCheckboxContainer").show();
    }
    else
    {
      $("#decimalPrecisionCheckboxContainer").hide();
    }
    var output = ['<select id="largestPrecisionDropdown" class="cs-select cs-skin-elastic">'];
    var selectOutput = [];
    $.each(precisionTextDictionary, function(key, value)
    {
      var smallPrecision = localStorage.timerPrecision;
      if ( precisionDictionary[key] <= precisionDictionary[smallPrecision]) {
        output.push('<option value="'+ key +'">'+ value +'</option>');
        selectOutput.push('<li data-option="" data-value="'+key+'"><span>'+value+'</span></li>');
      }
    });
    output.push('</select>');
    $('#largestPrecisionContainer > .cs-select').replaceWith(output.join(''));

    var exists = 0 != $('#largestPrecisionDropdown option[value='+localStorage.largestPrecision+']').length;
    if( exists )
    {
      $("#largestPrecisionDropdown").val(localStorage.largestPrecision);
    }
    new SelectFx(document.querySelector("#largestPrecisionDropdown"));

    selectLargestTimer = $( "#largestPrecisionContainer > div" );
    selectLargestTimerValue = $( "#largestPrecisionContainer > div > span" );
    currentLargestTimerValue = $("#largestPrecisionDropdown option[value='" + localStorage.largestPrecision + "']").text();
    if( exists )
    {
      selectLargestTimerValue.text(currentLargestTimerValue);
    }
    selectLargestTimer.click(function() {
      localStorage.largestPrecision = $("#largestPrecisionDropdown").val();
      updateTimer();
    });
    updateTimer();
  });

  selectClock = $( "#clockPrecisionContainer > div" );
  selectClockValue = $( "#clockPrecisionContainer > div > span" );
  currentClockValue = $("#clockPrecisionDropdown option[value='" + clockPrecision + "']").text();
  selectClockValue.text(currentClockValue);
  selectClock.click(function() {
    localStorage.clockPrecision = clockPrecisionDropdown.val();
    updateTimer();
  });

  selectPopulation = $( "#populationPrecisionContainer > div" );
  selectPopulationValue = $( "#populationPrecisionContainer > div > span" );
  currentPopulationValue = $("#populationPrecisionDropdown option[value='" + populationPrecision + "']").text();
  selectPopulationValue.text(currentPopulationValue);
  selectPopulation.click(function() {
    localStorage.populationPrecision = populationPrecisionDropdown.val();
    updateTimer();
  });

  selectTimeupMessage = $( "#timeupMessageContainer > div" );
  selectTimeupMessageValue = $( "#timeupMessageContainer > div > span" );
  selectTimeupMessageValue.text(timeupMessage);
  selectTimeupMessage.click(function() {
    localStorage.timeupMessage = timeupMessageDropdown.val();
    updateTimer();
  });
}

function loadSurveyMetric() {
  var surveyHeightMeters = localStorage.getItem("surveyHeightMeters");
  var surveyHeightMetersDropdown = $("#heightMeters-dropdown");
  if (surveyHeightMeters !== null) {
    surveyHeightMetersDropdown.val(surveyHeightMeters);
  }
  surveyHeightMetersDropdown.change(function() {
    localStorage.surveyHeightMeters = surveyHeightMetersDropdown.val();
    updateTimer();
  });

  var surveyHeightCM = localStorage.getItem("surveyHeightCM");
  var surveyHeightCMDropdown = $("#heightCM-dropdown");
  if (surveyHeightCM !== null) {
    surveyHeightCMDropdown.val(surveyHeightCM);
  }
  surveyHeightCMDropdown.change(function() {
    localStorage.surveyHeightCM = surveyHeightCMDropdown.val();
    updateTimer();
  });

  var surveyWeightKG = localStorage.getItem("surveyWeightKG");
  var surveyWeightKGTextfield = $("#metricWeightTextfield");
  if( surveyWeightKG !== null ) {
    surveyWeightKGTextfield.val(surveyWeightKG);
  }
  surveyWeightKGTextfield.on('input',function(e){
    localStorage.surveyWeightKG = surveyWeightKGTextfield.val();
    updateTimer();
  });
}

function loadSurveyImperial() {
  var surveyHeightFeet = localStorage.getItem("surveyHeightFeet");
  var surveyHeightFeetDropdown = $("#heightFeet-dropdown");
  if (surveyHeightFeet !== null) {
    surveyHeightFeetDropdown.val(surveyHeightFeet);
  }
  surveyHeightFeetDropdown.change(function() {
    localStorage.surveyHeightFeet = surveyHeightFeetDropdown.val();
    updateTimer();
  });

  var surveyHeightInches = localStorage.getItem("surveyHeightInches");
  var surveyHeightInchesDropdown = $("#heightInches-dropdown");
  if (surveyHeightInches !== null) {
    surveyHeightInchesDropdown.val(surveyHeightInches);
  }
  surveyHeightInchesDropdown.change(function() {
    localStorage.surveyHeightInches = surveyHeightInchesDropdown.val();
    updateTimer();
  });

  var surveyWeight = localStorage.getItem("surveyWeight");
  var surveyWeightTextfield = $("#weightTextfield");
  if (surveyWeight !== null) {
    surveyWeightTextfield.val(surveyWeight);
  }
  surveyWeightTextfield.on('input',function(e){
    localStorage.surveyWeight = surveyWeightTextfield.val();
    updateTimer();
  });
}

function loadSurvey()
{
  var surveyGender = localStorage.getItem("surveyGender");
  var surveyGenderDropdown = $("#gender-dropdown");
  if (surveyGender !== null) {
    surveyGenderDropdown.val(surveyGender);
  }
  surveyGenderDropdown.change(function() {
    localStorage.surveyGender = surveyGenderDropdown.val();
    updateTimer();
  });

  var surveyEthnicity = localStorage.getItem("surveyEthnicity");
  var surveyEthnicityDropdown = $("#ethnicity-dropdown");
  if (surveyEthnicity !== null) {
    surveyEthnicityDropdown.val(surveyEthnicity);
  }
  surveyEthnicityDropdown.change(function() {
    localStorage.surveyEthnicity = surveyEthnicityDropdown.val();
    updateTimer();
  });

  var surveyDrinking = localStorage.getItem("surveyDrinking");
  var surveyDrinkingDropdown = $("#drinking-dropdown");
  if (surveyDrinking !== null) {
    surveyDrinkingDropdown.val(surveyDrinking);
  }
  surveyDrinkingDropdown.change(function() {
    localStorage.surveyDrinking = surveyDrinkingDropdown.val();
    updateTimer();
  });

  var surveySmoking = localStorage.getItem("surveySmoking");
  var surveySmokingDropdown = $("#smoking-dropdown");
  if (surveySmoking !== null) {
    surveySmokingDropdown.val(surveySmoking);
  }
  surveySmokingDropdown.change(function() {
    localStorage.surveySmoking = surveySmokingDropdown.val();
    updateTimer();
  });

  var surveyExercise = localStorage.getItem("surveyExercise");
  var surveyExerciseDropdown = $("#exercise-dropdown");
  if (surveyExercise !== null) {
    surveyExerciseDropdown.val(surveyExercise);
  }
  surveyExerciseDropdown.change(function() {
    localStorage.surveyExercise = surveyExerciseDropdown.val();
    updateTimer();
  });

  var surveyHeartCheckbox = document.querySelector('input[id=heartDisease-checkbox]');
  if (localStorage.getItem("surveyHeartDisease") == "YES") {
    surveyHeartCheckbox.checked = true;
  }
  surveyHeartCheckbox.addEventListener('change', function () {
    localStorage.setItem("surveyHeartDisease", surveyHeartCheckbox.checked?"YES":"NO");
    updateTimer();
  });

  var surveyClumsinessCheckbox = document.querySelector('input[id=clumsiness-checkbox]');
  if (localStorage.getItem("surveyClumsiness") == "YES") {
    surveyClumsinessCheckbox.checked = true;
  }
  surveyClumsinessCheckbox.addEventListener('change', function () {
    localStorage.setItem("surveyClumsiness", surveyClumsinessCheckbox.checked?"YES":"NO");
    updateTimer();
  });
}

function rotate(currentDegree)
{
  if( currentDegree <= 180 )
  {
    $("#openCloseChevron svg").css({ WebkitTransform: 'rotate(' + currentDegree + 'deg)'});
    $("#openCloseChevron svg").css({ '-moz-transform': 'rotate(' + currentDegree + 'deg)'});

    setTimeout(function() {
        currentDegree+=5; rotate(currentDegree);
    },3);
  }
}

function reverseRotate(currentDegree)
{
  if( currentDegree >= 0 )
  {
    $("#openCloseChevron svg").css({ WebkitTransform: 'rotate(' + currentDegree + 'deg)'});
    $("#openCloseChevron svg").css({ '-moz-transform': 'rotate(' + currentDegree + 'deg)'});

    setTimeout(function() {
        currentDegree-=5; reverseRotate(currentDegree);
    },3);
  }
}

function loadChapterPrecision()
{

  var chapterPrecisionContainer = $('#chapterSettingsLabelContainer');
  chapterPrecisionContainer.click(function() {
    if( $("#chapterSettingsLabelContainer").data('rotated') )
    {
      reverseRotate(180);
      $("#chapterSettingsLabelContainer").data('rotated',false);
      $('#chapterSettingsContainer').slideUp(300);
    }
    else
    {
      rotate(0);
      $("#chapterSettingsLabelContainer").data('rotated',true);
      $('#chapterSettingsContainer').slideDown(300);
    }
  });

  var chapterPrecisionYear = localStorage.getItem("chapterPrecisionYear");
  var chapterPrecisionYearTextfield = $("#fixedYearsInput");
  if (chapterPrecisionYear === null) {
    localStorage.chapterPrecisionYear = 10;
    chapterPrecisionYearTextfield.val(10);
  }
  else {
    chapterPrecisionYearTextfield.val(chapterPrecisionYear);
  }

  chapterPrecisionYearTextfield.on('input',function(e){
    var fixedYear = $(this).val();
    if( fixedYear <= 0 || fixedYear >= 200 ) {
      var prev = $(this).data('val');
      if( prev ) {
        $(this).val(prev);
      }
    }
    else
    {
      localStorage.chapterPrecisionYear = chapterPrecisionYearTextfield.val();
      updateProgressBecauseSettingsChanged();
      $(this).data('val', $(this).val());
    }
  });


  var chapterPrecisionMonth = localStorage.getItem("chapterPrecisionMonth");
  var chapterPrecisionMonthTextfield = $("#fixedMonthsInput");
  if (chapterPrecisionMonth === null) {
    localStorage.chapterPrecisionMonth = 0;
    chapterPrecisionMonthTextfield.val(0);
  }
  else {
    chapterPrecisionMonthTextfield.val(chapterPrecisionMonth);
  }

  chapterPrecisionMonthTextfield.on('focusin', function(){
    $(this).data('val', $(this).val());
  });

  chapterPrecisionMonthTextfield.on('input',function(e){
    var fixedMonth = $(this).val();
    if( fixedMonth < 0 || fixedMonth >= 12 ) {
      var prev = $(this).data('val');
      if( prev ) {
        $(this).val(prev);
      }
    }
    else
    {
      localStorage.chapterPrecisionMonth = chapterPrecisionMonthTextfield.val();
      updateProgressBecauseSettingsChanged();
      $(this).data('val', $(this).val());
    }
  });
}

function loadChapters()
{
  if( localStorage.getItem("chapterNum") === null) {
    localStorage.setItem("chapterNum", 7);
  }

  numberOfChapters = localStorage.chapterNum;
  for( i=1; i<numberOfChapters; i++ )
  {
    chapterNum = parseInt(i+1);
    var chapterYearString = zeroFill(chapterNum,2);
    var chapterNumString = getOrdinal(chapterNum);
    $('#chapterLengthStackView').append('<div class="chapter"><div class="chapterNum">{0}</div><input type="number" id="chapterYear{1}" class="yearsInput" min="0" max="100"><input type="number" id="chapterMonth{1}" class="monthsInput" min="0" max="11"></div>'.format(zeroFill(chapterNumString,2), chapterYearString))
  }

  $('#addChapterButton').on( "click", function() {
    var chapterValue = localStorage.getItem("chapterNum");
    chapterNum = parseInt(chapterValue);
    var chapterNumOffset = chapterNum + 1;
    var chapterNumOffsetString = zeroFill(chapterNumOffset.toString(),2);
    var chapterNumString = getOrdinal(chapterNum+1);
    $('#chapterLengthStackView').append('<div class="chapter"><div class="chapterNum">{0}</div><input type="number" id="chapterYear{1}" class="yearsInput" min="0" max="100" value="0"><input type="number" id="chapterMonth{1}" class="monthsInput" min="0" max="11" value="0"></div>'.format(zeroFill(chapterNumString,2), chapterNumOffsetString))
    chapterNum+=1;
    localStorage.setItem("chapterNum", chapterNum);

    var newChapterYearsInput = $('#chapterYear{0}'.format(chapterNumOffsetString));
    newChapterYearsInput.on('input',function(e){
      var savedChapterYearLengths = JSON.parse(localStorage.getItem("chapterYearLengths"));
      yearNumber = e.currentTarget.id.slice(-2);
      savedChapterYearLengths[yearNumber - 1] = e.currentTarget.value;
      localStorage.setItem("chapterYearLengths", JSON.stringify(savedChapterYearLengths));
    updateProgressBecauseSettingsChanged();
    });

    var newChapterMonthsInput = $('#chapterMonth{0}'.format(chapterNumOffsetString));
    newChapterMonthsInput.on('input',function(e){
      var savedChapterMonthLengths = JSON.parse(localStorage.getItem("chapterMonthLengths"));
      monthNumber = e.currentTarget.id.slice(-2);
      savedChapterMonthLengths[monthNumber - 2] = e.currentTarget.value;
      localStorage.setItem("chapterMonthLengths", JSON.stringify(savedChapterMonthLengths));
      updateProgressBecauseSettingsChanged();
    });

  });

  $('#removeChapterButton').on( "click", function() {
    var chapterValue = localStorage.getItem("chapterNum");
    chapterNum = parseInt(chapterValue);
    if( chapterNum > 1 )
    {
      $('#chapterLengthStackView .chapter').last().remove();
      chapterNum-=1;
      localStorage.setItem("chapterNum", chapterNum);
    }

    var savedChapterYearLengths = JSON.parse(localStorage.getItem("chapterYearLengths"));
    savedChapterYearLengths[chapterNum] = 0;
    localStorage.setItem("chapterYearLengths", JSON.stringify(savedChapterYearLengths));

    var savedChapterMonthLengths = JSON.parse(localStorage.getItem("chapterMonthLengths"));
    savedChapterMonthLengths[chapterNum-2] = 0;
    localStorage.setItem("chapterMonthLengths", JSON.stringify(savedChapterMonthLengths));
    updateProgressBecauseSettingsChanged();
  });


  var savedChapterYearLengths = JSON.parse(localStorage.getItem("chapterYearLengths"));
  if( savedChapterYearLengths === null ) {
    savedChapterYearLengths = [5,7,2,4,4,43,15];
    localStorage.setItem("chapterYearLengths", JSON.stringify(savedChapterYearLengths));
  }
  var savedChapterMonthLengths = JSON.parse(localStorage.getItem("chapterMonthLengths"));
  if( savedChapterMonthLengths === null ) {
    savedChapterMonthLengths = [0,0,0,0,0,0];
    localStorage.setItem("chapterMonthLengths", JSON.stringify(savedChapterMonthLengths));
  }

  var firstChapter = $("#firstChapterYearsInput");
  firstChapter.val(savedChapterYearLengths[0]);
  firstChapter.on('input',function(e){
    var savedChapterYearLengths = JSON.parse(localStorage.getItem("chapterYearLengths"));
    savedChapterYearLengths[0] = e.currentTarget.value;
    localStorage.setItem("chapterYearLengths", JSON.stringify(savedChapterYearLengths));
    updateProgressBecauseSettingsChanged();
  });

  for( j=1; j<numberOfChapters; j++ )
  {
    var chapterNum = parseInt(j+1);
    var chapterNumString = zeroFill(chapterNum.toString(),2);
    yearValue = savedChapterYearLengths[j];
    if( typeof yearValue === 'undefined' || !yearValue ) {
      yearValue = 0;
    }
    $('#chapterYear{0}'.format(chapterNumString)).val(yearValue);
  }
  for( k=1; k<numberOfChapters; k++ )
  {
    var chapterNum = parseInt(k+1);
    var chapterNumString = zeroFill(chapterNum.toString(),2);
    monthValue = savedChapterMonthLengths[k-1];
    if( typeof monthValue === 'undefined' || !monthValue ) {
      monthValue = 0;
    }
    $('#chapterMonth{0}'.format(chapterNumString)).val(monthValue);
  }

  var chapterYearInputs = $('.yearsInput');
  chapterYearInputs.on('input',function(e){
    var savedChapterYearLengths = JSON.parse(localStorage.getItem("chapterYearLengths"));
    yearNumber = e.currentTarget.id.slice(-2);
    savedChapterYearLengths[yearNumber - 1] = e.currentTarget.value;
    localStorage.setItem("chapterYearLengths", JSON.stringify(savedChapterYearLengths));
    updateProgressBecauseSettingsChanged();
  });

  var chapterMonthInputs = $('.monthsInput');
  chapterMonthInputs.on('input',function(e){
    var savedChapterMonthLengths = JSON.parse(localStorage.getItem("chapterMonthLengths"));
    monthNumber = e.currentTarget.id.slice(-2);
    savedChapterMonthLengths[monthNumber - 2] = e.currentTarget.value;
    localStorage.setItem("chapterMonthLengths", JSON.stringify(savedChapterMonthLengths));
    updateProgressBecauseSettingsChanged();
  });
}

function loadTextFields()
{
  var idealDeathInput = $('#idealDeathInput');
  var idealDeathYears = localStorage.idealDeathYears || 78;
  if( !localStorage.idealDeathYears ) {
    localStorage.idealDeathYears = 78;
  }
  idealDeathInput.val(idealDeathYears);

  $('#idealDeathInput').on('focusin', function(){
    $(this).data('val', $(this).val());
  });

  idealDeathInput.on('input',function(e){
    var idealDeath = $(this).val();
    if( idealDeath > 200 )
    {
      var prev = $(this).data('val');
      if( prev ) {
        $(this).val(prev);
      }
    }
    else
    {
      localStorage.idealDeathYears = idealDeath;
      updateProgressBecauseSettingsChanged();
      $(this).data('val', $(this).val());
    }
  });

  var timerTitleInput = $("#timerTitleInput");
  var timerTitleInput2 = $("#timerTitleInput2");
  var timerTitle = localStorage.timerTitle || "";
  timerTitleInput.val(timerTitle);
  timerTitleInput2.val(timerTitle);

  timerTitleInput.on('input',function(e){
    localStorage.timerTitle = $(this).val();
    timerTitleInput2.val($(this).val());
    updateTimer();
  });

  timerTitleInput2.on('input',function(e){
    localStorage.timerTitle = $(this).val();
    timerTitleInput.val($(this).val());
    updateTimer();
  });
}

function loadDOB()
{
  var dobDate = getDOB();
  var dobDateInput = $("#dobInput");
  dobDateInput.val(dobDate.yyyymmdd());

  $('#dobInput').on('focusin', function(){
      $(this).data('val', $(this).val());
  });

  dobDateInput.on('input',function(e){
    var dobDateInputDOM = document.getElementById("dobInput");
    if( !dobDateInputDOM.valueAsDate) {
      var prev = $(this).data('val');
      if( prev ) {
        $(this).val(prev);
      }
      else {
        var newDate = new Date();
        localStorage.dob = newDate.getTime();
      }
    }
    else {
      if( !$('#main').data('sidePanelOpened') ) {
        $(document).ready(function () {
        $('#theSidePanel').prop("pointer-events","all");
        $(":input").not("[id=dobInput]")
            .prop("disabled", false);
        });

        $("#onboardingText").fadeOut(400);
        $("#fadedForeground").fadeOut(400);
        $("#dobDateContainer").toggleClass('red notRed');
        $("#dobLabel").css("color","black");
        $('#main').data('sidePanelOpened', true);
      }
      var dobDateFromInput = dobDateInputDOM.valueAsDate;
      var newDOBDate = dobDateFromInput.getTime()+(dobDateFromInput.getTimezoneOffset() * 60000);
      localStorage.dob = newDOBDate;
      window.app.dob = new Date(newDOBDate);
      $(this).data('val', $(this).val());
    }
    updateTimer();

    updateProgressBecauseSettingsChanged()
  });

  // window.app.dobMinutes = localStorage.dobMinutes || 0;
  var dobMinutes = localStorage.dobMinutes || 0;
  var dobTimeInput = $("#dobTimeInput");
  dobTimeInput.val(getTimeStringFromMinutes(dobMinutes));

  dobTimeInput.on('input',function(e){
    var dobTimeInputDOM = document.getElementById("dobTimeInput");
    if( !dobTimeInputDOM.valueAsDate ) {
      localStorage.dobMinutes = 0;
    }
    else {
      var timeArray = dobTimeInputDOM.value.split(":");
      var newDOBTime = timeArray[0]*60 + timeArray[1]*1;
      localStorage.dobMinutes = newDOBTime;
      window.app.dobMinutes = newDOBTime;
    }
    updateTimer();
  });
}

function loadDOD()
{
  updateTimer();
  var dodDate = getDOD();
  var dodDateInput = $("#dodInput");
  dodDateInput.val(dodDate.yyyymmdd());

  $('#dodInput').on('focusin', function(){
    $(this).data('val', $(this).val());
  });

  dodDateInput.on('input',function(e){
    var dodDateInputDOM = document.getElementById("dodInput");
    if( !dodDateInputDOM.valueAsDate) {
      var prev = $(this).data('val');
      if( prev ) {
        $(this).val(prev);
      }
      else {
        var newDate = new Date();
        localStorage.dod = newDate.getTime();
      }
    }
    else {
      var dodDateFromInput = dodDateInputDOM.valueAsDate;
      localStorage.setItem("dod", dodDateFromInput.getTime()+(dodDateFromInput.getTimezoneOffset() * 60000));
      $(this).data('val', $(this).val());
    }
    updateTimer();
  });

  // window.app.dobMinutes = localStorage.dobMinutes || 0;
  var dodMinutes = localStorage.dodMinutes || 0;
  var dodTimeInput = $("#dodTimeInput");
  dodTimeInput.val(getTimeStringFromMinutes(dodMinutes));

  dodTimeInput.on('input',function(e){
    var dodTimeInputDOM = document.getElementById("dodTimeInput");
    if( !dodTimeInputDOM.valueAsDate ) {
      localStorage.dodMinutes = 0;
    }
    else {
      var timeArray = dodTimeInputDOM.value.split(":");
      localStorage.dodMinutes = timeArray[0]*60 + timeArray[1]*1;
    }
    updateTimer();
  });
}

function updateProgressBecauseSettingsChanged()
{
  window.app.generateLifeProgress();

  if(localStorage.getItem("shape") == "square") {
    $('.circle').css('borderRadius',0);
  }
  else {
    $('.circle').css('borderRadius','50%');
  }
  updateProgressIntervalsAndSize();
  updateProgressUnit();
}

function updateTimer()
{
  window.app.initializeTimer();
  if( localStorage.largeFont == "YES" )
  {
    $('#timerTitle').css('font-size','3.5vw');
    $('.timer').css('font-size','4.5vw');
    $('.decimal-timer').css('font-size','1.8vw');
    $('.clock').css('font-size','5.5vw');
    $('.timeup').css('font-size','5.5vw');
    $('.timer-label').css('font-size','1.2vw');
  }
  else {
    $('#timerTitle').css('font-size','3vw');
    $('.timer').css('font-size','4vw');
    $('.decimal-timer').css('font-size','1.5vw');
    $('.clock').css('font-size','5vw');
    $('.timeup').css('font-size','5vw');
    $('.timer-label').css('font-size','1.1vw');
  }

  $('.timerContainer').css('left','75%');
  $('#timerTitle').css('left','75vw');
}
