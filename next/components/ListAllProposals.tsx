import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { BoxLayoutSingle } from '../@/components/component/box-layout-single'
import { Container } from '../@/components/component/container'
import { ProposalListingOne } from '../@/components/component/proposal-listing'

export default function ListAllProposals() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['listProposalsData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal').then(
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
    <BoxLayoutSingle>
      <Container>
        <h2 className="text-2xl leading-snug my-4 mx-0">Proposal Info</h2>
        <ul className="list-none p-0 m-0">
          {data.map(({ proposal_id, proposal_person_id, proposal_person }) => (
            <li className="mt-0 mx-0 mb-5" key={proposal_id}>
              <Link href={"/person/" + proposal_person_id}>{proposal_person.person_name + " " + proposal_person.person_family.family_name + "."}</Link>
            </li>
          ))}
        </ul>
      </Container>
      {/* <Container>
        <ProposalListingOne proposalData={data} />
      </Container> */}
    </BoxLayoutSingle>
  )
}