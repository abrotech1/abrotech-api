const FormData = require('form-data');
const { Readable } = require('stream');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { default: fetch } = await import('node-fetch');  // Dynamic import for node-fetch

      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('userhash', '3dd217ecb3ee790b1be6aff01'); 

      // Read the file from the request
      const buffer = await new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
      });
      
        // Add the file to the form
const fileType = req.headers['content-type'];
      form.append('fileToUpload', Readable.from(buffer), { filename: `file.${fileType.split('/')[1]}` });

      // Send POST request to Catbox API
      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
      });

      const data = await response.text(); // Expecting a URL from Catbox

      // Send back the Catbox URL as the response with additional fields
      res.status(200).json({
        success: true,
        Creator: "ABRO TECH",
        Contact: "wa.me/2348100151048",
        url: data,  // This will be the URL of the uploaded image
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to upload image to Catbox' });
    }
  } else {
    // Handle any non-POST requests
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};
