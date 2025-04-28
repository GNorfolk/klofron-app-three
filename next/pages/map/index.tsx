import Link from 'next/link'
import { BaseLayout } from '@/components/component/base-layout'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BoxLayout, BoxLayoutSingle } from '@/components/component/box-layout'
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';

export default function Main({ client, router }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <BoxLayoutSingle>
          <ShowHexMap />
        </BoxLayoutSingle>
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function ShowHexMap({}) {
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
  
  return (
    <div>
      <HexGrid width={1200} height={500} viewBox="-50 -50 100 100">
        <Layout size={{ x: 5, y: 5 }} flat={false} spacing={1.08} origin={{ x: 0, y: 0 }}>
          {
            data.map(({ hex_id, hex_q_coordinate, hex_r_coordinate, hex_s_coordinate, hex_land }) => (
              <Hexagon key={hex_id} q={hex_q_coordinate} r={hex_r_coordinate} s={hex_s_coordinate} className={getColour(hex_land) + ' stroke-slate-500 stroke-[0.2]'} />
            ))
          }
        </Layout>
      </HexGrid>
    </div>
  );
}

function getColour(isLand: boolean) {
  return isLand ? 'fill-green-800' : 'fill-blue-800'
}