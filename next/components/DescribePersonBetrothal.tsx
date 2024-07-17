import { useRouter } from 'next/router'
import { useQuery, QueryClientProvider, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayoutSingle } from '../@/components/component/box-layout-single'
import { Container } from '../@/components/component/container'
import { Button } from "../@/components/ui/button"
import { ChurchIcon } from "../@/components/ui/icon"
import { ProposalListingOne } from '../@/components/component/proposal'
import { BetrothalInfo } from '../@/components/component/betrothal'

export default function DescribePersonBetrothal({ userId, queryClient }) {
  const router = useRouter()
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
        <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <QueryClientProvider client={queryClient}>
        <BoxLayoutSingle>
          {/* <ListPersonProposals data={data} showLink={false} queryClient={queryClient} userId={userId} /> */}
          {/* <ManagePersonProposals personData={data} queryClient={queryClient} userId={userId} /> */}
          <ListPersonBetrothalReceipts data={data} />
        </BoxLayoutSingle>
      </QueryClientProvider>
    )
  }
}

function ListPersonBetrothalReceipts({ data }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <Container>
        <BetrothalInfo personInfo={data} />
      </Container>
    )
  }
}

function ListPersonProposals({ data, showLink = true, queryClient = null, userId, showOffers = true }) {
  const router = useRouter()
  if (router.isReady) {
    const createProposal = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal', {
          proposal_person_id: id
        })
      },
    })

    type Inputs = {
      proposal_offer_id: number
      accepter_person_id: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (formData) => {
      axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal-offer/' + formData.proposal_offer_id, {
        accepter_person_id: formData.accepter_person_id,
      }).then(response => {
        queryClient.invalidateQueries()
        document.getElementById("cm-" + userId).innerText = ' '
      }).catch(error => {
        document.getElementById("cm-" + userId).innerText = error.response.data.message
      })
    }

    const familyBachelors = data.person_family.family_people.filter(ppl =>
      ppl.person_age >= 18 && ppl.person_partner_id === null
    )

    return (
      <Container>
        <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Info</h2>
        <ul className="list-none p-0 m-0">
          {
            data.person_proposals.length > 0 ?
              data.person_proposals.map(({ proposal_id, proposal_offers }) => (
                <li className="mt-0 mx-0 mb-5" key={data.proposal_id}>
                  <p>{data.person_name} has an existing proposal with id {proposal_id}.</p>
                  {
                    showOffers ?
                      proposal_offers.length > 0 ?
                        proposal_offers.map(({ proposal_offer_person, proposal_offer_dowry }) => (
                          <p>
                            Person with proposal is {data.person_name} who is {data.person_gender} and is {data.person_age} years old.
                            Person {data.person_name} will be betrothed to {proposal_offer_person.person_name} who is {proposal_offer_person.person_gender} and {proposal_offer_person.person_age} years old. 
                            They are also offering {proposal_offer_dowry.proposal_dowry_person.person_name} who is {proposal_offer_dowry.proposal_dowry_person.person_gender} and {proposal_offer_dowry.proposal_dowry_person.person_age} years old.
                          </p>
                        ))
                      :
                        <p>This proposal has no proposal offers.</p>
                    :
                      null
                  }
                  {
                    proposal_offers.length > 0 ?
                      familyBachelors.length > 0 ?
                        <div>
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <select {...register("proposal_offer_id", { required: true })}>
                              {
                                errors.proposal_offer_id ? document.getElementById("cm-" + router.query.id).innerText = "The Person field is required" : null
                              }
                              {
                                proposal_offers.map(({ proposal_offer_id, proposal_offer_person, proposal_offer_dowry }) => (
                                  <option value={proposal_offer_id}>{proposal_offer_person.person_name + " / " + proposal_offer_dowry.proposal_dowry_person.person_name}</option>
                                ))
                              }
                            </select>
                            <select {...register("accepter_person_id", { required: true })}>
                              {
                                errors.accepter_person_id ? document.getElementById("cm-" + router.query.id).innerText = "The Person field is required" : null
                              }
                              {
                                familyBachelors.map(({ person_id, person_name }) => (
                                  <option value={person_id}>{person_name}</option>
                                ))
                              }
                            </select>
                            <input type="submit" />
                          </form>
                          <small className="text-stone-500" id={'cm-' + userId}></small>
                        </div>
                      :
                        <p>There are no family people eligible to accept an offer.</p>
                    :
                      null
                  }
                </li>
              ))
            :
              <div>
                <p>{data.person_name} is not open to proposal offers!</p>
                {
                  data.person_family.family_user_id === userId ?
                    <button onClick={
                      () => {
                          createProposal.mutate(data.person_id, { onSettled: (res) => {
                            queryClient.invalidateQueries()
                          }
                        })
                      }
                    }>Create Proposal</button>
                  :
                    null
                }
              </div>
          }
        </ul>
        {
          showLink ? <p>Go to <Link href={`/person/${router.query.person_id}/proposal`}>Proposals</Link> page.</p> : null
        }
      </Container>
    )
  }
}

function ManagePersonProposals({ personData, queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['managePersonProposalsData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal').then(
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

    const proposals = data.filter(prop =>
      prop.proposal_person.person_family_id != personData.person_family_id
    )

    return (
      <>
        <Container>
          <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Info</h2>
          <p>The following people are open to proposals.</p>
          <ul className="list-none p-0 m-0">
            {proposals.map(({ proposal_id, proposal_person }) => (
              <li className="mt-0 mx-0 mb-5" key={proposal_id}>
                { personData.person_family.family_user_id === userId ?
                  <div>
                    <Link href={"/person/" + router.query.person_id + "/proposal/" + proposal_id}>{proposal_person.person_name + " " + proposal_person.person_family.family_name}</Link>
                  </div>
                :
                  <div>
                    <p>{proposal_person.person_name + " " + proposal_person.person_family.family_name}</p>
                  </div>
                }
              </li>
            ))}
          </ul>
        </Container>
        {/* <Container>
          <ProposalListingOne proposalData={data} />
        </Container> */}
      </>
    )
  }
}