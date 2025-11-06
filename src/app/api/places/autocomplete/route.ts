import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return NextResponse.json(
        { error: 'Input is required and must be a non-empty string' },
        { status: 400 },
      );
    }

    // Usar la variable de entorno del servidor (no expuesta al cliente)
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key is not configured' },
        { status: 500 },
      );
    }

    // Llamar al endpoint moderno de Google Places API (New)
    const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
      },
      body: JSON.stringify({
        input: input.trim(),
        includedPrimaryTypes: ['establishment'], // Solo negocios/establecimientos
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Places API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch autocomplete suggestions', details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in autocomplete API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
