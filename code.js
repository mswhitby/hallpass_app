function doGet(url) {
    let view = "unknown";
    let role = "unknown";
    let template = "unknown";

    const browserView = (url.parameter.view || "").toLowerCase() 

    const email = Session.getActiveUser().getEmail();
    console.log("view: ", view)

    if (email.startsWith("deandra")) {
        role = "developer";
        view = browserView || role;
    } else if (email.endsWith("@judsonisd.org")) {
        role = "teacher";
        view = browserView || role;
    } else {
        role = "student";
        view = browserView || role;
    }
    
    if (view === "developer") {
      template = HtmlService.createTemplateFromFile("teacher/teacher");
      template.teacherEmail = email;
    } else if (view === "teacher") {
      template = HtmlService.createTemplateFromFile("teacher/teacher");
      template.teacherEmail = email;
    } else {
      template = HtmlService.createTemplateFromFile("student/student");
    }

    template.userEmail = email;
    template.role = role
    console.log(`Email: ${email}; Role: ${role}; View: ${view}`)
    return template.evaluate().setTitle(`Hall Pass Dashboard - ${role}`);
}

// let testId = 3900856
let testId = 402856
let testPeriod = "3rd"
function getStudentById(id) {
    const sheet = SpreadsheetApp.getActive().getSheetByName("Student Directory");
    const [headers, ...data] = sheet.getDataRange().getValues();

    const studentID = id || testId;

    const match = data.find(row => row[0].toString().trim() === studentID.toString().trim());

    if (!match) {
        Logger.log("Student ID not found: " + id);
        return null;
    }

    let studentObj = {};
    headers.forEach((h, idx) => studentObj[h] = match[idx]);
    studentObj["Name"] = `${studentObj["Last Name"]}, ${studentObj["First Name"]}${studentObj["M.I."] ? " " + studentObj["M.I."] + "." : ""}`;
    Logger.log(studentObj)
    return studentObj;
}

function getTeacherbyPeriod(student, period) {
    const sheet = SpreadsheetApp.getActive().getSheetByName("Teacher Directory");
    const [headers, ...data] = sheet.getDataRange().getValues();

    const colIndex = headers.indexOf(period); // e.g. returns 4
    Logger.log(`${period} column is at index:  + ${colIndex}`);

    const room = student[period]
    const match = data.find(row => row[colIndex].toString().trim() === room.toString().trim());
    Logger.log(match)

    if (!match) return null;
    
    let teacherObj = {};
    Logger.log(headers);
    headers.forEach((h, idx) => teacherObj[h] = match[idx]);
    teacherObj["Name"] = `${match[1]}, ${match[2][0]}.`;
    teacherObj["Display"] = `${room} — ${teacherObj["Name"]}`;
    Logger.log(teacherObj);
    return teacherObj;
}

function submitPassRequest(studentObj, teacherObj, period, destination) {
    const tz = Session.getScriptTimeZone();
    const now = new Date()
    const timestamp = Utilities.formatDate(now, tz, "yyyy-MM-dd HH:mm:ss")
    Logger.log(now) 
    const studentId = studentObj["Student ID"];
    const studentName = studentObj["Name"];
    const teacherEmail = teacherObj["Email"];
    const requestId = `${studentId}_${now.toISOString()}`
    const request = [timestamp, period, studentId, studentName, destination, teacherEmail, requestId];
    Logger.log(request)

    const pendingSheet = SpreadsheetApp.getActive().getSheetByName("Pending Requests");
    pendingSheet.appendRow(request);
    return `Request sent to ${teacherObj["Name"]}`;
}

function getPendingRequests(teacherEmail) {
    const userEmail = Session.getActiveUser().getEmail();
    const email = teacherEmail?.toString().replace(/"/g, '').trim().toLowerCase() || userEmail;
    Logger.log(`Final resolved email: ${email}`);
    
    Logger.log(`
    teacherEmail: ${teacherEmail}
    userEmail: ${userEmail}
    email: ${email}
    `)

    const sheet = SpreadsheetApp.getActive().getSheetByName("Pending Requests");
    const [headers, ...data] = sheet.getDataRange().getValues()
    
    const requests = data.filter(row => row[5] && row[5] === email); // column F = email;
    
    // const sanitizedRequests = requests.map(row => {
    //   const newRow = [...row];
    //   // newRow[0] = newRow[0] instanceof Date ? newRow[0].toISOString(): newRow[0];
    //   const dateStr = newRow[0] instanceof Date ? Utilities.formatDate(newRow[0], tz, "M/dd/yy h:mm") : newRow[0];
    //   newRow[0] = dateStr;
    //   return newRow;
    // });

    const sanitizedRequests = requests.map(row => {return formatRequest(row)});
    Logger.log(sanitizedRequests);

    Logger.log(`Returning requests: ${JSON.stringify(sanitizedRequests)}`);
    return sanitizedRequests;
}

function formatRequest(row) {
    const tz = Session.getScriptTimeZone();
    const date = Utilities.formatDate(row[0], tz, "M/dd/yy");
    const time = Utilities.formatDate(row[0], tz, "h:mm");
    const newRow = [date, time, ...row.slice(1)];
    Logger.log(newRow);
    return newRow;
}

// function approveRequest(timestamp) {
//     const tz = Session.getScriptTimeZone();
//     timestampTest = timestamp || new Date()

//     const pendingSheet = SpreadsheetApp.getActive().getSheetByName("Pending Requests");
//     const logSheet = SpreadsheetApp.getActive().getSheetByName("Pass Log");
//     const data = pendingSheet.getDataRange().getValues();

//     for (let i = 1; i < data.length; i++) {
//         if (data[i][0].toString() === timestampTest.toString()) {
//             logSheet.appendRow(data[i]);
//             pendingSheet.deleteRow(i + 1); // +1 for header
//             break;
//         }
//     }
// }

function approveRequest(requestId) {
    const pendingSheet = SpreadsheetApp.getActive().getSheetByName("Pending Requests");
    const logSheet = SpreadsheetApp.getActive().getSheetByName("Pass Log");
    const [headers, ...data] = pendingSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      const cellId = data[i][6];
      Logger.log(`cellId: ${cellId}`)

      if (cellId === requestId) {
        logSheet.appendRow(data[i]);
        // pendingSheet.deleteRow(i + 1); // +1 to account for header
        return true;
      }
    }

    throw new Error("Matching timestamp not found.");
}








