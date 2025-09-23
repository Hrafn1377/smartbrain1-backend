// Use dynamic import for node-fetch
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const handleClarifai = async (req, res) => {
  console.log('=== CLARIFAI REQUEST START ===');
  console.log('Request body:', req.body);
  
  const { imageUrl } = req.body;
  console.log('Image URL:', imageUrl);
  
  const PAT = '6b80d0273f724340bea1820da74b827a';
  const USER_ID = 'clarifai';
  const APP_ID = 'main';
  const MODEL_ID = 'general-image-recognition';
  const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [{
      "data": {
        "image": {
          "url": imageUrl
        }
      }
    }]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  try {
    console.log('About to make fetch request...');
    const response = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions);
    console.log('Fetch response received');
    const data = await response.json();
    console.log('Clarifai response:', data);
    res.json(data);
  } catch (err) {
    console.log('=== FETCH ERROR ===');
    console.log('Error:', err);
    console.log('Error message:', err.message);
    res.status(500).json({ error: 'Failed to get predictions' });
  }
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  if (!id || isNaN(id)) {
    return res.status(400).json('invalid user id');
  }
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries || entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
};

module.exports = {
  handleClarifai,
  handleImage
};