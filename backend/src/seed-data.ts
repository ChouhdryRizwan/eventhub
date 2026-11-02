import { EVENT_COPY } from './event-copy';

export const categories = [
  { name: 'Music', slug: 'music', icon: '🎵', color: '#7c3aed', description: 'Concerts, live shows and festivals.' },
  { name: 'Sports', slug: 'sports', icon: '⚽', color: '#059669', description: 'Matches, marathons and tournaments.' },
  { name: 'Technology', slug: 'technology', icon: '💻', color: '#2563eb', description: 'Conferences, summits and workshops.' },
  { name: 'Art & Culture', slug: 'art-culture', icon: '🎨', color: '#dc2626', description: 'Exhibitions, classes and cultural events.' },
  { name: 'Food & Drink', slug: 'food-drink', icon: '🍕', color: '#d97706', description: 'Food festivals, carnivals and tastings.' },
  { name: 'Community', slug: 'community', icon: '🤝', color: '#db2777', description: 'Volunteering, wellness and local meetups.' },
];

// [title, category slug, venue, lat, lng, date, price, featured]
const rows: [string, string, string, number, number, string, number, boolean][] = [
  ['Jazz Night 2026', 'music', 'Karachi Arts Council, Karachi', 24.8607, 67.0252, '2026-10-24T19:00:00+05:00', 0, true],
  ['City Football League', 'sports', 'National Stadium, Karachi', 24.8924, 67.0838, '2026-10-25T15:00:00+05:00', 0, true],
  ['AI & Future Tech Summit', 'technology', 'PNCA Convention Centre, Karachi', 24.8138, 67.0299, '2026-10-29T09:00:00+05:00', 1500, true],
  ['Food Festival 2026', 'food-drink', 'Defence Phase 8, Karachi', 24.7936, 67.0721, '2026-11-01T12:00:00+05:00', 500, true],
  ['Art Exhibition 2026', 'art-culture', 'Frere Hall, Karachi', 24.8441, 67.0325, '2026-11-05T10:00:00+05:00', 0, true],
  ['Yoga & Wellness Day', 'community', 'Clifton Beach, Karachi', 24.7876, 67.0286, '2026-11-08T07:00:00+05:00', 0, true],
  ['Dev Conference 2026', 'technology', 'Expo Centre, Karachi', 24.9004, 67.0816, '2026-11-12T09:00:00+05:00', 1500, false],
  ['Electronic Music Fest', 'music', 'Beach Luxury Hotel, Karachi', 24.8529, 67.0107, '2026-11-14T20:00:00+05:00', 2000, false],
  ['Karachi Marathon 2026', 'sports', 'Clifton to Sea View, Karachi', 24.8083, 67.0301, '2026-11-22T06:00:00+05:00', 800, false],
  ['Street Food Carnival', 'food-drink', 'Burns Road, Karachi', 24.8582, 67.008, '2026-11-28T17:00:00+05:00', 0, false],
  ['Photography Masterclass', 'art-culture', 'The Second Floor (T2F), Karachi', 24.8148, 67.0344, '2026-12-02T14:00:00+05:00', 3000, false],
  ['Community Clean-up Drive', 'community', 'Seaview DHA, Karachi', 24.7869, 67.0562, '2026-12-06T08:00:00+05:00', 0, false],
  ['Rock the City Concert', 'music', 'PCB Ground, Karachi', 24.8924, 67.0838, '2026-12-12T19:00:00+05:00', 2500, false],
  ['Badminton Championship', 'sports', 'KMC Sports Complex, Karachi', 24.9056, 67.0822, '2026-12-15T16:00:00+05:00', 300, false],
  ['Women in Tech Summit', 'technology', 'IBA Karachi', 24.942, 67.1141, '2026-12-18T09:00:00+05:00', 0, false],
  ['Food Photography Class', 'food-drink', 'Dolmen Mall Clifton, Karachi', 24.8, 67.0306, '2026-12-20T13:00:00+05:00', 1200, false],
];

export const events = rows.map(
  ([title, category, venue_address, latitude, longitude, start_datetime, ticket_price, is_featured]) => ({
    title,
    category,
    venue_address,
    latitude,
    longitude,
    start_datetime,
    ticket_price,
    is_free: ticket_price === 0,
    is_featured,
    status: 'published',
    ...EVENT_COPY[title],
  })
);
