import { useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef(null);
  const [qDiff, setQDiff] = useState(0);
  const [rDiff, setRDiff] = useState(0);
  // Set edge = 72 for full map
  const edge = 5;

  useEffect(() => {
    if (theRouter.isReady) {
      const q = Number(theRouter.query.q);
      const r = Number(theRouter.query.r);

      if (!isNaN(q)) setQDiff(q);
      if (!isNaN(r)) setRDiff(r);
    }
  }, [theRouter.isReady, theRouter.query.q, theRouter.query.r]);

  const fetchQuery = `/v1/hex?q=${qDiff}&r=${rDiff}&s=${-qDiff - rDiff}&max=${edge}`;

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

  const handleDownloadSVG = () => {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) {
      console.error('SVG not found');
      return;
    }
  
    const styledSvg = inlineStyles(svg);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(styledSvg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hexgrid-with-style.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!theRouter.isReady) return null;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Oh dear</p>;

  // set size = 1.5 and spacing = 1.0 for full map
  const size = 2.5;
  const spacing = 1.1;
  const xDiff = spacing * (-size * Math.sqrt(3) * (qDiff + rDiff / 2));
  const yDiff = spacing * (-size * 3 / 2 * rDiff);
  const hexagons = GridGenerator.hexagon(edge);

  return (
    <div ref={containerRef}>
      {/* Set viewbox of -150 -150 300 300 with origin q = -30 and r = -7 for full map */}
      <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
        <Layout size={{ x: size, y: size }} flat={false} spacing={spacing} origin={{ x: xDiff, y: yDiff }}>
          {/* Background hexes */}
          {hexagons.map((hex, i) => (
            <Hexagon
              key={`base-${i}`}
              q={hex.q + qDiff}
              r={hex.r + rDiff}
              s={hex.s}
              className={getColour(false) + ' stroke-slate-500 stroke-[0.2]'}
              onClick={(event) => {
                if (event.metaKey) {
                  theRouter.push(`/map?q=${hex.q + qDiff}&r=${hex.r + rDiff}`);
                } else {
                  const dataObject: HexData = {
                    hex_q_coordinate: hex.q + qDiff,
                    hex_r_coordinate: hex.r + rDiff,
                    hex_s_coordinate: hex.s - qDiff - rDiff,
                    hex_land: !event.shiftKey,
                  };
                }
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
                if (event.metaKey) {
                  theRouter.push(`/map?q=${hex_q_coordinate}&r=${hex_r_coordinate}`);
                } else {
                  const dataObject: HexData = {
                    hex_q_coordinate: hex_q_coordinate,
                    hex_r_coordinate: hex_r_coordinate,
                    hex_s_coordinate: hex_s_coordinate,
                    hex_land: !event.shiftKey,
                  };
                }
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
      <button onClick={handleDownloadSVG} style={{ marginTop: '1rem' }}>
        Download as SVG
      </button>
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

function inlineStyles(svg) {
  const copy = svg.cloneNode(true);

  const allElements = copy.querySelectorAll('*');
  const originalElements = svg.querySelectorAll('*');
  const computedStyles = [];

  for (let i = 0; i < allElements.length; i++) {
    const original = originalElements[i];
    const computed = window.getComputedStyle(original);
    const copyEl = allElements[i];

    for (let j = 0; j < computed.length; j++) {
      const key = computed[j];
      copyEl.style[key] = computed.getPropertyValue(key);
    }
  }

  return copy;
}