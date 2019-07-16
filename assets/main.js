$(function() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '200px' });
  client.get('ticket.requester.email').then(
    function(data) {
      var user_email = data['ticket.requester.email'];
      requestRollbarInfo(client, user_email);
    }
  );
});

function showInfo(data) {
  var requester_data = {
    'status': data.status,
    'rows' : data.rows
  };

  var source = $("#requester-template").html();
  var template = Handlebars.compile(source);
  var html = template(requester_data);
  $("#content").html(html);
}

function showError(response) {
  var error_data = {
    'status': response.status,
    'statusText': response.statusText
  };
  var source = $("#error-template").html();
  var template = Handlebars.compile(source);
  var html = template(error_data);
  $("#content").html(html);
}

function requestRollbarInfo(client, id) {

  const data = {};
  const settings = {
    url: 'https://api.rollbar.com/api/1/rql/jobs/',
    data: {
     query_string: 'SELECT item.title, timestamp, occurrence_id, project_slug, item.counter from item_occurrence WHERE timestamp > unix_timestamp() - 60 * 60 * 24 * 30 AND person.email="' + id + '" LIMIT 10',
     access_token: '{{setting.token}}'
    },
    type: 'POST',
    secure: true
  };

  client.request(settings).then(function(response) {
   console.log(response);
   data.status = response.result.status;

   if (data.status === 'success') {
     getResults(client, response, data);
   } else {
     console.log('Data not ready yet');

     const settingsCheck = {
       url: 'https://api.rollbar.com/api/1/rql/job/' + response.result.id,
       data: {
         access_token: '{{setting.token}}'
       },
       type: 'GET',
       dataType: 'json',
       secure: true
     };

     const checkResults = setInterval(function() {

       client.request(settingsCheck).then(function(res) {
         console.log('Checking status:', res.result.status);
         data.status = res.result.status;
         if (data.status === 'success') {
           clearInterval(checkResults);
           getResults(client, response, data);
         } else {
           showInfo(data);
         }
       }, function(response) {
         showError(response);
       });
     }, 5000);
   }
 }, function(response) {
   showError(response);
 });
}

function formatDate(date) {
  var cdate = new Date(date);
  date = cdate.toLocaleString();
  return date;
}

function getResults(client, response, data) {

  const settings = {
    url: 'https://api.rollbar.com/api/1/rql/job/' + response.result.id + '/result',
    data: {
      access_token: '{{setting.token}}'
    },
    type: 'GET',
    dataType: 'json',
    secure: true
  };

  client.request(settings).then(function(res) {

    const rows = res.result.result.rows;
    data.rows = [];

    client.metadata().then(function(metadata) {
      for (let i = 0; i < rows.length; i++) {
        data.rows.push({
          title: rows[i][0],
          url: 'https://rollbar.com/' + metadata.settings.account_name + '/' + rows[i][3] + '/items/' + rows[i][4] + '/occurrences/' + rows[i][2] + '/',
          timestamp: formatDate(rows[i][1] * 1000)
        });
      }
      showInfo(data);
    });
  }, function(response) {
    showError(response);
  });
}
