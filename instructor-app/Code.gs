// ============================================================
// Code.gs - MVP: אפליקציית ניהול למורי נהיגה
// Human-in-the-Loop: העתק-הדבק + ניתוח אוטומטי + WhatsApp
// ============================================================

// --- הגדרות ---
var CALENDAR_ID = 'primary';

// ============================================================
// 1. SETUP - יצירת גיליונות
// ============================================================
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- גיליון Students ---
  var studentsSheet = ss.getSheetByName('Students');
  if (!studentsSheet) {
    studentsSheet = ss.insertSheet('Students');
    studentsSheet.appendRow(['שם מלא', 'טלפון', 'יתרת שיעורים', 'חוב כספי', 'מחיר לשיעור']);
    studentsSheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#4a90d9').setFontColor('white');
    studentsSheet.setFrozenRows(1);
    studentsSheet.setColumnWidth(1, 160);
    studentsSheet.setColumnWidth(2, 130);
    studentsSheet.setColumnWidth(3, 120);
    studentsSheet.setColumnWidth(4, 120);
    studentsSheet.setColumnWidth(5, 120);
  }

  // --- גיליון Log ---
  var logSheet = ss.getSheetByName('Log');
  if (!logSheet) {
    logSheet = ss.insertSheet('Log');
    logSheet.appendRow(['תאריך', 'פעולה שבוצעה', 'תוכן מקורי', 'סטטוס']);
    logSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#4a90d9').setFontColor('white');
    logSheet.setFrozenRows(1);
    logSheet.setColumnWidth(1, 160);
    logSheet.setColumnWidth(2, 220);
    logSheet.setColumnWidth(3, 350);
    logSheet.setColumnWidth(4, 120);
  }

  Logger.log('Setup completed - sheets created successfully');
  return 'הגיליונות נוצרו בהצלחה!';
}

// ============================================================
// 2. WEB APP - נקודת כניסה
// ============================================================
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('ניהול תלמידים - מורה נהיגה')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

// ============================================================
// 3. פונקציה ראשית - ניתוח טקסט וביצוע פעולה
// ============================================================
function parseAndAction(text) {
  var result = {
    success: false,
    action: '',
    message: '',
    whatsappPhone: '',
    whatsappMessage: '',
    studentName: '',
    needsPhone: false,
    needsScheduling: false,
    schedulingData: null
  };

  try {
    text = text.trim();

    if (!text) {
      result.message = 'לא הוזן טקסט. הדבק הודעה ונסה שוב.';
      return result;
    }

    // --- תרחיש א': טסט / מבחן מעשי ---
    if (containsAny(text, ['מבחן מעשי', 'טסט', 'מבחן נהיגה', 'בחינה מעשית'])) {
      return handleTest(text);
    }

    // --- תרחיש ב': תשלום ---
    if (containsAny(text, ['העברה מ', 'התקבל מ', 'ש"ח', 'שח', '₪', 'התקבלה העברה', 'Bit', 'ביט', 'PayBox', 'פייבוקס'])) {
      return handlePayment(text);
    }

    // --- תרחיש ג': בקשת שיעור ---
    if (containsAny(text, ['שיעור', 'מתי פנוי', 'קבע', 'לקבוע', 'תור', 'פנוי', 'זמין'])) {
      return handleLessonRequest(text);
    }

    // --- לא מזוהה ---
    result.message = 'לא הצלחתי לזהות את סוג ההודעה.\nנסה הודעה שמכילה:\n- "טסט" או "מבחן מעשי"\n- "העברה" או "ש"ח"\n- "שיעור" או "מתי פנוי"';
    logAction('לא מזוהה', text, 'נכשל');
    return result;

  } catch (e) {
    result.message = 'שגיאה: ' + e.message;
    logAction('שגיאה', text, 'נכשל - ' + e.message);
    return result;
  }
}

