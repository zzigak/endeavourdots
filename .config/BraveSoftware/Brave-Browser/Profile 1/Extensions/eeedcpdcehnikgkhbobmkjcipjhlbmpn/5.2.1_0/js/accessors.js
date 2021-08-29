
function getDOB()
{
  var savedDoB = localStorage.getItem("dob");
  if( savedDoB === null) {
    return new Date();
  }
  else {
    return new Date(parseInt(savedDoB));
  }
}

function getDOD()
{
  var savedDOD = localStorage.getItem("dod");
  if( savedDOD === null) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    return new Date(year + 1, month, day)
  }
  else {
    return new Date(parseInt(savedDOD));
  }
}

function getChapters()
{
  var savedChapterLengths;
  var chapterPrecision = localStorage.chapterPrecision;
  var totalProgressUnits = localStorage.idealDeathYears;
  var multiplier = 1;
  if( chapterPrecision == "weeks" ) {
    multiplier = 52;
  }
  else if( chapterPrecision == "years" ) {
    multiplier = 1;
  }
  else {
    multiplier = 12;
  }
  totalProgressUnits *= multiplier;


  if( localStorage.fixedChapters == "YES" )
  {
    var years = localStorage.chapterPrecisionYear;
    if( typeof years === 'string' ) {
      years = parseInt(years);
    }
    var months = localStorage.chapterPrecisionMonth;
    if( typeof months === 'string' ) {
      months = parseInt(months);
    }
    savedChapterLengths = [];
    var iterations = Math.ceil(totalProgressUnits/years);
    for( var i=0; i<iterations; i++ )
    {
      savedChapterLengths.push(Math.floor((years+(months/12))*multiplier));
    }
  }

  else
  {
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

    savedChapterLengths = [savedChapterYearLengths[0]*multiplier];
    for( var j=0; j<savedChapterMonthLengths.length; j++ )
    {
      var years = savedChapterYearLengths[j+1];
      if( typeof years === 'string' ) {
        years = parseInt(years);
      }
      var months = savedChapterMonthLengths[j];
      if( typeof months === 'string' ) {
        months = parseInt(months);
      }
      savedChapterLengths.push(Math.floor((years+(months/12))*multiplier));
    }
  }

  var index = 0;
  var totalMonths = 0;
  for( index; index<savedChapterYearLengths; index++ ) {
    if((totalMonths+savedChapterLengths[index]) > totalProgressUnits) {
      savedChapterLengths[index] = (totalProgressUnits-totalMonths);
    }
    totalMonths += savedChapterLengths[index];
  }

  var beginningChapter = 0;
  var firstChapter = savedChapterLengths[0];
  var educationStartOffset = 0;
  var monthBorn = getDOB().getMonth();
  if(monthBorn == 11)
  {
   educationStartOffset = 8;
  }
  else
  {
   educationStartOffset = (7-monthBorn);
  }
  if( chapterPrecision == "weeks" ) {
    educationStartOffset *= 4;
  }
  else if( chapterPrecision == "years" ) {
    educationStartOffset /= 12;
  }

  if (localStorage.fixedChapters == "YES") {
    educationStartOffset = 0;
  }

  firstChapter = Math.ceil(firstChapter + educationStartOffset);
  if( firstChapter > totalProgressUnits ) firstChapter = totalProgressUnits;
  var secondChapter = firstChapter + (savedChapterLengths[1]);
  if( secondChapter > totalProgressUnits ) secondChapter = totalProgressUnits;
  var thirdChapter = secondChapter + (savedChapterLengths[2]);
  if( thirdChapter > totalProgressUnits ) thirdChapter = totalProgressUnits;
  var fourthChapter = thirdChapter + (savedChapterLengths[3]);
  if( fourthChapter > totalProgressUnits ) fourthChapter = totalProgressUnits;
  var fifthChapter = fourthChapter + (savedChapterLengths[4]);
  if( fifthChapter > totalProgressUnits ) fifthChapter = totalProgressUnits;
  //540
  var sixthChapter = fifthChapter + (savedChapterLengths[5]);
  if( sixthChapter > totalProgressUnits ) sixthChapter = totalProgressUnits;
  //141
  var seventhChapter = sixthChapter + (savedChapterLengths[6]);
  if( seventhChapter > totalProgressUnits ) seventhChapter = totalProgressUnits;
  var eighthChapter = totalProgressUnits;

  return [[beginningChapter, firstChapter], [firstChapter, secondChapter], [secondChapter, thirdChapter]
    ,[thirdChapter, fourthChapter], [fourthChapter, fifthChapter]
    ,[fifthChapter, sixthChapter], [sixthChapter, seventhChapter]
    ,[seventhChapter, eighthChapter]];
}


