import { useRouter } from 'next/router'
import { useQuery, QueryClientProvider } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { BoxLayout } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { BetrothalPersonInfo, BetrothalCreation } from '../@/components/component/betrothal'

export default function CreateBetrothal({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <QueryClientProvider client={queryClient}>
        <BoxLayout left={
          <CreateBetrothalInfo personId={router.query.person_id} />
        } right={
          <CreateBetrothalForm familyId={router.query.family_id} personId={router.query.person_id} queryClient={queryClient} />
        } />
      </QueryClientProvider>
    )
  }
}

export function CreateBetrothalInfo({ personId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['CreateBetrothalInfoData' + personId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + personId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <h2 className="text-2xl leading-snug my-4 mx-0">Proposal Info</h2>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  return (
    <Container>
      <BetrothalPersonInfo personInfo={data} />
    </Container>
  )
}

export function CreateBetrothalForm({ familyId, personId, queryClient }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['CreateBetrothalFormData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + familyId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <h2 className="text-2xl leading-snug my-4 mx-0">Proposal Info</h2>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  return (
    <Container>
      <BetrothalCreation peopleData={data.family_people} familyId={familyId} personId={personId} queryClient={queryClient} familyName={data.family_name} />
    </Container>
  )
}