function makeHttpObject() {
  try {
    return new XMLHttpRequest();
  } catch (error) {}
  try {
    return new ActiveXObject('Msxml2.XMLHTTP');
  } catch (error) {}
  try {
    return new ActiveXObject('Microsoft.XMLHTTP');
  } catch (error) {}
  throw new Error('Could not create HTTP request object!');
}
var arr = [
  { name: 'Nguyễn Văn Huy', id: 41002308 },
  { name: 'Phan Văn Minh', id: 44634577 },
  { name: 'Nguyễn Thị Xuân', id: 40435014 },
  { name: 'Đặng Văn Mạnh', id: 44354858 },
  { name: 'Ngô Văn Hào', id: 40266280 },
  { name: 'Lê Thị Tâm', id: 40269547 },
];
var getPoint = new Promise(function (resolve, reject) {
  let count = 0;
  let result = [];
  arr.forEach((element, i, array) => {
    var request = makeHttpObject();
    request.open(
      'GET',
      `https://app.memrise.com/api/user/get/?user_id=${element.id}&with_leaderboard=true`
    );
    request.send(null);
    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        count++;
        var data = JSON.parse(request.responseText);
        data = data.user;
        result.push({
          name: element.name,
          points_week: data.leaderboard.points_week,
          points_month: data.leaderboard.points_month,
          points_alltime: data.leaderboard.points_alltime,
        });
        if (count == array.length) resolve(result);
      }
    };
  });
});

getPoint.then((result) => {
  const scoresWeek = document.getElementById('scores-week');
  const scoresMonth = document.getElementById('scores-month');
  const scoresAllTime = document.getElementById('scores-allTime');

  result.sort((a, b) => {
    return b.points_week - a.points_week;
  });
  result.forEach((element, i) => {
    message = `#${i + 1} [${element.points_week
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}] - ${element.name}`;
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    scoresWeek.appendChild(li);
  });

  result.sort((a, b) => {
    return b.points_month - a.points_month;
  });

  result.forEach((element, i) => {
    message = `#${i + 1} [${element.points_month
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}] - ${element.name}`;
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    scoresMonth.appendChild(li);
  });

  result.sort((a, b) => {
    return b.points_alltime - a.points_alltime;
  });

  result.forEach((element, i) => {
    message = `#${i + 1} [${element.points_alltime
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}] - ${element.name}`;
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    scoresAllTime.appendChild(li);
  });
});
