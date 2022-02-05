/**
 * 주어진 날짜를 포맷팅해서 문자열로 반환함
 * @param {Date} date
 * @returns
 */
const formatDate = (date) => {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  month = month >= 10 ? month : "0" + month;
  day = day >= 10 ? day : "0" + day;
  hour = hour >= 10 ? hour : "0" + hour;
  minute = minute >= 10 ? minute : "0" + minute;
  second = second >= 10 ? second : "0" + second;

  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
};

const timeDiff = (millis, curMillis) => {
  var diffMillis = curMillis - millis; // 밀리세컨드
  var sec = parseInt(diffMillis / 1000); // 초단위
  var min = parseInt(sec / 60); // 분단위
  if (min === 0) {
    return sec + "초전";
  }

  var hour = parseInt(min / 60); // 시간
  if (hour === 0) {
    return min + "분전";
  }
  var days = parseInt(hour / 24); // 일전~
  if (days === 0) {
    return hour + "시간전";
  }

  var month = parseInt(days / 30); // ~달전
  if (month === 0) {
    return days + "일전";
  }
  return month + "달전";
};
export default {
  formatDate,
  timeDiff,
};