// ============================================================
// תרחיש א' - טסט (SMS מברוש)
// ============================================================
function handleTest(text) {
  var result = createEmptyResult('test');

  // חילוץ תאריך
  var dateInfo = extractDate(text);
  if (!dateInfo) {
    result.message = 'לא הצלחתי לחלץ תאריך מההודעה. וודא שיש תאריך בפורמט DD/MM/YYYY.';
    return result;
  }

  // חילוץ שעה
  var timeInfo = extractTime(text);
  var hours = timeInfo ? timeInfo.hours : 10;
  var minutes = timeInfo ? timeInfo.minutes : 0;
  var timeStr = padZero(hours) + ':' + padZero(minutes);

  // חילוץ שם
  var name = extractName(text);
  if (!name) {
    result.message = 'לא הצלחתי לזהות את שם התלמיד מההודעה.';
    return result;
  }

  // יצירת אירוע ביומן
  try {
    var startTime = new Date(dateInfo.year, dateInfo.month, dateInfo.day, hours, minutes, 0);
    var endTime = new Date(dateInfo.year, dateInfo.month, dateInfo.day, hours + 1, minutes, 0);

    var calendar = CalendarApp.getDefaultCalendar();
    var event = calendar.createEvent('טסט - ' + name, startTime, endTime);
    event.setColor(CalendarApp.EventColor.RED);

    var dateStr = dateInfo.day + '/' + (dateInfo.month + 1) + '/' + dateInfo.year;

    result.success = true;
    result.studentName = name;
    result.message = 'נוצר אירוע ביומן: טסט - ' + name + '\nתאריך: ' + dateStr + '\nשעה: ' + timeStr;

    // הודעת WhatsApp
    result.whatsappMessage = 'היי ' + name + '! קיבלתי את ההודעה. נקבע לך טסט לתאריך ' + dateStr + ' בשעה ' + timeStr + '. בהצלחה!';

    // טלפון
    var phone = getStudentPhone(name);
    if (phone) {
      result.whatsappPhone = formatPhoneForWhatsApp(phone);
    } else {
      result.needsPhone = true;
    }

    logAction('טסט - ' + name + ' ' + dateStr + ' ' + timeStr, text, 'הצליח');

  } catch (e) {
    result.message = 'שגיאה ביצירת אירוע ביומן: ' + e.message;
    logAction('טסט - שגיאה', text, 'נכשל - ' + e.message);
  }

  return result;
}

// ============================================================
// תרחיש ב' - תשלום (ביט / פייבוקס)
// ============================================================
function handlePayment(text) {
  var result = createEmptyResult('payment');

  // חילוץ סכום
  var amount = extractAmount(text);
  if (!amount) {
    result.message = 'לא הצלחתי לזהות את סכום התשלום מההודעה.';
    return result;
  }

  // חילוץ שם
  var name = extractPaymentName(text);
  if (!name) {
    name = extractName(text);
  }
  if (!name) {
    result.message = 'לא הצלחתי לזהות את שם המשלם מההודעה.';
    return result;
  }

  // עדכון בגיליון
  var updateResult = updateStudentPayment(name, amount);

  result.success = true;
  result.studentName = name;
  result.message = 'תשלום התקבל!\nשם: ' + name + '\nסכום: ' + amount + ' ₪';

  if (updateResult.found) {
    result.message += '\nיתרת חוב מעודכנת: ' + updateResult.newBalance + ' ₪';
  } else {
    result.message += '\nהתלמיד לא נמצא בגיליון. התשלום נרשם בלוג בלבד.';
  }

  // הודעת WhatsApp
  result.whatsappMessage = 'היי ' + name + ', תודה! התשלום ע"ס ' + amount + ' ₪ התקבל ועודכן במערכת.';

  // טלפון
  var phone = getStudentPhone(name);
  if (phone) {
    result.whatsappPhone = formatPhoneForWhatsApp(phone);
  } else {
    result.needsPhone = true;
  }

  logAction('תשלום - ' + name + ' ' + amount + '₪', text, 'הצליח');

  return result;
}

// ============================================================
// תרחיש ג' - בקשת שיעור (וואטסאפ)
// ============================================================
function handleLessonRequest(text) {
  var result = createEmptyResult('lesson');
  result.needsScheduling = true;

  var name = extractName(text);

  if (!name) {
    result.success = true;
    result.message = 'זוהתה בקשת שיעור.\nהזן את שם התלמיד, תאריך ושעה כדי לקבוע.';
    result.schedulingData = { name: '' };
  } else {
    result.success = true;
    result.studentName = name;
    result.message = 'זוהתה בקשת שיעור מ-' + name + '.\nקבע תאריך ושעה:';
    result.schedulingData = { name: name };

    var phone = getStudentPhone(name);
    if (phone) {
      result.whatsappPhone = formatPhoneForWhatsApp(phone);
    } else {
      result.needsPhone = true;
    }
  }

  logAction('בקשת שיעור - ' + (name || 'לא מזוהה'), text, 'ממתין לאישור');

  return result;
}

