import { getLeagueBySlug, getProductsByLeague } from '@/utils/shopifyData';
import LeagueContent from './LeagueContent';

export default async function LeaguePage({ params }) {
  // Await params in Server Component
  const { slug } = await params;

  // Get league data from Shopify
  const league = await getLeagueBySlug(slug);

  // Get products for this league
  const products = league ? await getProductsByLeague(league.name, 100) : [];

  // Pass data to Client Component
  return <LeagueContent league={league} products={products} />;
}
