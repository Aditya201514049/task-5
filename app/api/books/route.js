import { NextResponse } from 'next/server';
import { generateBooks } from '@/lib/generateBooks';

export async function GET(request) {
  try {
    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    
    // Parse and validate parameters
    const seed = parseInt(searchParams.get('seed')) || 42;
    const locale = searchParams.get('locale') || 'en-US';
    const page = parseInt(searchParams.get('page')) || 1;
    const count = parseInt(searchParams.get('count')) || 20;
    const avgLikes = parseFloat(searchParams.get('avgLikes')) || 5;
    const avgReviews = parseFloat(searchParams.get('avgReviews')) || 3;

    // Validate locale
    const validLocales = ['en-US', 'de-DE', 'fr-FR', 'ja-JP'];
    if (!validLocales.includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale. Must be one of: en-US, de-DE, fr-FR, ja-JP' },
        { status: 400 }
      );
    }

    // Validate numeric parameters
    if (page < 1 || count < 1 || count > 100) {
      return NextResponse.json(
        { error: 'Invalid page or count parameters' },
        { status: 400 }
      );
    }

    if (avgLikes < 0 || avgLikes > 10) {
      return NextResponse.json(
        { error: 'Average likes must be between 0 and 10' },
        { status: 400 }
      );
    }

    if (avgReviews < 0 || avgReviews > 10) {
      return NextResponse.json(
        { error: 'Average reviews must be between 0 and 10' },
        { status: 400 }
      );
    }

    // Generate books data
    const books = generateBooks({
      seed,
      locale,
      page,
      count,
      avgLikes,
      avgReviews
    });

    // Return response with metadata
    return NextResponse.json({
      books,
      pagination: {
        page,
        count,
        hasMore: count === 20, // Assume more data available if we got full page
        totalGenerated: (page - 1) * count + books.length
      },
      parameters: {
        seed,
        locale,
        avgLikes,
        avgReviews
      }
    });

  } catch (error) {
    console.error('Error generating books:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS (if needed)
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}