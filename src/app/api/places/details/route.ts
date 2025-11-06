import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { placeId } = await request.json();

    if (!placeId || typeof placeId !== 'string' || placeId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Place ID is required and must be a non-empty string' },
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

    // Llamar al endpoint moderno de Google Places API (New) - Place Details
    // Formato: places/{placeId} (el placeId puede venir como "places/PLACE_ID" o solo "PLACE_ID")
    // Normalizar: remover prefijo "places/" si existe
    const normalizedPlaceId = placeId.startsWith('places/')
      ? placeId.replace('places/', '')
      : placeId;

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${normalizedPlaceId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          // FieldMask: campos que queremos obtener (según documentación oficial)
          // formattedAddress, nationalPhoneNumber, websiteUri son campos Enterprise
          'X-Goog-FieldMask':
            'id,displayName,formattedAddress,nationalPhoneNumber,websiteUri,internationalPhoneNumber',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Places API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch place details', details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Normalizar la respuesta para facilitar el uso en el frontend
    // displayName viene como objeto {text, languageCode}, extraer solo el text
    const normalizedData = {
      ...data,
      displayName: data.displayName?.text || data.displayName,
    };

    return NextResponse.json(normalizedData);
  } catch (error) {
    console.error('Error in place details API route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
