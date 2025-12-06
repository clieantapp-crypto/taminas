import { NextResponse } from 'next/server';

export async function GET() {
  const APIKEY = process.env.IPDATA_API_KEY;

  if (!APIKEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const country = await response.text();
    return NextResponse.json({ country });
  } catch (error) {
    console.error('Error fetching location:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    );
  }
}