// ============================================================
// קביעת שיעור (לאחר אישור המורה)
// ============================================================
function scheduleLesson(name, dateStr, timeStr, phone) {
  var result = {
    success: false,
    message: '',
    whatsappPhone: '',
    whatsappMessage: ''
  };

  try {
    // פענוח תאריך
    var dateParts = dateStr.split(/[\/\-\.]/);
    var day = parseInt(dateParts[0]);
    var month = parseInt(dateParts[1]) - 1;
    var year = parseInt(dateParts[2]);
    if (year < 100) year += 2000;

    // פענוח שעה
    var timeParts = timeStr.split(':');
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1] || '0');

    var startTime = new Date(year, month, day, hours, minutes);
    var endTime = new Date(year, month, day, hours + 1, minutes);

    // יצירת אירוע
    var calendar = CalendarApp.getDefaultCalendar();
    var event = calendar.createEvent('שיעור - ' + name, startTime, endTime);
    event.setColor(CalendarApp.EventColor.CYAN);

    // עדכון יתרת שיעורים
    updateStudentLessons(name);

    // שם יום בעברית
    var days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    var dayName = days[startTime.getDay()];

    result.success = true;
    result.message = 'שיעור נקבע!\nשם: ' + name + '\nיום ' + dayName + ' ' + dateStr + '\nשעה: ' + timeStr;

    // הודעת WhatsApp
    result.whatsappMessage = 'היי ' + name + ', קבענו שיעור ליום ' + dayName + ' (' + dateStr + ') בשעה ' + timeStr + '. נתראה!';

    // טלפון
    if (phone) {
      result.whatsappPhone = formatPhoneForWhatsApp(phone);
      saveStudentPhone(name, phone);
    } else {
      var existingPhone = getStudentPhone(name);
      if (existingPhone) {
        result.whatsappPhone = formatPhoneForWhatsApp(existingPhone);
      }
    }

    logAction('שיעור נקבע - ' + name + ' ' + dateStr + ' ' + timeStr, '', 'הצליח');

  } catch (e) {
    result.message = 'שגיאה בקביעת שיעור: ' + e.message;
    logAction('שיעור - שגיאה', name + ' ' + dateStr + ' ' + timeStr, 'נכשל - ' + e.message);
  }

  return result;
}

// ============================================================
// שליפת שיעורים להיום
// ============================================================
function getTodayLessons() {
  try {
    var calendar = CalendarApp.getDefaultCalendar();
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    var events = calendar.getEvents(today, tomorrow);
    var lessons = [];

    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      var title = event.getTitle();
      // הצג רק אירועים שקשורים לנהיגה
      if (title.includes('שיעור') || title.includes('טסט') || title.includes('מבחן')) {
        lessons.push({
          title: title,
          time: Utilities.formatDate(event.getStartTime(), Session.getScriptTimeZone(), 'HH:mm'),
          endTime: Utilities.formatDate(event.getEndTime(), Session.getScriptTimeZone(), 'HH:mm'),
          isTest: title.includes('טסט') || title.includes('מבחן')
        });
      }
    }

    // מיון לפי שעה
    lessons.sort(function(a, b) {
      return a.time.localeCompare(b.time);
    });

    return lessons;

  } catch (e) {
    Logger.log('Error getting today lessons: ' + e.message);
    return [];
  }
}

// ============================================================
// הוספת תלמיד חדש
// ============================================================
function addStudent(name, phone, pricePerLesson) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName('Students');
  }

  // בדיקה אם כבר קיים
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().trim() === name.trim()) {
      // עדכון טלפון אם חסר
      if (!data[i][1] && phone) {
        sheet.getRange(i + 1, 2).setValue(phone);
      }
      return { success: true, message: 'התלמיד ' + name + ' כבר קיים במערכת.' };
    }
  }

  sheet.appendRow([name, phone || '', 0, 0, pricePerLesson || 0]);
  return { success: true, message: 'התלמיד ' + name + ' נוסף בהצלחה!' };
}

// ============================================================
// שליפת רשימת תלמידים
// ============================================================
function getStudentsList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var students = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      students.push({
        name: data[i][0].toString(),
        phone: data[i][1] ? data[i][1].toString() : '',
        lessonsLeft: data[i][2] || 0,
        debt: data[i][3] || 0,
        pricePerLesson: data[i][4] || 0
      });
    }
  }
  return students;
}

// ============================================================
// פונקציות עזר - חילוץ נתונים
// ============================================================

