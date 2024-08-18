import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { BoxLayoutSingle } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { BetrothalCreationListing } from '../@/components/component/betrothal'

export default function CreateFamilyBetrothals({ queryClient, userId, router }) {
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['createFamilyBetrothalsData' + router.query.family_id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person').then(
          (res) => res.json(),
        ),
    })
    
    if (isLoading) return (
      <div>
        <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <BoxLayoutSingle>
        <Container>
          <BetrothalCreationListing peopleData={data} familyId={router.query.family_id} />
        </Container>
      </BoxLayoutSingle>
    )

  }
}