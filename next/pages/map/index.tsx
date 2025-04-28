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
    const { isLoading, error, data } = useQuery({
      queryKey: ['mapData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/hex').then(
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

    const hexagons = GridGenerator.hexagon(9);

    return (
      <div>
        <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
          <Layout size={{ x: 3, y: 3 }} flat={false} spacing={1.1} origin={{ x: 0, y: 0 }}>
            {
              hexagons.map((hex, i) => <Hexagon q={hex.q} r={hex.r} s={hex.s} className={getColour() + ' stroke-slate-500 stroke-[0.15]'} />)
            }
            {
              data.map(({ hex_id, hex_q_coordinate, hex_r_coordinate, hex_s_coordinate, hex_land }) => (
                <Hexagon key={hex_id} q={hex_q_coordinate} r={hex_r_coordinate} s={hex_s_coordinate} className={getColour(hex_land) + ' stroke-slate-500 stroke-[0.15]'} onClick={() => {
                  theRouter.push(`/map/${hex_id}`)
                }} />
              ))
            }
          </Layout>
        </HexGrid>
      </div>
    );
  }
}

function getColour(isLand?: boolean) {
  if (isLand != null) {
    return isLand ? 'fill-green-800' : 'fill-blue-800'
  } else {
    return 'fill-gray-500'
  }
}