function getColorTheme()
{
  var themes = {
    "def" : ['#EEEEEE', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161', '#424242', '#2E2E2E'],
    "light" : ['#212121', '#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0', '#ECECEC'],
    "dawn" : ['#FFEB3B', '#FBC02D', '#F9A825', '#FF9800', '#F57C00', '#E65100', '#795548', '#4E342E'],
    "dusk" : ['#391003', '#5D1A25', '#722007','#ab300a', '#bf360c', '#cb5e3c', '#C47A6F', '#df9a85'],
    "twilight" : ['#4527A0', '#283593', '#3F51B5', '#5C6BC0', '#8c97d2', '#78909C', '#B0BEC5', '#ECEFF1'],
    "retro" : ['#D4184E', '#FF984C', '#00E8BB', '#18CAD4','#D4184E', '#FF984C', '#00E8BB', '#18CAD4'],
    "rainbowl" : ['#B71C1C', '#E65100', '#FFD600', '#1B5E20', '#004D40', '#3378af', '#673AB7', '#482880'],
    "rainbowd" : ['#ee4035', '#f37736', '#fcec4d', '#7bc043', '#009688', '#0392cf', '#644ca2', '#482880'],
    "cupid" : ['#ef95b4', '#ea729b', '#e54f83', '#c91e5a', '#AF2B5B', '#7C465D', '#543544', '#2B242A'],
    "rasta" : ['#156900', '#1E9600', '#61b54c', '#ccc100', '#FFF200', '#b20000', '#FF0000', '#FF3232'],
    "sky" : ['#007dff', '#009fff', '#00aaff', '#00d2ff', '#77dcf2', '#a0e7db', '#c9ead2', '#e7ffcb']
  };

  var savedTheme = localStorage.getItem("colorTheme");

  if (savedTheme === null)
  {
    return themes.def;
  }
  else
  {
    switch (savedTheme)
    {
      case "default":
        return themes.def;
      case "dark":
        //Dark removed
        return themes.def;
      case "light":
        return themes.light;
      case "dawn":
        return themes.dawn;
      case "dusk":
        return themes.dusk;
      case "twilight":
        return themes.twilight;
      case "retro":
        return themes.retro;
      case "rainbowd":
        return themes.rainbowd;
      case "rainbowl":
        return themes.rainbowl;
      case "cupid":
        return themes.cupid;
      case "rasta":
        return themes.rasta;
      case "sky":
        return themes.sky;
      default:
        return themes.def;
    }
  }
}

function getPopulationValue(forYearString)
{
  var populationDictionary = {
    "1950":2525149000,
    "1951":2571868000,
    "1952":2617940000,
    "1953":2664029000,
    "1954":2710678000,
    "1955":2758315000,
    "1956":2807246000,
    "1957":2857663000,
    "1958":2909651000,
    "1959":2963216000,
    "1960":3018344000,
    "1961":3075073000,
    "1962":3133554000,
    "1963":3194075000,
    "1964":3256989000,
    "1965":3322495000,
    "1966":3390686000,
    "1967":3461343000,
    "1968":3533967000,
    "1969":3607866000,
    "1970":3682488000,
    "1971":3757735000,
    "1972":3833595000,
    "1973":3909722000,
    "1974":3985734000,
    "1975":4061399000,
    "1976":4136542000,
    "1977":4211322000,
    "1978":4286282000,
    "1979":4362190000,
    "1980":4439632000,
    "1981":4518602000,
    "1982":4599003000,
    "1983":4681211000,
    "1984":4765658000,
    "1985":4852541000,
    "1986":4942056000,
    "1987":5033805000,
    "1988":5126633000,
    "1989":5218978000,
    "1990":5309668000,
    "1991":5398329000,
    "1992":5485115000,
    "1993":5570045000,
    "1994":5653316000,
    "1995":5735123000,
    "1996":5815392000,
    "1997":5894155000,
    "1998":5971883000,
    "1999":6049205000,
    "2000":6126622000,
    "2001":6204311000,
    "2002":6282302000,
    "2003":6360765000,
    "2004":6439842000,
    "2005":6519636000,
    "2006":6600220000,
    "2007":6681607000,
    "2008":6763733000,
    "2009":6846480000,
    "2010":6929725000,
    "2011":7013427000,
    "2012":7097500000,
    "2013":7181715000,
    "2014":7265786000,
    "2015":7349472000,
    "2016":7404976783,
    "2017":7515280000,
    "2018":7632819325

  };

  if( !(forYearString in populationDictionary) ) {
    forYearInt = Number(forYearString);
    while( !(forYearInt.toString() in populationDictionary ) ) {
      forYearInt-=1;
    }
    forYearString = forYearInt.toString();
  }
  return populationDictionary[forYearString];
}

//https://esa.un.org/unpd/wpp/DataQuery/

function getBirthRateValue(forYearString)
{
  var birthRateDictionary = {
    "1950":97473000,
    "1951":97473000,
    "1952":97473000,
    "1953":97473000,
    "1954":97473000,
    "1955":102587000,
    "1956":102587000,
    "1957":102587000,
    "1958":102587000,
    "1959":102587000,
    "1960":112227000,
    "1961":112227000,
    "1962":112227000,
    "1963":112227000,
    "1964":112227000,
    "1965":119434000,
    "1966":119434000,
    "1967":119434000,
    "1968":119434000,
    "1969":119434000,
    "1970":122235000,
    "1971":122235000,
    "1972":122235000,
    "1973":122235000,
    "1974":122235000,
    "1975":121411000,
    "1976":121411000,
    "1977":121411000,
    "1978":121411000,
    "1979":121411000,
    "1980":129292000,
    "1981":129292000,
    "1982":129292000,
    "1983":129292000,
    "1984":129292000,
    "1985":139663000,
    "1986":139663000,
    "1987":139663000,
    "1988":139663000,
    "1989":139663000,
    "1990":135287000,
    "1991":135287000,
    "1992":135287000,
    "1993":135287000,
    "1994":135287000,
    "1995":130062000,
    "1996":130062000,
    "1997":130062000,
    "1998":130062000,
    "1999":130062000,
    "2000":131686000,
    "2001":131686000,
    "2002":131686000,
    "2003":131686000,
    "2004":131686000,
    "2005":136113000,
    "2006":136113000,
    "2007":136113000,
    "2008":136113000,
    "2009":136113000,
    "2010":139843000,
    "2011":139843000,
    "2012":139843000,
    "2013":139843000,
    "2014":139843000,
    "2015":140625000,
    "2016":140625000,
    "2017":140625000,
    "2018":141970439
  };

  if( !(forYearString in birthRateDictionary) ) {
    forYearInt = Number(forYearString);
    while( !(forYearInt.toString() in birthRateDictionary ) ) {
      forYearInt-=1;
    }
    forYearString = forYearInt.toString();
  }
  return birthRateDictionary[forYearString];
}

//Crude birth rate, take population, divide by 1000, then multiply by the value