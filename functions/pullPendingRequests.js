function pullPendingRequests(teacherEmail) {
    const userEmail = Session.getActiveUser().getEmail();
    const email = teacherEmail?.toString().replace(/"/g, '').trim().toLowerCase() || userEmail;
    Logger.log(`Final resolved email: ${email}`);

    Logger.log(`
    teacherEmail: ${teacherEmail}
    userEmail: ${userEmail}
    email: ${email}
    `)

    const sheet = SpreadsheetApp.getActive().getSheetByName("Requests");
    const [headers, ...data] = sheet.getDataRange().getValues()

    const teacherEmailIdx = headers.indexOf("Teacher");
    const timestampIdx = headers.indexOf("Timestamp");
    const timeOutIdx = headers.indexOf("Time-Out");
    const timeInIdx = headers.indexOf("Time-In");
    const tz = Session.getScriptTimeZone();

    const requests = data
        .filter(row => row[teacherEmailIdx] && row[teacherEmailIdx].toLowerCase() === email)
        .map(row => {
            const rawTimestamp = row[timestampIdx];
            const date = formatDate(rawTimestamp, "M/dd/yy");
            const time = formatTime(rawTimestamp, "h:mm a");

            const timeOutRaw = row[timeOutIdx];
            const timeInRaw = row[timeInIdx];
            const timeOut = (timeOutRaw instanceof Date) ? formatTime(timeOutRaw, "h:mm a") : timeOutRaw;
            const timeIn = (timeInRaw instanceof Date) ? formatTime(timeInRaw, "h:mm a") : timeInRaw;
            const duration = (timeInRaw instanceof Date && timeOutRaw instanceof Date) ? calcDuration(timeOutRaw, timeInRaw) : "";

            const rowObj = {
                Date: date,
                Time: time,
                TimeOut: timeOut,
                TimeIn: timeIn,
                Duration: duration
            };

            const excludedIdx = [timestampIdx, timeOutIdx, timeInIdx];
            headers.forEach((header, idx) => {
                if (!excludedIdx.includes(idx)) {
                    rowObj[header] = row[idx]; // Skip raw timestamp
                }
            });
            return rowObj;
        });

    Logger.log(`Returning requests: ${JSON.stringify(requests)}`);
    return requests;
}