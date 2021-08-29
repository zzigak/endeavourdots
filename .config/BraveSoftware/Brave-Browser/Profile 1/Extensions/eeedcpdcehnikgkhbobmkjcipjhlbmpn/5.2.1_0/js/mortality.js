(function(){

  var dayMS = 86400000;
  var hourMS = 3600000;
  var minuteMS = 60000;
  var secondMS = 1000;
  var numberOfDigits = 3;

  var App = function(appElement)
  {
    this.appElement = appElement;
    this.load();
    this.initializeTimer();
  };

  App.fn = App.prototype;

  App.fn.versionCheck = function()
  {
    if(localStorage.getItem("version") != "5.2.1") {
      document.getElementById("updateBadge").style.display = "block";
      if( localStorage.hideUpdates != "YES" )
      {
        $("#update-bubble").show();
      }
    }
    else
    {
      document.getElementById("updateBadge").style.display = "none";
      $("#update-bubble").hide();
    }
  }

  App.fn.load = function()
  {
    this.dob = getDOB();
    if( this.dob.dst() )
    {
      this.dob.setHours(this.dob.getHours()+1);
    }
    this.dobMinutes = localStorage.dobMinutes || 0;

    this.generateLifeProgress();

    setInterval(updateProgressUnit(),7200000);

    if( localStorage.getItem("hideProgress") == "YES" )
    {
      $('#circles').css('opacity',0);
    }

    $('head').append('<style id="largeFontClockCSS" type="text/css">.clock {font-size:7vw;}</style>');
    $(document).ready(function () {
      if( localStorage.largeFont == "YES" )
      {
        $("#timerTitle").css('font-size',"4.5vw");
        $(".timer-label").css('font-size',"1.6vw");
        $(".timer, .timeup").css('font-size',"7vw");
        $(".clock").css('font-size',"8vw");
        $('#largeFontClockCSS').text('.clock {font-size:8vw;}');
      }
    });

    this.versionCheck();
  };

  function processStringFromMoments(unitOfMeasurement, originalStartMoment, endMoment, numberOfDigits){ 
    var differenceInUnits = endMoment.diff(originalStartMoment, unitOfMeasurement, true);
    var intDifferenceInUnits = Math.floor(differenceInUnits);
    var decimal = differenceInUnits - intDifferenceInUnits;
    decimal = decimal.toFixed(numberOfDigits);
    var decimalString = decimal.toString();
    var intString = zeroFill(intDifferenceInUnits.toString(), 2);
    return [intString, decimalString];
  }

  App.fn.initializeTimer = function()
  {
    var savedTheme = localStorage.getItem("colorTheme");
    var whiteFlag, blackFlag;
    if( savedTheme == "light" || savedTheme == "rainbowl" || savedTheme == "sky" )
    {
      document.body.style.backgroundColor = "#F5F5F5";
      document.body.style.color = "#424242";
      document.querySelector("#menu-button").className = "BlackMenu";
      whiteFlag = "YES";
    }
    else
    {
      document.body.style.backgroundColor = "#1d1d1d";
      document.body.style.color = "#eff4ff";
      document.querySelector("#menu-button").className = "WhiteMenu";
      blackFlag = "YES";
    }

    var app = $('#app');
    clearInterval(app.data("clockIntervalID"));
    app.removeData("clockIntervalID");
    clearInterval(app.data("timeSpentIntervalID"));
    app.removeData("timeSpentIntervalID");
    clearInterval(app.data("populationIntervalID"));
    app.removeData("populationIntervalID");
    clearInterval(app.data("timeUpMessageIntervalID"));
    app.removeData("timeUpMessageIntervalID");
    if( localStorage.timerSetting == "hide" )
    {
      this.setAppElementHTML("<br>");
      return;
    }
    else if( localStorage.timerSetting == "clock" )
    {
      this.renderClock();
      var renderTime = secondMS;
      if( localStorage.clockPrecision == "ms" ) {
        renderTime = 113;
      }

      app.data("clockIntervalID", setInterval(this.renderClock.bind(this),renderTime));

      return;
    }
    else if( localStorage.timerSetting == "population" )
    {
      this.renderPopulation();
      var renderTime = 1000;
      if( localStorage.populationPrecision == "one" ) {
        renderTime = 250;
      }

      app.data("populationIntervalID", setInterval(this.renderPopulation.bind(this),renderTime));

      return;
    }
    else
    {
      var duration, startMoment, endMoment;
      var currentMoment = moment();
      var birthMoment = moment(this.dob);
      birthMoment.add(parseInt(this.dobMinutes),"minutes");
      var interval = minuteMS;
      var savedPrecision = localStorage.getItem("timerPrecision");
      if( savedPrecision == "sec" )
      {
        interval = secondMS;
      }
      else if( savedPrecision == "ms" || savedPrecision == "decimal" || savedPrecision === null )
      {
        interval = 113;
      }

      if( localStorage.timerSetting == "left" )
      {
        this.deathDate = getDOD();
        if (localStorage.surveyDOD != "YES")
        {
          this.dodMinutes = localStorage.dodMinutes || 0;
          this.deathDate.setMinutes(parseInt(this.dodMinutes));
        }
        else
        {
          this.deathDate = new Date(this.dob.getTime());

          var ageDiffMS = Date.now() - this.dob.getTime();
          var ageDate = new Date(ageDiffMS);
          var ageYears = Math.abs(ageDate.getUTCFullYear() - 1970);

          //https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy
          var yearOffset = 79.3;
          var surveyGender = localStorage.getItem("surveyGender");
          if( surveyGender == "male" )
          {
            yearOffset -= 2.4;
          }
          else if( surveyGender == "female" )
          {
            yearOffset += 2.3;
          }

          //http://kff.org/other/state-indicator/life-expectancy-by-re/?currentTimeframe=0&selectedRows=%7B%22wrapups%22:%7B%22united-states%22:%7B%7D%7D%7D&sortModel=%7B%22colId%22:%22Location%22,%22sort%22:%22asc%22%7D
          var surveyEthnicity = localStorage.getItem("surveyEthnicity");
          if( surveyEthnicity == "white" )
          {
            yearOffset -= 0.4;
          }
          else if( surveyEthnicity == "black" )
          {
            yearOffset -= 4.7;
          }
          else if( surveyEthnicity == "latino" )
          {
            yearOffset += 3.5;
          }
          else if( surveyEthnicity == "asian" )
          {
            yearOffset += 7.2;
          }
          else if( surveyEthnicity == "native")
          {
            yearOffset -= 2.4;
          }

          //https://www.myabaris.com/tools/life-expectancy-calculator-how-long-will-i-live/results?id=eyJnZW5kZXIiOiJNQUxFIiwicmFjZSI6IldISVRFIiwiaGVpZ2h0Ijo1LjU4MzMzLCJjdXJyZW50X2FnZSI6NjAsIndlaWdodCI6MTUwLCJlZHVjYXRpb24iOiJfOF9UT18xMSIsIm1hcml0YWxfc3RhdHVzIjoiTUFSUklFRCIsImluY29tZSI6IjQwTUlOVVMiLCJpbmNvbWVTdGF0dXMiOiJXT1JLSU5HIiwiZXhlcmNpc2UiOiJfMV9UT18yX1BFUl9XRUVLIiwiaGVhbHRoIjoiR09PRCIsImRpYWJldGVzIjpmYWxzZSwiYWxjb2hvbCI6Il9MVF8xX1BFUl9EQVkiLCJzbW9raW5nIjoiTk9OX1NNT0tFUiIsInVzX3VuaXRzIjp0cnVlLCJvcHRJbiI6ZmFsc2UsInNtb2tpbmdTdGF0dXMiOiJORVZFUl9TTU9LRUQiLCJzbW9raW5nUXVpdCI6bnVsbCwic21va2luZ0Ftb3VudCI6bnVsbCwiaGVpZ2h0X3R5cGUiOiJJTVBFUklBTCIsIndlaWdodF90eXBlIjoiSU1QRVJJQUwifQ&lc_r=y
          var surveyDrinking = localStorage.getItem("surveyDrinking");
          if( surveyDrinking == "monthly" )
          {
            yearOffset += 1.6;
          }
          else if( surveyDrinking == "weekly" )
          {
            yearOffset += 1.9;
          }
          else if( surveyDrinking == "daily" )
          {
            yearOffset += 1.2;
          }
          else if( surveyDrinking == "alcoholic" )
          {
            yearOffset -= 3.2;
          }
          else if( surveyDrinking == "never" )
          {
            yearOffset += 0;
          }

          var surveySmoking = localStorage.getItem("surveySmoking");
          if( surveySmoking == "drinking" )
          {
            surveySmoking = surveyDrinking;
          }
          if( surveySmoking == "monthly" )
          {
            yearOffset -= 5.6;
          }
          else if( surveySmoking == "weekly" )
          {
            yearOffset -= 7.7;
          }
          else if( surveySmoking == "daily" )
          {
            yearOffset -= 9.8;
          }
          else if( surveySmoking == "alcoholic" )
          {
            yearOffset -= 13;
          }
          else if( surveySmoking == "never" )
          {
            yearOffset += 0;
          }
          else if( surveySmoking == "marijuana" )
          {
            //http://www.marijuanadetoxguide.com/life-expectancy-of-smokers-how-soon-before-weed-kills-you/
            yearOffset += 2;
          }

          //https://www.myabaris.com/tools/life-expectancy-calculator-how-long-will-i-live
          var surveyExercise = localStorage.getItem("surveyExercise");
          if( surveyExercise == "never" )
          {
            yearOffset += 0;
          }
          else if( surveyExercise == "rarely" )
          {
            yearOffset += 1.1;
          }
          else if( surveyExercise == "onetwo" )
          {
            yearOffset += 2.5;
          }
          else if( surveyExercise == "threefour" )
          {
            yearOffset += 3.0;
          }
          else if( surveyExercise == "fiveplus" )
          {
            yearOffset += 3.0;
          }

          //https://www.ncbi.nlm.nih.gov/books/NBK62367/
          var surveyHeightFeet = parseInt(localStorage.getItem("surveyHeightFeet"));
          var surveyHeightInches = parseInt(localStorage.getItem("surveyHeightInches"));
          var surveyWeight = parseInt(localStorage.getItem("surveyWeight"));
          surveyHeightInches += surveyHeightFeet*12;
          var surveyWeightKG = surveyWeight*0.45;
          var surveyHeightCMSquared = (surveyHeightInches*0.025)*(surveyHeightInches*0.025);
          if( localStorage.surveyUnitsMetric == "YES") {
            surveyWeightKG = localStorage.surveyWeightKG;
            var surveyHeightMeters = Number(localStorage.surveyHeightMeters)+(localStorage.surveyHeightCM/100);
            surveyHeightCMSquared = surveyHeightMeters*surveyHeightMeters;
          }
          var BMI = surveyWeightKG/surveyHeightCMSquared;
          if( BMI < 18.5 )
          {
            yearOffset -= (((18.5 - BMI)/10)*1.5);
          }
          else if( BMI >= 18.5 && BMI <= 25 )
          {
            yearOffset += 0;
          }
          else if( BMI > 25 && BMI <= 30 )
          {
            yearOffset -= ((((BMI+5)-30)/5)*0.5);
          }
          else if( BMI > 30 && BMI <= 35 )
          {
            yearOffset -= ((((BMI+5)-35)/5)*1);
          }
          else if( BMI > 35 && BMI <= 40 )
          {
            yearOffset -= ((((BMI+5)-40)/5)*3);
          }
          else if( BMI > 40 && BMI <= 55 )
          {
            yearOffset -= ((((BMI+5)-55)/15)*7);
          }
          else if( BMI > 55 )
          {
            yearOffset -= 14;
          }

          //http://apps.who.int/gho/data/view.main.YLLRATEREG6AMRV
          if( localStorage.getItem("surveyHeartDisease") == "YES" )
          {
            yearOffset -= (ageYears/2)*0.077;
          }

          if( localStorage.getItem("surveyClumsiness") == "YES" )
          {
            yearOffset -= (ageYears/3)*0.055;
          }

          this.deathDate.setDate(this.deathDate.getDate() + Math.round(yearOffset*365));
          $("#deathDateString").html(this.deathDate.dateWithDay());
        }

        var deadlineMoment = moment(this.deathDate);

        if( localStorage.getItem("dailyCountdown") == "YES" && localStorage.surveyDOD != "YES" )
        {
          deadlineMoment = moment();
          var timeInput = localStorage.getItem("dodMinutes");
          if( timeInput === null )
          {
            deadlineMoment.hour(0);
            deadlineMoment.minute(0);
            deadlineMoment.second(0);
            deadlineMoment.day(deadlineMoment.day()+1);
          }
          else
          {
            var deadlineHours = Math.floor(timeInput/60);
            var deadlineMinutes = timeInput % 60;
            deadlineMoment.hour(deadlineHours);
            deadlineMoment.minute(deadlineMinutes);
            deadlineMoment.second(0);
            if( timeInput == 0 )
            {
              deadlineMoment.day(deadlineMoment.day()+1);
            }
          }
        }

        this.deadlineMoment = deadlineMoment;
        duration = deadlineMoment - currentMoment;
        if( duration <= 0 )
        {
          this.setAppElementHTML(this.getTemplateScript('timeup')({
            white: whiteFlag,
            black: blackFlag,
            message: localStorage.timeupMessage
          }));
          interval = secondMS;
          app.data("timeUpMessageIntervalID", setInterval(this.renderTimeUp.bind(this),interval));


          return;
        }
        startMoment = currentMoment;
        endMoment = deadlineMoment;
      }
      else
      {
        duration  = currentMoment - birthMoment;
        startMoment = birthMoment;
        endMoment = currentMoment;
      }

      app.data("timeSpentIntervalID", setInterval(this.renderAge.bind(this),interval));



      var savedPrecision = localStorage.getItem("timerPrecision");
      var largestPrecision = localStorage.largestPrecision;
      var originalStartMoment = startMoment.clone();
      //Initial state before the timer for renderer kicks

      var decimalString = "";

      while(true)
      {
        if( savedPrecision == "decimal" )
        {
          if ( localStorage.decimalPrecision == "YES" )
            numberOfDigits = 10;
          else
            numberOfDigits = 3;

          if( largestPrecision == "year" ) {
            var stringArray = processStringFromMoments("years", originalStartMoment, endMoment, numberOfDigits);
            var yearString = stringArray[0];
            var decimalString = stringArray[1];
          }
          else if( largestPrecision == "month" ) {
            var stringArray = processStringFromMoments("months", originalStartMoment, endMoment, numberOfDigits);
            var monthString = stringArray[0];
            var decimalString = stringArray[1];
          }
          else if( largestPrecision == "day" ) {
            var stringArray = processStringFromMoments("days", originalStartMoment, endMoment, numberOfDigits);
            var dayString = stringArray[0];
            var decimalString = stringArray[1];
          }
          else if( largestPrecision == "hour" ) {
            var stringArray = processStringFromMoments("hours", originalStartMoment, endMoment, numberOfDigits);
            var hourString = stringArray[0];
            var decimalString = stringArray[1];
          }
          else if( largestPrecision == "min" ) {
            var stringArray = processStringFromMoments("minutes", originalStartMoment, endMoment, numberOfDigits);
            var minuteString = stringArray[0];
            var decimalString = stringArray[1];
          }
          else if( largestPrecision == "sec" ) {
            var stringArray = processStringFromMoments("seconds", originalStartMoment, endMoment, numberOfDigits);
            var secondString = stringArray[0];
            var decimalString = stringArray[1];
          }
          break;
        }
        var years = endMoment.diff(startMoment, 'years');
        startMoment.add(years, 'years');
        if( years < 0 ) years = 0;
        if(savedPrecision == "decimal")
          years = years.toFixed(numberOfDigits);
        var yearString = zeroFill(years.toString(), 2);
        if (savedPrecision == "year") {
          break;
        }

        var months = endMoment.diff(startMoment, 'months');
        var monthIndexOffset = months;
        if( months < 0 ) months = 0;
        if( largestPrecision == "month" )
        {
          yearString = undefined;
          months += years*12;
        }

        var monthString = zeroFill(months.toString(), 2);
        if (savedPrecision == "month") {
          break;
        }
        var days = endMoment.diff(startMoment, 'days');

        if( months > 0 )
        {
          for( indexOffset = 0; indexOffset != monthIndexOffset; indexOffset++ )
          {
            var currentIndexMonthDays = startMoment.daysInMonth();
            days -= currentIndexMonthDays;
            startMoment.month(startMoment.month()+1);
          }
        }
        if( days < 0 ) days = 0;
        if( largestPrecision == "day" )
        {
          yearString = undefined;
          monthString = undefined;
          days = endMoment.diff(originalStartMoment, 'days');
        }
        var dayString = zeroFill(days.toString(), 2);
        if (savedPrecision == "day") {
          break;
        }

        duration = (duration % dayMS);
        var hours = Math.floor(duration / hourMS);
        if( hours < 0 ) hours = 0;
        if( largestPrecision == "hour" )
        {
          yearString = undefined;
          monthString = undefined;
          dayString = undefined;
          hours = endMoment.diff(originalStartMoment, 'hours');
        }
        var hourString = zeroFill(hours.toString(), 2);
        if (savedPrecision == "hour") {
          break;
        }
        duration = (duration % hourMS);
        var minutes = Math.floor(duration / minuteMS);
        if( minutes < 0 ) minutes = 0;
        if( largestPrecision == "min" )
        {
          yearString = undefined;
          monthString = undefined;
          dayString = undefined;
          hourString = undefined;
          minutes = endMoment.diff(originalStartMoment, 'minutes');
        }
        var minuteString = zeroFill(minutes.toString(), 2);
        if (savedPrecision == "min") {
          break;
        }
        duration = (duration % minuteMS);
        var seconds = Math.floor(duration / secondMS);
        if( seconds < 0 ) seconds = 0;
        if( largestPrecision == "sec" )
        {
          yearString = undefined;
          monthString = undefined;
          dayString = undefined;
          hourString = undefined;
          minuteString = undefined;
          seconds = endMoment.diff(originalStartMoment, 'seconds');
        }
        var secondString = zeroFill(seconds.toString(), 2);
        if (savedPrecision == "sec") {
          break;
        }
        duration = (duration % secondMS);
        var milliseconds = Math.floor(duration / 10);
        if( milliseconds < 0 ) milliseconds = 0;
        var msString = zeroFill(milliseconds.toString(), 2);
        break;
      }

      var timerTitle = localStorage.timerTitle;
      this.setAppElementHTML(this.getTemplateScript('age')(
      {
        white: whiteFlag,
        black: blackFlag,
        title: timerTitle,
        year: yearString,
        month: monthString,
        day: dayString,
        hour: hourString,
        minute: minuteString,
        second: secondString,
        ms: msString,
        decimal: decimalString.substring(1),
      }));
    }
  };

  App.fn.generateLifeProgress = function()
  {
    $('#circles').empty();
    var chaptersArray = getChapters();

    this.documentCircle = document.querySelector('#circles');

    var startMoment = moment(getDOB());
    var endMoment = moment();
    if( localStorage.getItem("chapterPrecision") === null ){
      localStorage.setItem("chapterPrecision", "months");
    }
    var chapterPrecision = localStorage.chapterPrecision;
    var numberMonths = endMoment.diff(startMoment, chapterPrecision)+1;
    if( chapterPrecision == "weeks" )
    {
      var numberDays = endMoment.diff(startMoment, "days");
      var numberYears = endMoment.diff(startMoment, "years");
      var leapDays = Math.floor(numberYears / 4);
      var weekOffset = numberYears + leapDays; //there is 52 weeks + 1 day in each year
      var numberDaysOffset = numberDays - weekOffset;
      numberMonths = (numberDaysOffset/7);
      if( numberDaysOffset%7 == 0 )
      {
        numberMonths+=1;
      }
    }

    for (var chapter = 0; chapter < chaptersArray.length; chapter++) {
      var startMonth = chaptersArray[chapter][0] + 1;
      var endMonth = chaptersArray[chapter][1];
      var bkgdColor = getColorTheme()[chapter];

      var x;
      if( numberMonths > endMonth ) {
        for(x = startMonth ; x <= endMonth ; x++) {
          this.createCircle(bkgdColor, '1.00');
        }
      }
      else if( numberMonths > (startMonth-1) && numberMonths <= endMonth ){
        for(x = startMonth ; x < numberMonths ; x++) {
          this.createCircle(bkgdColor, '1.00');
        }

        var progressUnit = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        progressUnit.setAttribute("class","pie");
        progressUnit.setAttribute("opacity","1.0");
        progressUnit.id = 'progressUnit';

        var progressBackground;
        var progressForeground;
        if(localStorage.getItem("shape") == "square") {
          progressBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          progressForeground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        }
        else {
          progressBackground = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          progressForeground = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        }
        progressBackground.id = 'progressBackground';
        progressBackground.setAttribute("fill", bkgdColor);
        progressBackground.setAttribute("fill-opacity","0.25");
        progressForeground.setAttribute("fill",bkgdColor);
        progressForeground.id = 'progressForeground';
        progressUnit.appendChild(progressBackground);
        progressUnit.appendChild(progressForeground);
        this.documentCircle.appendChild(progressUnit);

        for(x = (numberMonths+1) ; x <= endMonth ; x++) {
          this.createCircle(bkgdColor, '0.25');
        }
      }
      else
      {
        for(x = startMonth ; x <= endMonth ; x++) {
          this.createCircle(bkgdColor, '0.25');
        }
      }
    }
  };

  App.fn.createCircle = function(bkgdColor, opacity) {
    var circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.backgroundColor = bkgdColor;
    circle.style.opacity = opacity;
    this.documentCircle.appendChild(circle);
  };

  App.fn.renderTimeUp = function()
  {
    var timeup = document.getElementById('white-timeup');
    if( !timeup )
    {
      timeup = document.getElementById('black-timeup');
    }
    this.bubbleNumber(timeup, 1.05);
  };

  App.fn.renderAge = function()
  {
    var duration, startMoment, endMoment;
    var currentMoment = moment();
    var deadlineMoment = this.deadlineMoment;
    var birthMoment = moment(this.dob);
    birthMoment.add(parseInt(this.dobMinutes),"minutes");
    if( localStorage.timerSetting == "left" )
    {
      if( typeof deadlineMoment == 'undefined' ) {
        return;
      }
      duration = deadlineMoment - currentMoment;
      if( duration <= 0 )
      {
        location.reload();
        return;
      }
      startMoment = currentMoment;
      endMoment = deadlineMoment;
    }
    else
    {
      duration  = currentMoment - birthMoment;
      startMoment = birthMoment;
      endMoment = currentMoment;
    }

    var savedPrecision = localStorage.getItem("timerPrecision");
    var largestPrecision = localStorage.largestPrecision;
    var originalStartMoment = startMoment.clone();
    var decimalString = "";

    while(true)
    {
      if( savedPrecision == "decimal" )
      {
        if ( localStorage.decimalPrecision == "YES" )
          numberOfDigits = 10;
        else
          numberOfDigits = 3;

          if( largestPrecision == "year" ) {
            var stringArray = processStringFromMoments("years", originalStartMoment, endMoment, numberOfDigits);
            var yearString = stringArray[0];
            var decimalString = stringArray[1];
          }
          else if( largestPrecision == "month" ) {
            var stringArray = processStringFromMoments("months", originalStartMoment, endMoment, numberOfDigits);
            var monthString = stringArray[0];
            var decimalString = stringArray[1];
          }
          else if( largestPrecision == "day" ) {
            var stringArray = processStringFromMoments("days", originalStartMoment, endMoment, numberOfDigits);
            var dayString = stringArray[0];
            var decimalString = stringArray[1];
          }
          else if( largestPrecision == "hour" ) {
            var stringArray = processStringFromMoments("hours", originalStartMoment, endMoment, numberOfDigits);
            var hourString = stringArray[0];
            var decimalString = stringArray[1];
          }
          else if( largestPrecision == "min" ) {
            var stringArray = processStringFromMoments("minutes", originalStartMoment, endMoment, numberOfDigits);
            var minuteString = stringArray[0];
            var decimalString = stringArray[1];
          }
          else if( largestPrecision == "sec" ) {
            var stringArray = processStringFromMoments("seconds", originalStartMoment, endMoment, numberOfDigits);
            var secondString = stringArray[0];
            var decimalString = stringArray[1];
          }
        break;
      }

      var years = endMoment.diff(startMoment, 'years');
      startMoment.add(years, 'years');
      if( years < 0 ) years = 0;
      if(savedPrecision == "decimal")
        years = years.toFixed(numberOfDigits);
      var yearString = zeroFill(years.toString(), 2);
      if (savedPrecision == "year") {
        break;
      }

      var months = endMoment.diff(startMoment, 'months');
      var monthIndexOffset = months;
      if( months < 0 ) months = 0;
      if( largestPrecision == "month" )
      {
        yearString = undefined;
        months += years*12;
      }
      var monthString = zeroFill(months.toString(), 2);
      if (savedPrecision == "month") {
        break;
      }
      var days = endMoment.diff(startMoment, 'days');

      if( months > 0 )
      {
        for( indexOffset = 0; indexOffset != monthIndexOffset; indexOffset++ )
        {
          var currentIndexMonthDays = startMoment.daysInMonth();
          days -= currentIndexMonthDays;
          startMoment.month(startMoment.month()+1);
        }
      }
      if( days < 0 ) days = 0;
      if( largestPrecision == "day" )
      {
        yearString = undefined;
        monthString = undefined;
        days = endMoment.diff(originalStartMoment, 'days');
      }
      var dayString = zeroFill(days.toString(), 2);
      if (savedPrecision == "day") {
        break;
      }

      duration = (duration % dayMS);
      var hours = Math.floor(duration / hourMS);
      if( hours < 0 ) hours = 0;
      if( largestPrecision == "hour" )
      {
        yearString = undefined;
        monthString = undefined;
        dayString = undefined;
        hours = endMoment.diff(originalStartMoment, 'hours');
      }
      var hourString = zeroFill(hours.toString(), 2);
      if (savedPrecision == "hour") {
        break;
      }
      duration = (duration % hourMS);
      var minutes = Math.floor(duration / minuteMS);
      if( minutes < 0 ) minutes = 0;
      if( largestPrecision == "min" )
      {
        yearString = undefined;
        monthString = undefined;
        dayString = undefined;
        hourString = undefined;
        minutes = endMoment.diff(originalStartMoment, 'minutes');
      }
      var minuteString = zeroFill(minutes.toString(), 2);
      if (savedPrecision == "min") {
        break;
      }
      duration = (duration % minuteMS);
      var seconds = Math.floor(duration / secondMS);
      if( seconds < 0 ) seconds = 0;
      if( largestPrecision == "sec" )
      {
        yearString = undefined;
        monthString = undefined;
        dayString = undefined;
        hourString = undefined;
        minuteString = undefined;
        seconds = endMoment.diff(originalStartMoment, 'seconds');
      }
      var secondString = zeroFill(seconds.toString(), 2);
      if (savedPrecision == "sec") {
        break;
      }
      duration = (duration % secondMS);
      var milliseconds = Math.floor(duration / 10);
      if( milliseconds < 0 ) milliseconds = 0;
      var msString = zeroFill(milliseconds.toString(), 2);
      break;
    }

    var notBubbled = true;

    if( savedPrecision == "decimal" )
    {
      notBubbled = false;
    }

    var year = document.getElementById('year-number');
    if(year) {
      var yearFlag = year.innerHTML != yearString;
    }
    if(yearFlag) {
      year.innerHTML = yearString;
      if(notBubbled) {
        this.bubbleNumber(year, 2.1);
        notBubbled = false;
      }
    }

    var month = document.getElementById('month-number');
    if(month) {
      var monthFlag = month.innerHTML != monthString;
    }
    if(monthFlag) {
      month.innerHTML = monthString;
      if(notBubbled) {
        this.bubbleNumber(month, 1.9);
        notBubbled = false;
      }
    }

    var day = document.getElementById('day-number');
    if(day) {
      var dayFlag = day.innerHTML != dayString;
    }
    if(dayFlag) {
      day.innerHTML = dayString;
      if(notBubbled) {
        this.bubbleNumber(day, 1.7);
        notBubbled = false;
      }
    }

    var hour = document.getElementById('hour-number');
    if(hour) {
      var hourFlag = hour.innerHTML != hourString;
    }
    if(hourFlag) {
      hour.innerHTML = hourString;
      if(notBubbled) {
        this.bubbleNumber(hour, 1.5);
        notBubbled = false;
      }
    }

    var minute = document.getElementById('minute-number');
    if(minute) {
      var minuteFlag = minute.innerHTML != minuteString;
    }
    if(minuteFlag) {
      minute.innerHTML = minuteString;
      if(notBubbled) {
        this.bubbleNumber(minute, 1.3);
        notBubbled = false;
      }
    }

    var second = document.getElementById('second-number');
    if(second) {
      second.innerHTML = secondString;
    }

    var millisecond = document.getElementById('milli-number');
    if(millisecond) {
      millisecond.innerHTML = msString;
    }

    var decimalElement = document.getElementById('decimal-number');
    decimalElement.innerHTML = decimalString.substring(1);

  };


  App.fn.bubbleNumber = function(numberElement, scale)
  {
    requestAnimationFrame(function()
    {
      numberElement.style.webkitTransition=".1s ease-in-out";
      numberElement.style.webkitTransform="scale("+scale.toString()+")";
      setTimeout(function(){
        numberElement.style.webkitTransition=".8s ease-in-out";
        numberElement.style.webkitTransform="scale(1)";
      }, 80);
    }.bind(this));
  }


  App.fn.renderPopulation = function()
  {
    var precision = 1;
    if( localStorage.populationPrecision == "ten" ) {
      precision = 10;
    }
    else if( localStorage.populationPrecision == "hund" ) {
      precision = 100;
    }
    else if( localStorage.populationPrecision == "thou" ) {
      precision = 1000;
    }
    else if( localStorage.populationPrecision == "tenthou" ) {
      precision = 10000;
    }
    else if( localStorage.populationPrecision == "hundthou" ) {
      precision = 100000;
    }
    else if( localStorage.populationPrecision == "milo" ) {
      precision = 1000000;
    }

    var dob = getDOB();
    var yearBorn = dob.getFullYear();
    var currentYear = new Date().getFullYear();

    var startBirthYear = new Date(yearBorn, 0, 1),
        endBirthYear = new Date(yearBorn+1, 0, 1);
    var percentageBirthYearPassed = (dob - startBirthYear) / (endBirthYear - startBirthYear);

    var start = new Date(currentYear, 0, 1),
        end = new Date(currentYear+1, 0, 1),
        today = new Date();
    var percentageYearPassed = (today - start) / (end - start);

    var populationString;
    if( localStorage.populationOption == "YOUNGER" )
    {
      var populationYounger = 0;
      populationYounger += Math.round(getBirthRateValue(yearBorn) * percentageBirthYearPassed);
      yearBorn++;

      while( yearBorn < currentYear ) {
        populationYounger += getBirthRateValue(yearBorn);
        yearBorn++;
      }

      populationYounger += Math.round(getBirthRateValue(currentYear) * percentageYearPassed);
      populationYounger = Math.ceil(populationYounger/precision)*precision;

      populationString = numberWithCommas(populationYounger);
    }
    else if( localStorage.populationOption == "OLDER" )
    {
      var differenceToFirstYear = getPopulationValue(yearBorn+1) - getPopulationValue(yearBorn);
      var populationOlder = getPopulationValue(yearBorn) + (differenceToFirstYear*percentageBirthYearPassed);
      var deaths = 0;
      while( yearBorn < currentYear ) {
        var yearPopulationDifference = getPopulationValue(yearBorn+1) - getPopulationValue(yearBorn);
        deaths = getBirthRateValue(yearBorn) - yearPopulationDifference;
        populationOlder -= deaths;
        yearBorn++;
      }

      populationOlder -= Math.round(deaths*percentageYearPassed);
      populationOlder = Math.ceil(populationOlder/precision)*precision;
      populationString = numberWithCommas(populationOlder);
    }
    else //Total Population
    {
      var totalPopulation = getPopulationValue(currentYear);
      var changeInCurrentYear = totalPopulation - getPopulationValue(currentYear-1);
      totalPopulation += Math.round(changeInCurrentYear* percentageYearPassed);
      totalPopulation = Math.ceil(totalPopulation/precision)*precision;
      populationString = numberWithCommas(totalPopulation);
    }
    var savedTheme = localStorage.getItem("colorTheme");
    if(savedTheme == "light" || savedTheme == "rainbowl" || savedTheme == "sky") {
      var whiteFlag = "YES";
    }
    else {
      var blackFlag = "YES";
    }

    requestAnimationFrame(function()
    {
      this.setAppElementHTML(this.getTemplateScript('clock')(
      {
        white: whiteFlag,
        black: blackFlag,
        ampm: populationString
      }));

      if( $('#main').data('sidePanelOpened') ) {
        if( localStorage.largeFont == "YES" )
        {
          $('.clock').css('font-size','5.5vw');
        }
        else
        {
          $('.clock').css('font-size','5vw');
        }
        $('.timerContainer').css('left','75%');
      }

    }.bind(this));
  };


  App.fn.renderClock = function()
  {
    var now = new Date();
    var ampmString = "AM";
    var hour = now.getHours();
    if( localStorage.twentyFour == "YES" )
    {
      ampmString = "";
    }
    else
    {
      if( hour > 11 ) {
        ampmString = "PM";
        hour = hour % 12;
      }
      if( hour == 0 ) {
        hour = 12;
      }
    }

    var hourString = "";
    var minuteString = "";
    var secondString = "";
    var msString = "";
    if( localStorage.clockPrecision == "hour" ) {
      hourString = zeroFill(hour.toString(), 2);
    }
    else if( localStorage.clockPrecision == "min" ) {
      hourString = zeroFill(hour.toString(), 2);
      minuteString = ":"+zeroFill(now.getMinutes().toString(), 2);
    }
    else if( localStorage.clockPrecision == "sec" ) {
      hourString = zeroFill(hour.toString(), 2);
      minuteString = ":"+zeroFill(now.getMinutes().toString(), 2);
      secondString = ":"+zeroFill(now.getSeconds().toString(), 2);
    }
    else if( localStorage.clockPrecision == "ms" ) {
      hourString = zeroFill(hour.toString(), 2);
      minuteString = ":"+zeroFill(now.getMinutes().toString(), 2);
      secondString = ":"+zeroFill(now.getSeconds().toString(), 2);
      msString = ":"+zeroFill(Math.floor((now.getMilliseconds())/10).toString(), 2);
    }

    var savedTheme = localStorage.getItem("colorTheme");
    if(savedTheme == "light" || savedTheme == "rainbowl" || savedTheme == "sky") {
      var whiteFlag = "YES";
    }
    else {
      var blackFlag = "YES";
    }

    requestAnimationFrame(function()
    {
      this.setAppElementHTML(this.getTemplateScript('clock')(
      {
        white: whiteFlag,
        black: blackFlag,
        hour: hourString,
        minute: minuteString,
        second: secondString,
        ms: msString,
        ampm: ampmString
      }));

      if( $('#main').data('sidePanelOpened') ) {
        if( localStorage.largeFont == "YES" )
        {
          $('.clock').css('font-size','5.5vw');
        }
        else
        {
          $('.clock').css('font-size','5vw');
        }
        $('.timerContainer').css('left','75%');
      }

    }.bind(this));
  };

  App.fn.setAppElementHTML = function(html){
    this.appElement.innerHTML = html;
  };

  App.fn.getTemplateScript = function(name){
    var templateElement = document.getElementById(name + '-template');
    return Handlebars.compile(templateElement.innerHTML);
  };

  window.app = new App(document.getElementById('app'))

})();












