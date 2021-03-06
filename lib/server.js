const prComment = require('./github/prComment');
const prUpdate  = require('./github/prUpdate');
const prReview  = require('./github/prReview');


module.exports = (server) => {
  server.post('/webhooks', (req, res) => {

    let data = req.body;
    console.log('Webhook event received: ', data);
    console.log('Headers: ',req.headers);

    if (data.payload) {
      data = typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload
    }

    let event = req.headers['x-github-event'];

    switch(event) {
      case 'pull_request':
        prUpdate(data);
        break;
      case 'pull_request_review_comment':
      case 'issue_comment':
      case 'commit_comment':
        prComment(data);
        break;
      case 'pull_request_review':
        prReview(data);
        break;

      default:
        console.log('Event not recognized: ', event);
    }
    res.send();
  });

  server.get('/ping', (req, res) => {
    res.send();
  });
};
