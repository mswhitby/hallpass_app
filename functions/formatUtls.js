function formatDate(dateTime, formatStr="yyyy-MM-dd") {
    const tz = Session.getScriptTimeZone();
    return Utilities.formatDate(dateTime, tz, formatStr)
}

function formatTime(dateTime, formatStr="hh:mm:ss") {
    const tz = Session.getScriptTimeZone();
    return Utilities.formatDate(dateTime, tz, formatStr)
}

function formatMinutesToWords(decimalMinutes) {
    const minutes = Math.floor(decimalMinutes);
    const seconds = Math.round((decimalMinutes - minutes) * 60);

    const minLabel = minutes === 1 ? "min" : "mins";
    const secLabel = seconds === 1 ? "sec" : "secs";

    if (minutes && seconds) return `${minutes} ${minLabel}, ${seconds} ${secLabel}`;
    if (minutes) return `${minutes} ${minLabel}`;
    if (seconds) return `${seconds} ${secLabel}`;
    return "0 secs";
}

function formatRequestId(studentId, timestamp) {
    const tz = Session.getScriptTimeZone();
    const requestId = `${studentId}_${Utilities.formatDate(timestamp, tz, "yyyymmddHHMMSS")}`
    Logger.log(requestId)
    return requestId;
}

function formatTimestamp(dateTime, formatStr="yyyy-MM-dd HH:mm:ss") {
    const tz = Session.getScriptTimeZone();
    return Utilities.formatDate(dateTime, tz, formatStr)
}