function createEmptyResult(action) {
  return {
    success: false,
    action: action,
    message: '',
    whatsappPhone: '',
    whatsappMessage: '',
    studentName: '',
    needsPhone: false,
    needsScheduling: false,
    schedulingData: null
  };
}

function containsAny(text, keywords) {
  for (var i = 0; i < keywords.length; i++) {
    if (text.indexOf(keywords[i]) !== -1) return true;
  }
  return false;
}

function extractDate(text) {
  // פורמט DD/MM/YYYY או DD.MM.YYYY או DD-MM-YYYY
  var match = text.match(/(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4})/);
  if (match) {
    var year = parseInt(match[3]);
    if (year < 100) year += 2000;
    return {
      day: parseInt(match[1]),
      month: parseInt(match[2]) - 1,
      year: year
    };
  }

  // נסה למצוא תאריך בפורמט מילולי: "15 בינואר" וכו'
  var hebrewMonths = {
    'ינואר': 0, 'פברואר': 1, 'מרץ': 2, 'מרס': 2, 'אפריל': 3,
    'מאי': 4, 'יוני': 5, 'יולי': 6, 'אוגוסט': 7,
    'ספטמבר': 8, 'אוקטובר': 9, 'נובמבר': 10, 'דצמבר': 11
  };

  for (var monthName in hebrewMonths) {
    var regex = new RegExp('(\\d{1,2})\\s*(?:ב)?' + monthName);
    var monthMatch = text.match(regex);
    if (monthMatch) {
      return {
        day: parseInt(monthMatch[1]),
        month: hebrewMonths[monthName],
        year: new Date().getFullYear()
      };
    }
  }

  return null;
}

function extractTime(text) {
  var match = text.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    return {
      hours: parseInt(match[1]),
      minutes: parseInt(match[2])
    };
  }

  // נסה פורמט "בשעה 10"
  var hourMatch = text.match(/(?:בשעה|שעה)\s*(\d{1,2})/);
  if (hourMatch) {
    return {
      hours: parseInt(hourMatch[1]),
      minutes: 0
    };
  }

  return null;
}

