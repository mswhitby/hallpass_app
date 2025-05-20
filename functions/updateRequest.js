function approveRequest(requestId) {
    updateRequest(requestId, "Approve");
}

function completeRequest(requestId) {
    updateRequest(requestId, "Returned");
}

function updateRequest(requestId, action) {
    Logger.log(requestId)
    const pendingSheet = SpreadsheetApp.getActive().getSheetByName("Requests");
    const [headers, ...data] = pendingSheet.getDataRange().getValues();

    const requestIdIdx = headers.indexOf("Unique ID");
    const statusIdx = headers.indexOf("Status");
    const timeOutIdx = headers.indexOf("Time-Out");
    const timeInIdx = headers.indexOf("Time-In");
    const scanInIdx = headers.indexOf("Scan-In");
    const scanOutIdx = headers.indexOf("Scan-Out");
    const durationIdx = headers.indexOf("Duration");

    const tz = Session.getScriptTimeZone();
    const now = new Date();
    Logger.log(`now: ${now}`);

    const timestamp = Utilities.formatDate(now, tz, "yyyy-MM-dd HH:mm:ss")

    const rowIndex = data.findIndex(row => row[requestIdIdx] === requestId);
    if (rowIndex === -1) throw new Error("Request ID not found");
    const request = data[rowIndex];

    const sheetRow = rowIndex + 2; // +2 accounts for 0-indexing and header row

    switch(action) {
        case "Approve":
            pendingSheet.getRange(rowIndex + 2, statusIdx + 1).setValue("Active");      // +1 because getRange is 1-indexed
            pendingSheet.getRange(rowIndex + 2, timeOutIdx + 1).setValue(now);
            break;
        case "Returned":
            const outTimeRaw = new Date(request[timeOutIdx]);
            Logger.log(`outTimeRaw: ${outTimeRaw}`);
            const outTime = (outTimeRaw instanceof Date) ? outTimeRaw : new Date(outTimeRaw);
            const minutes = calcDuration(outTime, now);
            pendingSheet.getRange(rowIndex + 2, statusIdx + 1).setValue("Returned");      // +1 because getRange is 1-indexed
            pendingSheet.getRange(rowIndex + 2, timeInIdx + 1).setValue(now);
            pendingSheet.getRange(sheetRow, durationIdx + 1).setValue(minutes);
            break;
        case "Scanned-In": {
            // code block
            break;
        }
        case "Scanned-Out": {
            // code block
            break;
        }
    }
}