const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  const ip = event.headers['x-nf-client-connection-ip'] || 'unknown';
  const userAgent = event.headers['user-agent'] || 'unknown';
  const timestamp = new Date().toISOString();

  // Optional: use IP lookup service
  let country = 'Unknown';
  try {
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoRes.json();
    country = geoData.country_name || 'Unknown';
  } catch (err) {
    console.error('Geo lookup failed:', err.message);
  }

  // Log to Supabase
  const { error } = await supabase
    .from('downloads')
    .insert([{ ip, user_agent: userAgent, country, timestamp }]);

  if (error) {
    console.error('❌ Supabase insert error:', error);
  } else {
    console.log('✅ Download logged to Supabase');
  }

  // Redirect to installer
  return {
    statusCode: 302,
    headers: {
      Location: 'https://github.com/dylanoco/twitchMoments/releases/tag/vA.1.0.0' // or GitHub/S3 URL
    }
  };
};
