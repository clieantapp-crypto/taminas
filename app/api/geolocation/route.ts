import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.IPDATA_API_KEY;

  if (!apiKey) {
    console.warn('IPDATA_API_KEY not configured, returning default country');
    return NextResponse.json({ country: 'Unknown' });
  }

  try {
    const response = await fetch(
      `https://api.ipdata.co/country_name?api-key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const country = await response.text();
    return NextResponse.json({ country });
  } catch (error) {
    console.error('Error fetching location:', error);
    return NextResponse.json({ country: 'Unknown' });
  }
}
