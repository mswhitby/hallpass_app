function submitStudentPassRequest(studentObj, teacherObj, period, destination) {
    const tz = Session.getScriptTimeZone();
    const now = new Date()
    const timestamp = formatTimestamp(now)
    const studentId = studentObj["Student ID"];
    const requestId = formatRequestId(studentId, now);
    const studentName = studentObj["Name"];
    const teacherEmail = teacherObj["Email"];
    const request = [requestId, timestamp, period, studentId, studentName, destination, teacherEmail];
    Logger.log(request)

    const pendingSheet = SpreadsheetApp.getActive().getSheetByName("Requests");
    pendingSheet.appendRow(request);
    return `Request sent to ${teacherObj["Name"]}`;
}