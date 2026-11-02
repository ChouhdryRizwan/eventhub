// Descriptions and organizer details for the sample events (keyed by event title).
// Organizers are fictional; the contact details are placeholders on the reserved .example domain.

export interface EventCopy {
  short_desc: string;
  description: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
}

export const EVENT_COPY: Record<string, EventCopy> = {
  'Jazz Night 2026': {
    short_desc: 'A relaxed evening of live jazz: a quartet on stage, a late jam session and a room made for listening.',
    description:
      'Settle in for an unhurried night of live jazz in the heart of Saddar. The Karachi Jazz Collective quartet opens with a set of standards and originals, followed by an open jam where guest players from across the city join in.\n\nSeating is first-come, first-served, and the foyer café stays open all evening for chai and desserts. Doors open at 6:30 PM and the music starts at 7:00 PM sharp. Entry is free, but arriving early is a good idea.',
    organizer_name: 'Karachi Jazz Collective',
    organizer_email: 'hello@karachijazz.example',
    organizer_phone: '+92 300 1200451',
  },
  'City Football League': {
    short_desc: 'Matchday of the community league: six local clubs, back-to-back fixtures and food stalls on the concourse.',
    description:
      'The City Football League returns with its biggest matchday of the season. Six local clubs play back-to-back fixtures under the floodlights, with the league leaders meeting in the final game of the evening.\n\nFamilies are welcome in the main stand, and there are food stalls and a kids\' kick-about area on the concourse. Entry is free. Please bring a valid ID for the security check at the gate.',
    organizer_name: 'City Football League Committee',
    organizer_email: 'fixtures@cityleague.example',
    organizer_phone: '+92 301 5520188',
  },
  'AI & Future Tech Summit': {
    short_desc: 'A full-day summit on applied AI: keynotes, hands-on workshops and a start-up showcase.',
    description:
      'One day, three tracks: applied machine learning, AI in business, and building products people actually use. Morning keynotes set the scene, then you choose between practical workshops and panel talks with engineers and founders from Pakistan\'s growing tech scene.\n\nThe afternoon ends with a start-up showcase where early-stage teams pitch to an audience of investors and mentors. Lunch, refreshments and a certificate of attendance are included in the ticket price.',
    organizer_name: 'Future Tech Forum',
    organizer_email: 'summit@futuretechforum.example',
    organizer_phone: '+92 321 7788410',
  },
  'Food Festival 2026': {
    short_desc: 'Forty-plus stalls, live cooking demos and a dessert street — come hungry.',
    description:
      'Defence Phase 8 turns into a giant open-air kitchen for a day. Forty-plus stalls serve everything from smoky barbecue and biryani to fusion bites and a whole street of desserts, while chefs run live cooking demos on the main stage.\n\nThere is a family zone with games for kids and shaded seating throughout. Your ticket includes a tasting card for five small plates; extra plates are available at each stall.',
    organizer_name: 'Defence Food Collective',
    organizer_email: 'stalls@defencefood.example',
    organizer_phone: '+92 333 4100976',
  },
  'Art Exhibition 2026': {
    short_desc: 'Contemporary paintings, prints and sculpture by thirty emerging Karachi artists, with the artists present.',
    description:
      'Frere Hall\'s gardens and galleries host thirty emerging artists from across Karachi, showing paintings, prints, mixed media and small-scale sculpture. Many of the artists will be on site to talk about their work, and everything on display is available to buy.\n\nGuided walks run at 11:00 AM and 4:00 PM. The exhibition is free to enter and suitable for all ages — a good one to bring first-time gallery visitors to.',
    organizer_name: 'Frere Hall Arts Circle',
    organizer_email: 'curators@frereartscircle.example',
    organizer_phone: '+92 302 8830512',
  },
  'Yoga & Wellness Day': {
    short_desc: 'Sunrise yoga on the sand, breathwork, a guided meditation and a healthy brunch by the sea.',
    description:
      'Start the day at Clifton Beach with a sunrise yoga flow suitable for all levels, followed by breathwork, a guided meditation and a short talk on building simple wellness habits.\n\nBring a mat or towel and a bottle of water. A light, healthy brunch is served after the final session. The event is free; please arrive by 6:45 AM so we can start on time.',
    organizer_name: 'Seaside Wellness Club',
    organizer_email: 'namaste@seasidewellness.example',
    organizer_phone: '+92 345 2201886',
  },
  'Dev Conference 2026': {
    short_desc: 'Two tracks of talks on web, cloud and mobile engineering, plus a hallway career fair.',
    description:
      'Karachi\'s developer community meets at the Expo Centre for a day of practical engineering talks. Choose between a web & cloud track and a mobile & tooling track, with speakers from local product companies and international remote teams.\n\nBetween sessions, a hallway career fair connects developers with companies that are hiring, and a lightning-talks slot at the end is open to first-time speakers. Lunch is included.',
    organizer_name: 'Karachi Developers Network',
    organizer_email: 'cfp@karachidevs.example',
    organizer_phone: '+92 312 9005541',
  },
  'Electronic Music Fest': {
    short_desc: 'A night of electronic music by the sea: three stages, visuals and a sunrise closing set.',
    description:
      'Neon Tide Events brings an overnight electronic music festival to the waterfront, with three stages covering house, techno and melodic sets, supported by large-scale light and visual installations.\n\nThe closing set starts at sunrise on the terrace. Entry is 18+ with a valid ID. Food trucks, a chill-out zone and free water stations are on site, and shuttle pick-up points are listed on the ticket.',
    organizer_name: 'Neon Tide Events',
    organizer_email: 'tickets@neontide.example',
    organizer_phone: '+92 324 6677130',
  },
  'Karachi Marathon 2026': {
    short_desc: 'A seafront 21 km, 10 km and 5 km fun run from Clifton to Sea View, with a finishers\' medal for everyone.',
    description:
      'Run the length of Karachi\'s seafront at its best time of day. Choose the 21 km half marathon, the 10 km, or the 5 km fun run — all starting in Clifton and finishing at Sea View, with water points every two kilometres and a medical team on the route.\n\nEvery finisher receives a medal and a refreshment pack. Race-kit collection opens two days before the event; the start gun is at 6:00 AM.',
    organizer_name: 'Karachi Runners Club',
    organizer_email: 'register@karachirunners.example',
    organizer_phone: '+92 300 3342209',
  },
  'Street Food Carnival': {
    short_desc: 'An evening food walk down Burns Road: the old city\'s best street food, all in one lane.',
    description:
      'Burns Road has fed Karachi for generations, and this carnival closes the street to traffic for an evening so you can eat your way down it. Nihari, haleem, kebabs, falooda and more — served by the vendors who made them famous.\n\nVolunteer guides lead short food-history walks at 5:30 PM and 7:00 PM. Entry is free; you pay each vendor directly, and most plates cost under Rs. 400.',
    organizer_name: 'Burns Road Food Walk',
    organizer_email: 'walks@burnsroad.example',
    organizer_phone: '+92 315 1180734',
  },
  'Photography Masterclass': {
    short_desc: 'A hands-on day on composition, natural light and editing, with a guided shoot around the old city.',
    description:
      'A practical one-day masterclass for beginners and improvers. The morning covers composition, exposure and working with natural light; after lunch we head out on a guided shoot, then finish with a short editing session where you review and refine your best frames.\n\nBring any camera — a smartphone is fine. Small group size means plenty of one-to-one feedback. Lunch and a printed set of notes are included.',
    organizer_name: 'Lens & Light Studio',
    organizer_email: 'classes@lensandlight.example',
    organizer_phone: '+92 333 2209981',
  },
  'Community Clean-up Drive': {
    short_desc: 'Join neighbours for a morning beach clean-up at Seaview — gloves, bags and breakfast provided.',
    description:
      'Help restore a stretch of Seaview beach. Volunteers work in small teams, collecting and sorting waste, with gloves, bags and tools provided and a short safety briefing at the start.\n\nWe finish with a free breakfast and a count of what we collected. Wear closed shoes and a hat, and bring water. Everyone is welcome — students and school groups especially.',
    organizer_name: 'Clean Coast Karachi',
    organizer_email: 'volunteer@cleancoast.example',
    organizer_phone: '+92 346 0014420',
  },
  'Rock the City Concert': {
    short_desc: 'Six local rock and alternative bands, one stage and a very loud Saturday night.',
    description:
      'The biggest night on the local rock calendar. Six bands, from rising alternative acts to established headliners, play back-to-back sets with full production, lights and a proper sound system.\n\nGates open at 5:00 PM and the first band is on at 6:00 PM. Re-entry is not permitted, and bags are searched at the entrance. Earplugs are available at the merch stand.',
    organizer_name: 'Rock the City Productions',
    organizer_email: 'info@rockthecity.example',
    organizer_phone: '+92 322 8854017',
  },
  'Badminton Championship': {
    short_desc: 'Singles and doubles knockouts for juniors and adults, played on six indoor courts over one day.',
    description:
      'A one-day open championship with singles and doubles categories for juniors (under 16) and adults. Matches are knockouts played on six indoor courts, with umpires for the quarter-finals onwards.\n\nRegistration is per category and closes the day before the event. Spectators are welcome and can watch from the gallery. Please bring your own racket and non-marking shoes.',
    organizer_name: 'Karachi Badminton Circle',
    organizer_email: 'entries@karachibadminton.example',
    organizer_phone: '+92 305 7720913',
  },
  'Women in Tech Summit': {
    short_desc: 'Talks, mentoring circles and a career fair celebrating women building technology in Pakistan.',
    description:
      'A free summit for women working in, or moving into, technology. Speakers share how they built their careers in engineering, product and leadership, and small mentoring circles let you ask questions in a relaxed setting.\n\nA career fair runs throughout the day with companies actively hiring. Students are especially encouraged to attend. Refreshments are provided.',
    organizer_name: 'Women in Tech Karachi',
    organizer_email: 'hello@witkarachi.example',
    organizer_phone: '+92 313 4409265',
  },
  'Food Photography Class': {
    short_desc: 'Learn to shoot food that looks as good as it tastes — styling, lighting and editing with just a phone or camera.',
    description:
      'A relaxed, practical class on photographing food. You\'ll learn how to style a plate, work with window light and cheap reflectors, choose angles, and edit your shots so the colours look appetising rather than over-processed.\n\nWe shoot real dishes during the session and you are welcome to eat them afterwards. Bring a smartphone or camera; all props and ingredients are provided.',
    organizer_name: 'Lens & Light Studio',
    organizer_email: 'classes@lensandlight.example',
    organizer_phone: '+92 333 2209981',
  },
};
