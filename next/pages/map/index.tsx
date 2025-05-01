import Link from 'next/link'
import { BaseLayout } from '@/components/component/base-layout'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BoxLayout, BoxLayoutSingle } from '@/components/component/box-layout'
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex, GridGenerator } from 'react-hexgrid';

export default function Main({ client, router }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <BoxLayoutSingle>
          <ShowHexMap theRouter={router} />
        </BoxLayoutSingle>
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function ShowHexMap({ theRouter }) {
  if (theRouter.isReady) {
    const qDiff = 0;
    const rDiff = 0;
    const fetchQuery = '/v1/hex?q=' + qDiff + '&r=' + rDiff;
    const { isLoading, error, data } = useQuery({
      queryKey: ['mapData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + fetchQuery).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <div>
        <p>loading...</p>
      </div>
    )
    if (error) return (
      <div>
        <p>oh dear</p>
      </div>
    )

    const edge = 7;
    const size = 2.5;
    const xDiff = -size * Math.sqrt(3) * (qDiff + rDiff/2);
    const yDiff = -size * 3/2 * rDiff;
    const hexagons = GridGenerator.hexagon(edge);

    return (
      <div>
        <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
          <Layout size={{ x: size, y: size }} flat={false} spacing={1.1} origin={{ x: xDiff, y: yDiff }}>
            {
              hexagons.map((hex, i) => <Hexagon q={hex.q + qDiff} r={hex.r + rDiff} s={hex.s} className={getColour(null, "gray") + ' stroke-slate-500 stroke-[0.2]'} />)
            }
            {
              data.map(({ hex_id, hex_q_coordinate, hex_r_coordinate, hex_s_coordinate, hex_land }) => (
                <Hexagon key={hex_id} q={hex_q_coordinate} r={hex_r_coordinate} s={hex_s_coordinate} className={getColour(hex_land) + ' stroke-slate-500 stroke-[0.2]'} onClick={() => {
                  theRouter.push(`/map/${hex_id}`)
                }} />
              ))
            }
            <Hexagon q={edge + qDiff} r={-edge + rDiff} s={0} className={getColour(null, "orange") + ' stroke-slate-500 stroke-[0.2]'} />
            <Hexagon q={edge + qDiff} r={0 + rDiff} s={-edge} className={getColour(null, "orange") + ' stroke-slate-500 stroke-[0.2]'} />
            <Hexagon q={0 + qDiff} r={edge + rDiff} s={-edge} className={getColour(null, "orange") + ' stroke-slate-500 stroke-[0.2]'} />
            <Hexagon q={0 + qDiff} r={-edge + rDiff} s={edge} className={getColour(null, "orange") + ' stroke-slate-500 stroke-[0.2]'} />
            <Hexagon q={-edge + qDiff} r={edge + rDiff} s={0} className={getColour(null, "orange") + ' stroke-slate-500 stroke-[0.2]'} />
            <Hexagon q={-edge + qDiff} r={0 + rDiff} s={edge} className={getColour(null, "orange") + ' stroke-slate-500 stroke-[0.2]'} />
          </Layout>
        </HexGrid>
      </div>
    );
  }
}

function getColour(isLand?: boolean, colour?: string) {
  if (isLand != null) {
    return isLand ? 'fill-green-800' : 'fill-blue-800'
  } else {
    if (colour == "gray") {
      return 'fill-gray-500'
    } else if (colour == "orange") {
      return 'fill-orange-800'
    }
  }
}