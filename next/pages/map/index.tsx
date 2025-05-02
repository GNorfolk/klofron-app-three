import { useState } from 'react';
import Link from 'next/link'
import { BaseLayout } from '@/components/component/base-layout'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import { BoxLayout, BoxLayoutSingle } from '@/components/component/box-layout'
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex, GridGenerator } from 'react-hexgrid';
import axios from 'axios'

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
  const [qDiff, setQDiff] = useState(0);
  const [rDiff, setRDiff] = useState(0);
  const edge = 11;

  const fetchQuery = `/v1/hex?q=${qDiff}&r=${rDiff}&s=${-qDiff-rDiff}&max=${edge}`;

  const { isLoading, error, data } = useQuery({
    queryKey: ['mapData', qDiff, rDiff],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + fetchQuery).then((res) => res.json()),
    enabled: theRouter.isReady
  });

  type HexData = {
    hex_q_coordinate: number;
    hex_r_coordinate: number;
    hex_s_coordinate: number;
    hex_land: boolean;
  };

  const createHex = useMutation({
    mutationFn: (dataObject: HexData) => {
      return axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/v1/hex`, dataObject);
    },
  });

  if (!theRouter.isReady) return null;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Oh dear</p>;

  const size = 2.5;
  const spacing = 1.1;
  const xDiff = spacing * (-size * Math.sqrt(3) * (qDiff + rDiff / 2));
  const yDiff = spacing * (-size * 3 / 2 * rDiff);
  const hexagons = GridGenerator.hexagon(edge);

  return (
    <div>
      <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
        <Layout size={{ x: size, y: size }} flat={false} spacing={spacing} origin={{ x: xDiff, y: yDiff }}>
          {/* Background hexes */}
          {hexagons.map((hex, i) => (
            <Hexagon
              key={`base-${i}`}
              q={hex.q + qDiff}
              r={hex.r + rDiff}
              s={hex.s}
              className={getColour(null, 'gray') + ' stroke-slate-500 stroke-[0.2]'}
              onClick={(event) => {
                const dataObject: HexData = {
                  hex_q_coordinate: hex.q + qDiff,
                  hex_r_coordinate: hex.r + rDiff,
                  hex_s_coordinate: hex.s - qDiff - rDiff,
                  hex_land: !event.shiftKey,
                };
                createHex.mutate(dataObject, {
                  onSettled: (data, error: any) => {
                    client.invalidateQueries({ queryKey: ['mapData'] });
                    if (error) {
                      console.log(error.response?.data?.message ?? 'Unknown error');
                    } else {
                      console.log('Created!');
                    }
                  },
                });
              }}
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
              onClick={(event) => {
                const dataObject: HexData = {
                  hex_q_coordinate: hex_q_coordinate,
                  hex_r_coordinate: hex_r_coordinate,
                  hex_s_coordinate: hex_s_coordinate,
                  hex_land: !event.shiftKey,
                };
                createHex.mutate(dataObject, {
                  onSettled: (data, error: any) => {
                    client.invalidateQueries({ queryKey: ['mapData'] });
                    if (error) {
                      console.log(error.response?.data?.message ?? 'Unknown error');
                    } else {
                      console.log('Created!');
                    }
                  },
                });
              }}
            />
          ))}
          {/* Navigation hexes */}
          <Hexagon q={edge + qDiff} r={0 + rDiff} s={-edge} className={getColour(null, 'orange') + ' stroke-slate-500 stroke-[0.2]'} onClick={() => setQDiff(q => q + 1)} />
          <Hexagon q={-edge + qDiff} r={0 + rDiff} s={edge} className={getColour(null, 'orange') + ' stroke-slate-500 stroke-[0.2]'} onClick={() => setQDiff(q => q - 1)} />
          <Hexagon q={0 + qDiff} r={edge + rDiff} s={-edge} className={getColour(null, 'orange') + ' stroke-slate-500 stroke-[0.2]'} onClick={() => setRDiff(r => r + 1)} />
          <Hexagon q={0 + qDiff} r={-edge + rDiff} s={edge} className={getColour(null, 'orange') + ' stroke-slate-500 stroke-[0.2]'} onClick={() => setRDiff(r => r - 1)} />
          <Hexagon q={edge + qDiff} r={-edge + rDiff} s={0} className={getColour(null, 'orange') + ' stroke-slate-500 stroke-[0.2]'} onClick={() => {
            setQDiff(q => q + 1);
            setRDiff(r => r - 1);
          }} />
          <Hexagon q={-edge + qDiff} r={edge + rDiff} s={0} className={getColour(null, 'orange') + ' stroke-slate-500 stroke-[0.2]'} onClick={() => {
            setQDiff(q => q - 1);
            setRDiff(r => r + 1);
          }} />
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