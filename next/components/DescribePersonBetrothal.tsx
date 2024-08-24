import { useQuery, QueryClientProvider, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayoutSingle } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { Button } from "../@/components/ui/button"
import { ChurchIcon } from "../@/components/ui/icon"
import { BetrothalReciepts, BetrothalRecieptResponse } from '../@/components/component/betrothal'

export default function DescribePersonBetrothal({ userId, queryClient, router }) {
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['describePersonBetrothalData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + router.query.person_id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <div>
        <h2 className="text-2xl leading-snug my-4 mx-0 text-gray-200">Betrothal Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <QueryClientProvider client={queryClient}>
        <BoxLayoutSingle>
          <ListPersonBetrothalReceipts data={data} router={router} />
          <PersonBetrothalReceiptResponse data={data} queryClient={queryClient} router={router} />
        </BoxLayoutSingle>
      </QueryClientProvider>
    )
  }
}

function ListPersonBetrothalReceipts({ data, router }) {
  if (router.isReady) {
    return (
      <Container>
        <BetrothalReciepts receipts={data.person_betrothal_receipts} />
      </Container>
    )
  }
}

function PersonBetrothalReceiptResponse({ data, queryClient, router }) {
  if (router.isReady) {
    return (
      <Container>
        <BetrothalRecieptResponse data={data} queryClient={queryClient} />
      </Container>
    )
  }
}