/*********************
// Window Functions
**********************/

function updateProgressIntervalsAndSize(newWidth)
{
  var rowIsYear = localStorage.rowIsYear == "YES";
  var width = $(window).width();
  if( $('#main').data('sidePanelOpened') ) {
    width *= 0.50;
  }
  if( localStorage.fullscreen != "YES" )
  {
    width -= 40;
  }

  if( newWidth > 0 ) {
    width = newWidth;
  }
  var heightPadding = 0;
  if( localStorage.fullscreen != "YES" )
  {
    heightPadding = 100;
  }
  var height = $(window).height() - heightPadding;

  var totalProgressUnits = localStorage.idealDeathYears;
  if( !totalProgressUnits ) totalProgressUnits = 78;
  var chapterPrecision = localStorage.chapterPrecision;
  var margin = 0;
  if( chapterPrecision == "weeks" ) {
    totalProgressUnits *= 52;
    margin = 0.5;
  }
  else if( chapterPrecision == "years" ) {
    margin = 3.0;
  }
  else {
    totalProgressUnits *= 12;
    margin = 2.0;
    if( rowIsYear )
    {
      margin = 0.5;
    }
  }
  if( localStorage.noChapterMargins == "YES" )
  {
    margin = 0;
  }

  $('.circle').css('margin','{0}px'.format(margin));
  $('.pie').css('margin','{0}px'.format(margin));

  var partsX = Math.ceil(Math.sqrt(totalProgressUnits*width/height));
  if( rowIsYear )
  {
    if( chapterPrecision == "weeks" ) {
      partsX = 52;
    }
    else if( chapterPrecision == "months" ) {
      partsX = 12;
    }
  }

  var sideX, sideY;
  if( Math.floor(partsX*height/width)*partsX < totalProgressUnits ) {
    sideX = height/Math.ceil(partsX*height/width);
  }
  else {
    sideX = width/partsX;
  }
  var partsY = Math.ceil(Math.sqrt(totalProgressUnits*height/width));
  if( rowIsYear )
  {
    partsY = Math.ceil(totalProgressUnits/partsX);
  }
  if( Math.floor(partsY*width/height)*partsY < totalProgressUnits ) {
    sideY = width/Math.ceil(width*partsY/height);
  }
  else {
    sideY = height/partsY;
  }
  var allocatedUnitSide = Math.max(sideX, sideY);
  if( rowIsYear )
  {
    allocatedUnitSide = Math.min(sideX, sideY);
  }

  allocatedUnitSide = Math.round(allocatedUnitSide);

  var widthMain = allocatedUnitSide * partsX;
  if( chapterPrecision == "years" )
  {
    allocatedUnitSide -= 1;
    widthMain = allocatedUnitSide*partsX;
  }

  allocatedUnitSide -= (margin*2);
  $('#circles').width(widthMain);

  $('.circle').css('width','{0}px'.format(allocatedUnitSide));
  $('.circle').css('height','{0}px'.format(allocatedUnitSide));
  $('.pie').css('width','{0}px'.format(allocatedUnitSide));
  $('.pie').css('height','{0}px'.format(allocatedUnitSide));
}

