import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { BoxLayoutSingle } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { BetrothalListing, BetrothalEligibleListing } from '../@/components/component/betrothal'

export default function DescribeFamilyBetrothals({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyBetrothalData' + router.query.family_id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.family_id).then(
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

    if (data.family_user_id === userId) {
      return (
        <BoxLayoutSingle>
          <Container>
            <BetrothalListing familyPeople={data.family_people} />
          </Container>
          <Container>
            <BetrothalEligibleListing familyPeople={data.family_people} />
          </Container>
        </BoxLayoutSingle>
      )
    } else {
      router.push('/')
    }
  }
}