function extractName(text) {
  var patterns = [
    /(?:לתלמיד|לתלמידה|תלמיד|תלמידה)\s+(.+?)(?:\s+ליום|\s+לתאריך|\s+ב|\s+מס|\s*$)/,
    /(?:של|עבור)\s+(.+?)(?:\s*[-–]|\s+ב|\s*\d|\s*$)/,
    /(?:שם)\s*[:-]?\s*(.+?)(?:\s*[-–]|\s*\d|\s*$)/,
    /(?:העברה מ|התקבל מ|מאת)\s*[:-]?\s*(.+?)(?:\s*[-–]\s*|\s*סכום|\s*\d|\s*$)/,
    /^([א-ת\s]{2,25})\s*[-–:]\s*(?:שיעור|מתי|קבע|רוצה|אפשר)/
  ];

  for (var i = 0; i < patterns.length; i++) {
    var match = text.match(patterns[i]);
    if (match) {
      var name = match[1].trim();
      name = name.replace(/[\d₪"'\.]/g, '').trim();
      // ניקוי מילות מפתח שנתפסו בטעות
      name = name.replace(/\s*(ש"ח|שח|ביט|bit|העברה|סכום|תשלום)\s*/gi, '').trim();
      if (name.length >= 2 && name.length <= 30) {
        return name;
      }
    }
  }

  return '';
}

function extractPaymentName(text) {
  // ניסיון ספציפי לחילוץ שם מהודעות תשלום
  var patterns = [
    /(?:העברה מ|התקבל מ|התקבלה העברה מ|מאת)\s*[:-]?\s*(.+?)(?:\s*[-–]\s*|\s+(?:סכום|על|בסך|[\d]))/,
    /(?:העברה מ|התקבל מ|מאת)\s*[:-]?\s*(.+?)$/m,
    /(?:מ)\s*(.+?)\s+(?:התקבל|הועבר|נשלח)/
  ];

  for (var i = 0; i < patterns.length; i++) {
    var match = text.match(patterns[i]);
    if (match) {
      var name = match[1].trim();
      name = name.replace(/[\d₪"'\.]/g, '').trim();
      name = name.replace(/\s*(ש"ח|שח|ביט|bit)\s*/gi, '').trim();
      if (name.length >= 2 && name.length <= 30) {
        return name;
      }
    }
  }

  return '';
}

function extractAmount(text) {
  // נסה למצוא סכום ליד סימן מטבע
  var patterns = [
    /(\d[\d,]*\.?\d*)\s*(?:ש"ח|שח|₪)/,
    /(?:₪|ש"ח|שח)\s*(\d[\d,]*\.?\d*)/,
    /(?:סכום|סך|בסך)\s*(?:של\s*)?(\d[\d,]*\.?\d*)/,
    /(?:על סך|בגובה|בסכום)\s*(?:של\s*)?(\d[\d,]*\.?\d*)/
  ];

  for (var i = 0; i < patterns.length; i++) {
    var match = text.match(patterns[i]);
    if (match) {
      return parseFloat(match[1].replace(',', ''));
    }
  }

  // ברירת מחדל - מספר ראשון שנראה כמו סכום (3-4 ספרות)
  var genericMatch = text.match(/(\d{2,4})(?:\.\d{1,2})?/);
  if (genericMatch) {
    var num = parseFloat(genericMatch[0]);
    if (num >= 10 && num <= 9999) {
      return num;
    }
  }

  return 0;
}

function padZero(n) {
  return n < 10 ? '0' + n : '' + n;
}

// ============================================================
// פונקציות עזר - גיליון Students
// ============================================================

function getStudentPhone(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  if (!sheet) return '';

  var data = sheet.getDataRange().getValues();

  // חיפוש מדויק
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().trim() === name.trim()) {
      return data[i][1] ? data[i][1].toString() : '';
    }
  }

  // חיפוש חלקי
  for (var i = 1; i < data.length; i++) {
    var storedName = data[i][0] ? data[i][0].toString().trim() : '';
    if (storedName && (storedName.indexOf(name) !== -1 || name.indexOf(storedName) !== -1)) {
      return data[i][1] ? data[i][1].toString() : '';
    }
  }

  return '';
}

function saveStudentPhone(name, phone) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName('Students');
  }

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().trim() === name.trim()) {
      if (!data[i][1]) {
        sheet.getRange(i + 1, 2).setValue(phone);
      }
      return;
    }
  }

  // תלמיד לא נמצא - הוסף שורה חדשה
  sheet.appendRow([name, phone, 0, 0, 0]);
}

function formatPhoneForWhatsApp(phone) {
  phone = phone.toString().replace(/[\s\-\(\)\+]/g, '');

  if (phone.startsWith('972')) {
    return phone;
  } else if (phone.startsWith('0')) {
    return '972' + phone.substring(1);
  }

  return '972' + phone;
}

function updateStudentPayment(name, amount) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName('Students');
  }

  var data = sheet.getDataRange().getValues();

  // חיפוש מדויק
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().trim() === name.trim()) {
      var currentDebt = parseFloat(data[i][3]) || 0;
      var newBalance = currentDebt - amount;
      sheet.getRange(i + 1, 4).setValue(newBalance);
      return { found: true, newBalance: newBalance };
    }
  }

  // חיפוש חלקי
  for (var i = 1; i < data.length; i++) {
    var storedName = data[i][0] ? data[i][0].toString().trim() : '';
    if (storedName && (storedName.indexOf(name) !== -1 || name.indexOf(storedName) !== -1)) {
      var currentDebt = parseFloat(data[i][3]) || 0;
      var newBalance = currentDebt - amount;
      sheet.getRange(i + 1, 4).setValue(newBalance);
      return { found: true, newBalance: newBalance };
    }
  }

  return { found: false, newBalance: 0 };
}

function updateStudentLessons(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var storedName = data[i][0] ? data[i][0].toString().trim() : '';
    if (storedName === name.trim() || storedName.indexOf(name) !== -1 || name.indexOf(storedName) !== -1) {
      var lessons = parseInt(data[i][2]) || 0;
      if (lessons > 0) {
        sheet.getRange(i + 1, 3).setValue(lessons - 1);
      }

      // הוספת עלות שיעור לחוב
      var pricePerLesson = parseFloat(data[i][4]) || 0;
      if (pricePerLesson > 0) {
        var currentDebt = parseFloat(data[i][3]) || 0;
        sheet.getRange(i + 1, 4).setValue(currentDebt + pricePerLesson);
      }
      return;
    }
  }
}

// ============================================================
// רישום פעולות בלוג
// ============================================================
function logAction(action, originalText, status) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Log');
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName('Log');
  }

  var now = new Date();
  var dateFormatted = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
  sheet.appendRow([dateFormatted, action, originalText.substring(0, 500), status]);
}
