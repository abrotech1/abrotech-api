const FormData = require('form-data');
const { Readable } = require('stream');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
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
// Extract the MIME type from the request
const contentType = req.headers['content-type'];

// Get the file extension based on the content type
const extension = mime.extension(contentType);

// Append the file to the form with the correct dynamic filename
form.append('fileToUpload', Readable.from(buffer), { 
  filename: `file.${extension}` // Filename follows your preferred pattern
});

      // form.append('userhash', '3dd217ecb3ee790b1be6aff01');

      // Send POST request to Catbox API
      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
      });

      const data = await response.text(); // Expect the URL as the response

      // Send back the Catbox URL as the response along with additional fields
      res.status(200).json({
        success: true,
        Creator: "ABRO TECH",
        Contact: "wa.me/2348100151048",
        url: data,  // Use the URL directly from the Catbox response
      });
    } catch (error) {
      console.error('Error uploading file:', error.message);
      res.status(500).json({ success: false, message: 'Failed to upload file to Catbox' });
    }
  } else {
    // Handle non-POST requests
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};
