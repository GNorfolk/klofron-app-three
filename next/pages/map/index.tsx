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
  return (
    <div>
      <HexGrid width={1200} height={500} viewBox="-50 -50 100 100">
        <Layout size={{ x: 10, y: 10 }} flat={true} spacing={1.1} origin={{ x: 0, y: 0 }}>
          <Hexagon q={0} r={0} s={0} className='fill-slate-700 stroke-slate-500 stroke-[0.5]' />
          <Hexagon q={0} r={-1} s={1} className='fill-slate-700 stroke-slate-500 stroke-[0.5]' />
          <Hexagon q={0} r={1} s={-1} className='fill-slate-700 stroke-slate-500 stroke-[0.5]' />
          <Hexagon q={1} r={-1} s={0} className='fill-slate-700 stroke-slate-500 stroke-[0.5]' />
          <Hexagon q={1} r={0} s={-1} className='fill-slate-700 stroke-slate-500 stroke-[0.5]' />
          <Hexagon q={-1} r={1} s={0} className='fill-slate-700 stroke-slate-500 stroke-[0.5]' />
          <Hexagon q={-1} r={0} s={1} className='fill-slate-700 stroke-slate-500 stroke-[0.5]' />
          <Hexagon q={-2} r={0} s={1} className='fill-slate-700 stroke-slate-500 stroke-[0.5]' />
          <Path start={new Hex(0, 0, 0)} end={new Hex(-2, 0, 1)} />
        </Layout>
      </HexGrid>
    </div>
  );
}
