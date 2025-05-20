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