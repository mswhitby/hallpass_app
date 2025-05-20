function getStudentHistory(studentId=85731) {
    Logger.log(`studentId: ${studentId}`)
    const sheet = SpreadsheetApp.getActive().getSheetByName("Requests");
    const [headers, ...data] = sheet.getDataRange().getValues();

    const studentIdIdx = headers.indexOf("Student ID");
    const timestampIdx = headers.indexOf("Timestamp");
    const periodIdx = headers.indexOf("Period");
    const destinationIdx = headers.indexOf("Destination");
    const durationIdx = headers.indexOf("Duration");

    const studentDataObj = data
        .filter(row => row[studentIdIdx].toString().trim() === studentId.toString().trim())
        .map(row => {
            return {
                Date: formatDate(row[timestampIdx], "M/dd/yy"),
                Period: `${row[periodIdx]} period`,
                Destination: row[destinationIdx],
                Duration: formatMinutesToWords(row[durationIdx]),
            };
        });

    Logger.log(`Student History: ${JSON.stringify(studentDataObj)}`);
    return studentDataObj;
}
