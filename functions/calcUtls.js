function calcDuration(startTime, endTime) {
    const minutes = Math.max(0, (endTime - startTime) / 60000).toFixed(2); // in minutes
    Logger.log(`startTime: ${startTime}, endTime: ${endTime}, minutes: ${minutes}`);
    return minutes;
}