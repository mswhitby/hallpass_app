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