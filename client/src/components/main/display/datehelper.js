export default function Datehelper({ date }) {
    if (!date) {
      return '';
    }
  
    const currentDate = new Date();
    const questionDateObj = new Date(date);
    const timeDiff = currentDate - questionDateObj;
  
    // calculate seconds, minutes, hours, and days
    const secondsDiff = Math.floor(timeDiff / 1000);
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
    let answerFormat = '';
  
    if (daysDiff >= 1) {
      // If more than 24 hours, display the full date and time
      const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      answerFormat = questionDateObj.toLocaleString('en-US', options);
    } else if (hoursDiff >= 1) {
      answerFormat = `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
    } else if (minutesDiff >= 1) {
      answerFormat = `${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`;
    } else {
      answerFormat = `${secondsDiff} second${secondsDiff > 1 ? 's' : ''} ago`;
    }
    return answerFormat;
  }
  