function updateProgressUnit()
{
  var radius = $(".pie").width()/2;
  var height = $(".pie").height();

  var endMoment = moment();
  var currentDate = endMoment.date();
  var startMoment = moment(getDOB());

  var chapterPrecision = localStorage.chapterPrecision;
  var differenceInDays;

  if( chapterPrecision == "weeks" )
  {
    differenceInDays = endMoment.diff(startMoment, "days");
    var numberYears = endMoment.diff(startMoment, "years");
    var leapDays = Math.floor(numberYears / 4);
    var weekOffset = numberYears + leapDays; //there is 52 weeks + 1 day in each year
    differenceInDays = (differenceInDays - weekOffset)%7;
  }
  else
  {
    var differenceInUnit = endMoment.diff(startMoment, chapterPrecision);
    startMoment.add(differenceInUnit, chapterPrecision);
    differenceInDays = endMoment.diff(startMoment, "days");
  }

  var denominator = 365;
  if( chapterPrecision == "months" )
  {
    denominator = 31;
  }
  else if( chapterPrecision == "weeks" )
  {
    denominator = 7;
  }

  var theta = -(differenceInDays/denominator)*360;

  var progressUnit = $('#progressUnit');
  if( progressUnit )
  {
    var progressBackground;
    var progressForeground;
    if (localStorage.getItem("shape") == "square")
    {
      progressBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      progressForeground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

      progressBackground.setAttribute("height", height);
      progressBackground.setAttribute("width", (2 * radius));
      var fraction = -theta/360;
      progressForeground.setAttribute("height", height);
      progressForeground.setAttribute("width", (fraction*(2*radius)));
    }
    else
    {
      progressBackground = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      progressForeground = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      progressBackground.setAttribute("cx", radius);
      progressBackground.setAttribute("cy", radius);
      progressBackground.setAttribute("r", radius);

      theta %= 360;
      var x = Math.sin(theta * Math.PI / 180) * radius;
      var y = Math.cos(theta * Math.PI / 180) * -radius;
      var d = 'M0,0 v' + -radius + ' A' + radius + ',' + radius + ' 1 ' + ((theta < -180) ? 1 : 0) + ',0 ' + x + ',' + y + 'z';
      progressForeground.setAttribute('d', d);
      progressForeground.setAttribute('transform', 'translate(' + radius + ',' + radius + ')');
    }

    var bkgdColor = $('#progressBackground').attr('fill')
    progressBackground.id = 'progressBackground';
    progressBackground.setAttribute("fill",bkgdColor);
    progressBackground.setAttribute("fill-opacity","0.25");
    progressForeground.id = 'progressForeground';
    progressForeground.setAttribute("fill",bkgdColor);

    $('#progressBackground').replaceWith(progressBackground);
    $('#progressForeground').replaceWith(progressForeground);
  }
}


(function() {
  window.onresize= function() {
    if(localStorage.getItem("shape") == "square") {
      $('.circle').css('borderRadius',0);
    }
    else {
      $('.circle').css('borderRadius','50%');
    }
    updateProgressIntervalsAndSize();
    updateProgressUnit();
  };
})();

(function($) {
    $(window).load(function () {
      if(localStorage.getItem("dob")===null)
      {
        $("#menu-button")[0].click();
      }
    });
})(jQuery);

(function() {
  [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
    new SelectFx(el);
  } );
})();

window.onresize();
