import Link from 'next/link'
import { BaseLayout } from '@/components/component/base-layout'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BoxLayoutSingle } from '@/components/component/box-layout'
import { HexGrid, Layout, Hexagon, GridGenerator } from 'react-hexgrid';

export default function Main({ client, router }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <BoxLayoutSingle>
          <ShowHexMap theRouter={router} client={client} />
        </BoxLayoutSingle>
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function ShowHexMap({ theRouter, client }) {
  const qDiff = -30
  const rDiff = 7
  const edge = 68;

  const fetchQuery = `/v1/hex?q=${qDiff}&r=${rDiff}&s=${-qDiff - rDiff}&max=${edge}`;

  const { isLoading, error, data } = useQuery({
    queryKey: ['mapData', qDiff, rDiff],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + fetchQuery).then((res) => res.json()),
    enabled: theRouter.isReady
  });

  if (!theRouter.isReady) return null;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Oh dear</p>;

  const size = 1.5;
  const spacing = 1.0;
  const xDiff = spacing * (-size * Math.sqrt(3) * (qDiff + rDiff / 2));
  const yDiff = spacing * (-size * 3 / 2 * rDiff);
  const hexagons = GridGenerator.hexagon(edge);

  return (
    <div className="w-[1000px] mx-auto">
      <HexGrid width={1000} height={800} viewBox="-150 -150 300 300">
        <Layout size={{ x: size, y: size }} flat={false} spacing={spacing} origin={{ x: xDiff, y: yDiff }}>
          {/* Background hexes */}
          {hexagons.map((hex, i) => (
            <Hexagon
              key={`base-${i}`}
              q={hex.q + qDiff}
              r={hex.r + rDiff}
              s={hex.s}
              className={getColour(false) + ' stroke-slate-500 stroke-[0.2]'}
            />
          ))}
          {/* Data hexes */}
          {data.map(({ hex_id, hex_q_coordinate, hex_r_coordinate, hex_s_coordinate, hex_land }) => (
            <Hexagon
              key={hex_id}
              q={hex_q_coordinate}
              r={hex_r_coordinate}
              s={hex_s_coordinate}
              className={getColour(hex_land) + ' stroke-slate-500 stroke-[0.2]'}
            />
          ))}
        </Layout>
      </HexGrid>
    </div>
  );
}

function getColour(isLand?: boolean, colour?: string) {
  if (isLand != null) {
    return isLand ? 'fill-green-800' : 'fill-blue-800'
  } else {
    if (colour == "gray") {
      return 'fill-gray-500'
    } else if (colour == "orange") {
      return 'fill-orange-800'
    } else if (colour == "red") {
      return 'fill-red-800'
    }
  }
}
