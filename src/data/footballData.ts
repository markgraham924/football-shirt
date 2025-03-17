// Football teams and leagues data

export interface Team {
  id: string;
  name: string;
  country: string;
  league?: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
}

// Example leagues data
export const leagues: string[] = [
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Eredivisie',
  'Primeira Liga',
  'MLS',
  'Championship',
  'Scottish Premiership',
  // Add more leagues as needed
];

// Example teams data
export const teams: string[] = [
  // Premier League
  'Arsenal',
  'Aston Villa',
  'Chelsea',
  'Liverpool',
  'Manchester City',
  'Manchester United',
  'Tottenham Hotspur',
  
  // La Liga
  'Barcelona',
  'Real Madrid',
  'Atletico Madrid',
  
  // Serie A
  'AC Milan',
  'Inter Milan',
  'Juventus',
  'Napoli',
  'Roma',
  
  // Bundesliga
  'Bayern Munich',
  'Borussia Dortmund',
  'RB Leipzig',
  
  // Add more teams as needed
];

// For a more structured approach, you could use objects instead of strings:
export const teamsStructured: Team[] = [
  { id: '1', name: 'Manchester United', country: 'England', league: 'Premier League' },
  { id: '2', name: 'Liverpool', country: 'England', league: 'Premier League' },
  // Add more structured team data as needed
];

export const leaguesStructured: League[] = [
  { id: '1', name: 'Premier League', country: 'England' },
  { id: '2', name: 'La Liga', country: 'Spain' },
  // Add more structured league data as needed
];
