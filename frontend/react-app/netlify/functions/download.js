const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  const ip = event.headers['x-nf-client-connection-ip'] || 'unknown';
  const userAgent = event.headers['user-agent'] || 'unknown';
  const timestamp = new Date().toISOString();

  let country = 'Unknown';
  try {
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoRes.json();
    console.log('Client IP:', ip);
    country = geoData.country_name || 'Unknown';
  } catch (err) {
    console.error('Geo lookup failed:', err.message);
  }

  const { error } = await supabase
    .from('downloads')
    .insert([{ ip, user_agent: userAgent, country, timestamp }]);

  if (error) {
    console.error('❌ Supabase insert error:', error);
  } else {
    console.log('✅ Download logged to Supabase');
  }

  return {
    statusCode: 302,
    headers: {
      // Location:'https://github.com/dylanoco/twitchMoments/releases/download/vA.1.0.0/QuickClips.Setup.1.0.0.exe'
      Location:'https://github.com/QuickClipsUK/quickclips-releases/releases/download/v1.0.0-alpha/QuickClips.Setup.1.0.0.exe'
    }
  };
};
