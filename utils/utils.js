const TIME_UNITS = {
    MINUTES: 'm',
    HOURS: 'h',
    DAYS: 'd'
  };
  
  function calculateEndTime(timeText) {
    const now = new Date();
    const timeValue = parseInt(timeText.slice(0, -1));
    const timeUnit = timeText.slice(-1);
  
    switch (timeUnit) {
      case TIME_UNITS.MINUTES:
        now.setMinutes(now.getMinutes() + timeValue);
        break;
      case TIME_UNITS.HOURS:
        now.setHours(now.getHours() + timeValue);
        break;
      case TIME_UNITS.DAYS:
        now.setDate(now.getDate() + timeValue);
        break;
      default:
        throw new Error('Invalid time unit');
    }
  
    return now;
  }
  
  function calculateTimeSpent(startTime) {
    const now = new Date();
    const timeSpentMs = now - new Date(startTime);
    const seconds = Math.floor((timeSpentMs / 1000) % 60);
    const minutes = Math.floor((timeSpentMs / (1000 * 60)) % 60);
    const hours = Math.floor((timeSpentMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeSpentMs / (1000 * 60 * 60 * 24));
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  
  function updateTimer(timerSpan, endTime) {
    const now = new Date();
    const timeLeft = endTime - now;
  
    if (timeLeft <= 0) {
      timerSpan.textContent = 'Time is up!';
      return;
    }
  
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
    timerSpan.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }